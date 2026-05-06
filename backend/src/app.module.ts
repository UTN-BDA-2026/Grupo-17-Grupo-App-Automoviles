
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ScraperModule } from './scraper/scraper.module';
import { dataSourceOptions } from './database/typeorm.config';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    ProductsModule,
    UsersModule,
    ChatModule,
    ScraperModule,
    VectorStoreModule,
    SchedulerModule
  ],
})
export class AppModule {}
