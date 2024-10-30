import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BotWpService } from './bot-wp.service';
import { CreateBotWpDto } from './dto/create-bot-wp.dto';
import { UpdateBotWpDto } from './dto/update-bot-wp.dto';

@Controller('bot-wp')
export class BotWpController {
  constructor(private readonly botWpService: BotWpService) { }


  @Post('/startWP')
  async start() {
    const wport = +process.env.PORT_WP;
    await await this.botWpService.start(wport);
  }

  @Post('/stopWP')
  async stop() {
    await this.botWpService.stop();
  }

  /*
  @Get('/qrWP')
  async getQR() {
    return await this.botWpService.getQR();
  }
    */

  @Get()
  findAll() {
    return this.botWpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botWpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBotWpDto: UpdateBotWpDto) {
    return this.botWpService.update(+id, updateBotWpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botWpService.remove(+id);
  }
}
