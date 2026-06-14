
import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChromaClient, Collection } from 'chromadb';

@Injectable()
export class UserContextMemoryRepository implements OnModuleInit {
    
    private client: ChromaClient
    private collection!: Collection
    private readonly collectionName = 'user_context_memory'

    constructor(private configService: ConfigService) {
        // Inicializamos el cliente con las variables de entorno
        this.client = new ChromaClient({
            path: `http://${this.configService.get<string>('VECTOR_DB_HOST')}:${this.configService.get<number>('VECTOR_DB_PORT')}`,
        })
    }

    public async onModuleInit() {
        try {
            // Nos aseguramos de que la colección exista al iniciar el módulo
            this.collection = await this.client.getOrCreateCollection({
                name: this.collectionName,
            })
        } 
        catch (error : any) {
            throw new InternalServerErrorException('No se pudo conectar con ChromaDB', error.message);
        }
    }

    /**
     * Almacena documentos en la base de datos vectorial.
     */
    public async store(ids: string[], documents: string[], metadatas: Record<string, any>[]) {
        return await this.collection.add({
            ids,
            metadatas,
            documents,
        });
    }

    /**
   * Consulta documentos basados exclusivamente en filtros de metadatos.
   */
    public async find(metadataFilter: Record<string, any>) {
        return await this.collection.get({
            where: metadataFilter,
        })
    }

    /**
     * Realiza una búsqueda semántica (query) basada en una pregunta del usuario.
     */
    public async query(userQuestion: string, limit: number = 5, metadataFilter?: Record<string, any>) {
        return await this.collection.query({
            queryTexts: [userQuestion],
            nResults: limit,
            where: metadataFilter, // Opcional: filtrar por metadatos mientras se busca semánticamente
        })
    }

    /**
     * Elimina documentos que coincidan con los metadatos proporcionados.
     */
    public async drop(metadataFilter: Record<string, any>) {
        return await this.collection.delete({
            where: metadataFilter,
        })
    }

}