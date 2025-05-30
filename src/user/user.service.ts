import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DynamicQueryService } from 'src/common/dynamic-query.service';
import { User, userQueryConfig } from './entities/user.entity';
import { UserResponseDTO } from 'src/auth/dto/user-response.dto';

@Injectable()
export class UserService {

  constructor(
    private readonly dynamicQueryService: DynamicQueryService,
  ) {}

  async findAll(queryParams: any) {
    return this.dynamicQueryService.findAllWithConfig(User, 'user',UserResponseDTO , userQueryConfig, queryParams);
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
