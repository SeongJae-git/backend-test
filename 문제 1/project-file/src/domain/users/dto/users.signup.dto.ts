import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
/**
 * [ 유효성 검사 ]
 * name 필드는 최소 2자 이상, 최대 50자 이내여야 합니다.
 * email 필드는 올바른 이메일 형식이어야 합니다.
 * password는 최소 8자 이상이어야 하며, 숫자와 문자가 포함되어야 합니다.
 */
export class SignUpUsersDTO {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsEmail()
    @Transform(({ value }) => {
        // 요청 바디 예시의 필요없는 문자열 정리
        return value.replace(/^\[.*\]\(mailto:(.*)\)$/i, '$1');
    })
    email: string;

    @IsString()
    @MinLength(8)
    // 한개의 영문자, 숫자 포함되어야 하고 특수문자 입력 가능
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]+$/)
    password: string;
}
