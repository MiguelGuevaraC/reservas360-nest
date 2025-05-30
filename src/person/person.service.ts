import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { DynamicQueryService } from 'src/common/dynamic-query.service';
import { Person, personQueryConfig } from './entities/person.entity';
import { PersonResponseDTO } from 'src/auth/dto/user-response.dto';

@Injectable()
export class PersonService {
    constructor(
      private readonly dynamicQueryService: DynamicQueryService,
    ) {}

  create(createPersonDto: CreatePersonDto) {
    return 'This action adds a new person';
  }

 async findAll(queryParams: any) {
    return this.dynamicQueryService.findAllWithConfig(Person, 'person',PersonResponseDTO , personQueryConfig, queryParams);
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
