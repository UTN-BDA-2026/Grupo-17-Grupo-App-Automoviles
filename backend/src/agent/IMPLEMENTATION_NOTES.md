# Notas de implementación — Agente recomendador de vehículos

Implementación de un agente conversacional recomendador de vehículos con
**LangGraph.js + Gemini**, integrado al backend NestJS existente.

## 1. Estructura encontrada (Fase 0)

- **Framework:** NestJS 11, **ORM:** TypeORM 0.3.x sobre **MySQL** (`synchronize: false`, migraciones).
- **Gestor:** npm. **TS:** `module/moduleResolution: nodenext`, `strictNullChecks: true`, `noImplicitAny: false` (no es `strict` pleno).
- **IA preexistente:** ChromaDB (`recommendation_manual`, 32 chunks) + embeddings Gemini (`gemini-embedding-2`).
- **Dominio vehículos:** `products/` con `Listing`, `Vehicle`, `Model`, `Brand`, `Store` y `Link` (en `scraper/models/`).
- **Chat:** entidades `ChatSession` + `Message` ya existían en `chat/models/` (módulo sin cablear).
- **`agent/`:** carpetas vacías (`nodes/`, `prompts/`, `graphs/`, `tools/`).

## 2. Servicios reutilizados (sin reescribir)

- `RecommendationManualService.query(question, limit, filter?)` — base vectorial de reglas
  (lo consume `vectorDBQuery.node`). La ingestión del manual **ya existía**
  (`sync()` + `POST /admin/vector/sync`); no se recreó (cubre la Sección 5.9 del prompt).
- `GeminiEmbeddingService` — embeddings (usado indirectamente por el servicio de reglas).
- `ListingService` — extendido con `filter()` (ver §3); el nodo relacional lo usa, sin tocar el ORM.
- `JwtAuthGuard` + `@CurrentUser` (`auth/`) — autenticación del `ChatController`.

## 3. Cambios a servicios/config existentes (retrocompatibles)

1. **`products/services/listing.service.ts`** — nuevo método público
   `filter(filters: ListingFilterDTO, limit = 20): Promise<Listing[]>` (QueryBuilder con
   los mismos joins que `get()`, `is_available = true`, condiciones AND por filtro no nulo).
   No modifica la firma de ningún método previo.
2. **`products/dto/listing-filter.dto.ts`** — nuevo DTO de filtros opcionales.
3. **`database/typeorm.config.ts`** — corregido el glob de entidades de chat:
   `chat/*.entity` → `chat/models/*.entity` (las entidades fueron reubicadas a `models/`).
   Necesario para que el CLI de migraciones cargue las entidades de chat.
4. **`.env.example`** — agregadas: `GEMINI_API_KEY` (faltaba pese a usarse), `AGENT_LLM_MODEL`,
   `AGENT_LLM_MODEL_FAST`, `AGENT_CONTEXT_SUMMARY_THRESHOLD`, `AGENT_RELATIONAL_TOP_K`,
   `AGENT_VECTOR_TOP_K`, y opcional `AGENT_CHECKPOINTER`.
5. **`chat/chat.module.ts`** — cableado (estaba vacío): `TypeOrmModule.forFeature`, `AuthModule`, `AgentModule`.

> **Migración:** NO se creó. Las tablas `chat_sessions` y `messages` ya existen con el esquema
> correcto (creadas en `1776996423908-InitialMigration` y ajustadas en `1777161992289-FixRelationships`).
> Solo se reubicaron las entidades, no cambió el esquema.

## 4. Decisiones de adaptación (vs. prompt original)

- **LLM = Gemini** (`@langchain/google-genai`, reutiliza `GEMINI_API_KEY`), no OpenAI/Anthropic:
  el proyecto ya está casado con Gemini. Modelos configurables por env.
- **Entidades de chat existentes** (`ChatSession`/`Message`) en vez de crear `Conversation`.
  `threadId` del grafo = `chat_session.id`.
