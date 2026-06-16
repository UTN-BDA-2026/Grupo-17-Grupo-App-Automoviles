import { BaseMessage } from '@langchain/core/messages';
import { HardFilters } from '../schemas/hardFilters.schema';
import { SoftCriteria } from '../schemas/softCriteria.schema';
import { RecommendationRule } from '../state/agentState';
import { Listing } from '../../products/models/listing.entity';

/** Convierte el historial de mensajes en una transcripción legible. */
export function messagesToTranscript(messages: BaseMessage[]): string {
  return messages
    .map((m) => {
      const role = m.getType() === 'human' ? 'Usuario' : 'Asistente';
      const content =
        typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      return `${role}: ${content}`;
    })
    .join('\n');
}

/** Construye la query semántica priorizando criterios blandos + resumen de duros. */
export function buildSemanticQuery(
  soft: SoftCriteria,
  hard: HardFilters,
): string {
  const parts: string[] = [];
  if (soft.purpose) parts.push(`Uso: ${soft.purpose}`);
  if (soft.userProfile) parts.push(`Perfil: ${soft.userProfile}`);
  for (const [key, value] of Object.entries(soft.priorities)) {
    if (value) parts.push(`${key}: ${value}`);
  }
  const hardSummary = Object.entries(hard)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');
  if (hardSummary) parts.push(`Criterios: ${hardSummary}`);
  return parts.join('. ') || 'recomendación general de vehículo';
}

/** Aplana el QueryResult de ChromaDB (arrays anidados) a reglas planas. */
export function flattenRules(result: {
  documents: (string | null)[][];
  metadatas: (Record<string, unknown> | null)[][];
  distances: (number | null)[][];
}): RecommendationRule[] {
  const docs = result.documents?.[0] ?? [];
  const metas = result.metadatas?.[0] ?? [];
  const dists = result.distances?.[0] ?? [];
  const rules: RecommendationRule[] = [];
  for (let i = 0; i < docs.length; i++) {
    const content = docs[i];
    if (!content) continue;
    const meta = metas[i] ?? {};
    rules.push({
      content,
      section_number:
        typeof meta.section_number === 'number'
          ? meta.section_number
          : undefined,
      section_title:
        typeof meta.section_title === 'string' ? meta.section_title : undefined,
      distance: dists[i] ?? undefined,
    });
  }
  return rules;
}

/** Texto compacto de reglas para inyectar en el prompt de síntesis. */
export function rulesToText(rules: RecommendationRule[]): string {
  if (rules.length === 0) return '(sin reglas relevantes)';
  return rules
    .map((r) => {
      const header = r.section_title
        ? `[${r.section_number ?? '?'}. ${r.section_title}]`
        : '';
      return `${header}\n${r.content}`;
    })
    .join('\n\n---\n\n');
}

/** Serializa candidatos a JSON compacto con solo los campos relevantes + link. */
export function candidatesToCompactJson(listings: Listing[]): string {
  const compact = listings.map((l) => ({
    id: l.id,
    price: l.price,
    currency: l.currency,
    mileage: l.mileage,
    color: l.color,
    fuel_type: l.fuel_type,
    doors: l.doors,
    people_capacity: l.people_capacity,
    condition: l.condition,
    transmission: l.transmission,
    traction_control: l.traction_control,
    engine: l.engine,
    body_type: l.body_type,
    sole_owner: l.sole_owner,
    year: l.vehicle?.year,
    version: l.vehicle?.version,
    model: l.vehicle?.model?.name,
    brand: l.vehicle?.model?.brand?.name,
    equipment: l.equipment,
    link: l.link?.url ?? null,
  }));
  return JSON.stringify(compact);
}

/** Extrae texto plano de la respuesta de un modelo de chat. */
export function messageContentToString(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part: unknown) => {
        if (typeof part === 'string') return part;
        if (
          part &&
          typeof part === 'object' &&
          'text' in part &&
          typeof (part as { text: unknown }).text === 'string'
        ) {
          return (part as { text: string }).text;
        }
        return '';
      })
      .join('');
  }
  if (content == null) return '';
  return JSON.stringify(content);
}
