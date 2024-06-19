import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product/entities/product.entity';
import { ClientEntity } from './client/entities/client.entity';
import { ProductModule } from './product/product.module';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { TransactionEntity } from './transaction/entities/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';
import { CreditCardModule } from './credit_card/credit_card.module';
import { CreditCardEntity } from './credit_card/entities/credit_card.entity';
import { HistoryEntity } from './history/entities/history.entity';
import { HistoryModule } from './history/history.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        ProductEntity,
        ClientEntity,
        TransactionEntity,
        CreditCardEntity,
        HistoryEntity,
      ],
      synchronize: true,
    }),
    ClientModule,
    AuthModule,
    ProductModule,
    TransactionModule,
    CreditCardModule,
    HistoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
