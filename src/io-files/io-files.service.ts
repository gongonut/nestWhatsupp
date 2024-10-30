import { Injectable } from '@nestjs/common';
import { CreateIoFileDto } from './dto/create-io-file.dto';
import { UpdateIoFileDto } from './dto/update-io-file.dto';

@Injectable()
export class IoFilesService {
  create(createIoFileDto: CreateIoFileDto) {
    return 'This action adds a new ioFile';
  }

  findAll() {
    return `This action returns all ioFiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ioFile`;
  }

  update(id: number, updateIoFileDto: UpdateIoFileDto) {
    return `This action updates a #${id} ioFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} ioFile`;
  }
}
