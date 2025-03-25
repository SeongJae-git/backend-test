import { Module } from '@nestjs/common';
import { TypeOrmModule } from './modules/typeorm.module';
import { UsersModule } from './modules/domain/users.module';
import { ConfigModule } from './modules/config.module';

@Module({
    imports: [ConfigModule, TypeOrmModule, UsersModule]
})
export class AppModule {}
