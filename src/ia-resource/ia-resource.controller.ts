import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IaResourceService } from './ia-resource.service';
import { CreateIaResourceDto } from './dto/create-ia-resource.dto';
import { UpdateIaResourceDto } from './dto/update-ia-resource.dto';

@Controller('ia-resource')
export class IaResourceController {
  constructor(private readonly iaResourceService: IaResourceService) {}

  @Post()
  create(@Body() createIaResourceDto: CreateIaResourceDto) {
    return this.iaResourceService.create(createIaResourceDto);
  }

  @Get()
  findAll() {
    return this.iaResourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.iaResourceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIaResourceDto: UpdateIaResourceDto) {
    return this.iaResourceService.update(+id, updateIaResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.iaResourceService.remove(+id);
  }
}
