import { UsersEntity } from '../repository/users.entity';

export class UsersResponseDTO {
    id: number;
    name: string;
    email: string;
    createdAt: Date;

    constructor(user: UsersEntity) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.createdAt = user.createdAt;
    }

    static toResponse(user: UsersEntity) {
        return new UsersResponseDTO(user);
    }
}