- **Rutas + auth del proyecto**: `api/chat`, `JwtAuthGuard` + `@CurrentUser` (userId del token,
  **no** en el body, a diferencia del prompt). El módulo de auth usa Supabase.
- **`strict` del proyecto** respetado (no se forzó `strict: true`); se evita `any` igualmente.
- **`franc-min` es ESM puro**: se carga con `await import('franc-min')` dentro de `languageGuard`
  (compatible con `nodenext` + emisión CommonJS).
- **Persistencia de estado:** `MemorySaver` (abstracción `CheckpointerProvider`, conmutable por
  `AGENT_CHECKPOINTER`). MySQL es la fuente de verdad de los mensajes; el historial se pasa al
  grafo con los ids de MySQL para que `messagesStateReducer` deduplique. Los filtros acumulados
  (`hardFilters`/`softCriteria`) sobreviven entre turnos vía checkpointer por `threadId`.
- **Nodo extra `smallTalkResponder`**: el diagrama tiene una respuesta de small talk/out-of-scope
  que no estaba entre los 13 nodos nombrados; se agregó como nodo aparte.

## 5. Mapa de archivos del agente

```
agent/
├── agent.module.ts                 # wiring (ProductsModule, VectorStoreModule)
├── llm/gemini.provider.ts          # factory ChatGoogleGenerativeAI (modelo principal + rápido)
├── state/agentState.ts             # Annotation.Root + reducers de merge de filtros
├── schemas/                        # hardFilters, softCriteria, intent, extractionOutput (Zod)
├── prompts/                        # 7 prompts (+ spanishDirective) — todos en español
├── nodes/                          # 13 nodos + smallTalkResponder + helpers/types
├── graphs/recommendationGraph.ts   # StateGraph + conditional edges + fork paralelo
├── graphs/checkpointer.provider.ts # MemorySaver (abstracción)
└── services/agent.service.ts       # AgentService.sendMessage(threadId, msg, history, userId?)
```

Flujo: `languageGuard → contextSummarizer → intentClassifier →` (small talk | informativo |
`parameterExtractor → filterValidator →` (clarificación | fork `relacional ‖ vectorial` →
`resultsJoiner →` (sin resultados | `synthesizer → responseFormatter`))).

## 6. Endpoints

- `POST /api/chat` — crea conversación.
- `GET /api/chat` — lista conversaciones del usuario.
- `GET /api/chat/:id` — conversación + mensajes.
- `POST /api/chat/:sessionId/messages` — `{ content }` → persiste user msg, invoca agente,
  persiste assistant msg, devuelve `{ conversationId, userMessage, assistantMessage, metadata }`.

## 7. Verificación realizada

- `npm run build` — OK.
- `npm run lint` sobre los archivos nuevos — sin errores (los 65 errores restantes son
  preexistentes en `scraper/` y `vector-store/`, fuera de este alcance).
- `npm test` — el proyecto **no tiene tests** (0 archivos `.spec.ts`); no hay regresión.
- **Arranque (`node dist/main.js`)** — la app levanta correctamente: rutas `/api/chat/*` mapeadas,
  ChromaDB conectado (32 chunks), checkpointer y grafo compilados, "Nest application successfully started".
  No hay dependencia circular `AgentModule ↔ ChatModule`.

## 8. Verificación end-to-end pendiente (manual, requiere token JWT)

Los endpoints están protegidos por Supabase. Con la infra levantada (`db:up`, `cache:db:up`,
`vector:db:up`) y un token válido:
1. Mensaje en inglés → rechazo en español (no pasa por el LLM principal).
2. Mensaje vago → preguntas de clarificación.
3. Mensaje específico → recomendación justificada con `link` (o nota de ausencia).
4. Refinamiento ("ahora más barato") en el mismo `sessionId` → filtros mergeados (`metadata.filtersApplied`).
5. Filtros imposibles → `noResultsHandler` sugiere relajar, sin error.
6. Pregunta informativa → rama informativa, sin tocar la base relacional.
