import { Injectable } from '@nestjs/common';
import { CreateIaResourceDto } from './dto/create-ia-resource.dto';
import { UpdateIaResourceDto } from './dto/update-ia-resource.dto';

@Injectable()
export class IaResourceService {
  create(createIaResourceDto: CreateIaResourceDto) {
    return 'This action adds a new iaResource';
  }

  findAll() {
    return `This action returns all iaResource`;
  }

  findOne(id: number) {
    return `This action returns a #${id} iaResource`;
  }

  update(id: number, updateIaResourceDto: UpdateIaResourceDto) {
    return `This action updates a #${id} iaResource`;
  }

  remove(id: number) {
    return `This action removes a #${id} iaResource`;
  }
}
