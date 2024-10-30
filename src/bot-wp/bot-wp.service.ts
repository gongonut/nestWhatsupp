import { Inject, Injectable } from '@nestjs/common';
import { CreateBotWpDto } from './dto/create-bot-wp.dto';
import { UpdateBotWpDto } from './dto/update-bot-wp.dto';

import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { GeneralService } from './general.service';

@Injectable()
export class BotWpService {

  handleCtx: any;
  httpServer: any;

  constructor(@Inject(GeneralService) private genServ: GeneralService) {}

  async start(wport: number) {
    if (this.httpServer) {this.handleCtx.globalState.launch = true; return;}
    // return 'This action starts botWp';
    const adapterFlow = createFlow([this.genServ.defaultFlow, this.genServ.pendingFlow, this.genServ.menuFlow, this.genServ.welcomeFlow]);

    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    }, {
        queue: { // Limited to 50 concurrent requests
            timeout: 20000, concurrencyLimit: 50
        },
        globalState: {
            launch: true,
        }

    });
    this.handleCtx = handleCtx;
    this.httpServer = httpServer;

    await httpServer(wport);
  }

  stop() {
    if (this.httpServer) {
      this.handleCtx.globalState.launch = false;
      this.httpServer.close(); }
  }

  findAll() {
    return `This action returns all botWp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} botWp`;
  }

  update(id: number, updateBotWpDto: UpdateBotWpDto) {
    return `This action updates a #${id} botWp`;
  }

  remove(id: number) {
    return `This action removes a #${id} botWp`;
  }
}
