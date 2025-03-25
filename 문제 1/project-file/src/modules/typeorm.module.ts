import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/domain/users/repository/users.entity';

@Module({
    imports: [
        NestTypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: `mysql`,
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [UsersEntity],
                synchronize: false, // DB동기화/ 1회 후 간단한 users 단일 테이블이기에 false
                logging: true // 쿼리문 로깅용
            })
        })
    ]
})
export class TypeOrmModule {}
