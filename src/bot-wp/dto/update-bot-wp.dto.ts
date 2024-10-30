import { PartialType } from '@nestjs/swagger';
import { CreateBotWpDto } from './create-bot-wp.dto';

export class UpdateBotWpDto extends PartialType(CreateBotWpDto) {}
