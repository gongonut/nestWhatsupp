import { PartialType } from '@nestjs/swagger';
import { CreateIoFileDto } from './create-io-file.dto';

export class UpdateIoFileDto extends PartialType(CreateIoFileDto) {}
