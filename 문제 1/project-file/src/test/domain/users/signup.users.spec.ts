import { INestApplication } from '@nestjs/common';
import { SignUpUsersDTO } from 'src/domain/users/dto/users.signup.dto';
import { UsersService } from 'src/domain/users/users.service';
import { UsersModule } from 'src/modules/domain/users.module';
import { TypeOrmModule } from 'src/modules/typeorm.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersResponseDTO } from 'src/domain/users/dto/users.response.dto';
import { ConfigModule } from 'src/modules/config.module';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

describe(`signup.users.spec`, () => {
    let app: INestApplication;
    let service: UsersService;
    let signUpUsersDTO: SignUpUsersDTO;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, TypeOrmModule, UsersModule]
        }).compile();

        app = module.createNestApplication();
        service = module.get<UsersService>(UsersService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        signUpUsersDTO = new SignUpUsersDTO();
        signUpUsersDTO.name = `John Doe`;
        signUpUsersDTO.email = `[john@example.com](mailto:john@example.com)`;
        signUpUsersDTO.password = `securePassword123`;
    }, 10000);

    afterEach(() => {
        jest.clearAllTimers();
    });

    it(`정상적인 유저 생성의 경우`, async () => {
        const user = plainToClass(SignUpUsersDTO, signUpUsersDTO);

        // validation 검증 오류가 없어야 함
        const errors = await validate(user);
        expect(errors.length).toBe(0);

        // 정상적으로 생성된 유저의 응답 형식이 맞아야 함
        const result = await service.signUpUsers(user);
        expect(result).toBeInstanceOf(UsersResponseDTO);
    });

    it(`이메일이 중복되어 가입이 실패하는 경우`, async () => {
        const user = plainToClass(SignUpUsersDTO, signUpUsersDTO);

        await expect(service.signUpUsers(user)).rejects.toThrow();
    });

    it(`올바른 이메일 형식이 아님`, async () => {
        signUpUsersDTO.email = `email`;

        const errors = await validate(signUpUsersDTO);

        expect(errors.length).toBeGreaterThan(0);
    });

    it(`이름의 글자수가 짧음`, async () => {
        signUpUsersDTO.name = `J`;

        const errors = await validate(signUpUsersDTO);

        expect(errors.length).toBeGreaterThan(0);
    });

    it(`비밀번호의 글자수가 짧음`, async () => {
        signUpUsersDTO.name = `r`;

        const errors = await validate(signUpUsersDTO);

        expect(errors.length).toBeGreaterThan(0);
    });

    it(`비밀번호에 숫자나 영문이 포함되어있지 않음`, async () => {
        signUpUsersDTO.password = `rebelcorptest`;

        const errors = await validate(signUpUsersDTO);

        expect(errors.length).toBeGreaterThan(0);
    });
});
