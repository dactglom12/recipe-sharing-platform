import { Controller, Get, Query, Res } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { Response } from 'express';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Get('file')
  async downloadFile(
    @Query() query: Record<string, string>,
    @Res() res: Response,
  ) {
    const width = query.width ? +query.width : undefined;
    const height = query.height ? +query.height : width;

    const fileBuffer = await this.fileStorageService.get(
      query.path,
      width,
      height,
    );

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': fileBuffer.length,
    });

    res.send(fileBuffer);
  }
}
