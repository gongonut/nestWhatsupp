import { PartialType } from '@nestjs/swagger';
import { CreateIaResourceDto } from './create-ia-resource.dto';

export class UpdateIaResourceDto extends PartialType(CreateIaResourceDto) {}
