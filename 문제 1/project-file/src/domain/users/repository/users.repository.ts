import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { SignUpUsersDTO } from '../dto/users.signup.dto';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>
    ) {}

    async insertUser(signUpUsersDTO: SignUpUsersDTO): Promise<UsersEntity> {
        const usersEntity = this.usersRepository.create(signUpUsersDTO);
        const usersResponse = await this.usersRepository.save(usersEntity);

        return usersResponse;
    }

    async findUserByEmail(email: string): Promise<UsersEntity> {
        const user = this.usersRepository.findOne({
            where: { email: email }
        });

        return user;
    }
}
