import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpUsersDTO } from './dto/users.signup.dto';
import { UsersResponseDTO } from './dto/users.response.dto';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter.util';

@Controller(`/users`)
@UseFilters(HttpExceptionFilter)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post(`/`)
    signUpUser(@Body() signUpUsersDTO: SignUpUsersDTO): Promise<UsersResponseDTO> {
        return this.usersService.signUpUsers(signUpUsersDTO);
    }
}
