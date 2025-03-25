import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { SignUpUsersDTO } from './dto/users.signup.dto';
import { CryptoUtil } from 'src/utils/common/crypto.util';
import { UsersResponseDTO } from './dto/users.response.dto';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository) {}

    async signUpUsers(signUpUsersDTO: SignUpUsersDTO): Promise<UsersResponseDTO> {
        if (await this.userRepository.findUserByEmail(signUpUsersDTO.email)) {
            throw new ConflictException(`Email already exists`);
        }

        const signUpDataSet = Object.assign({
            ...signUpUsersDTO,
            password: await CryptoUtil.generateHash(signUpUsersDTO.password)
        });

        const createdUserEntity = await this.userRepository.insertUser(signUpDataSet);

        return UsersResponseDTO.toResponse(createdUserEntity);
    }
}
