import { Controller, Get, Post, Param, Res, UploadedFiles, UseInterceptors, } from '@nestjs/common';
import { IoFilesService } from './io-files.service';
import { join } from 'path';
import * as fs from 'fs';
import { Observable, of } from 'rxjs';
import { FilesInterceptor } from '@nestjs/platform-express';

// import { CreateIoFileDto } from './dto/create-io-file.dto';
// import { UpdateIoFileDto } from './dto/update-io-file.dto';

@Controller('io-files')
export class IoFilesController {
  constructor(private readonly ioFilesService: IoFilesService) {}

  @Get('picture/:imagename')
  getImageByName(@Param('imagename') imagename, @Res() res): Observable<object> {
    // const upr = imagename.toUpperCase().split('_2d_');
    const upr = imagename.toUpperCase().replaceAll('_2D_', '/');
    let apath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    if (process.env.DEV_STATUS === 'true') {
      apath = join(__dirname, process.env.DEFA_DIR);
    }
    // apath = join(apath, upr[0], upr[1]);
    apath = join(apath, upr);
    return of(res.sendFile(apath));
  }

  @Get('/qrWP')
  getQrCode(@Res() res): Observable<object> {
    const apath = join(__dirname, '..', 'bot.qr.png');
    // apath = join(apath, upr[0], upr[1]);
    return of(res.sendFile(apath));
  }

  @Post('pictures')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles1(@UploadedFiles() files: Array<Express.Multer.File>) {
    const resultpath: string[] = [];
    let apath = process.env.RAILWAY_VOLUME_MOUNT_PATH;
    if (process.env.DEV_STATUS === 'true') {
      apath = join(__dirname, process.env.DEFA_DIR);
      if (!fs.existsSync(apath)) { fs.mkdirSync(apath); }
    }
    const dir = files[0].originalname.toUpperCase();
    apath = join(apath, dir);
    if (!fs.existsSync(apath)) { fs.mkdirSync(apath); }
    for (let i = 1; i < files.length; i++) {
      const upr = files[i].originalname.toUpperCase();
      const destPath = join(apath, upr);
      fs.writeFileSync(destPath, files[i].buffer);
      resultpath.push(destPath);
    }
    return { status: 200, message: resultpath }
  }


}