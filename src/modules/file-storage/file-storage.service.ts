import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dropbox, DropboxResponseError } from 'dropbox';
import Sharp from 'sharp';

@Injectable()
export class FileStorageService {
  private client: Dropbox;

  constructor(private readonly configService: ConfigService) {
    this.client = new Dropbox({
      accessToken: configService.get('fileStorage').accessToken,
      clientId: configService.get('fileStorage').appKey,
      clientSecret: configService.get('fileStorage').appSecret,
    });
  }

  async get(
    basePath: string,
    width?: number,
    height?: number,
  ): Promise<Buffer> {
    const { extension, withoutExtension } = this.parseFileMetadata(basePath);

    const isExisting = await this.isFileExist(
      this.generatePath(withoutExtension, extension, width, height),
    );

    if (!isExisting) {
      const baseImageResponse = await this.client.filesDownload({
        path: basePath,
      });

      const file = Buffer.from((baseImageResponse.result as any).fileBinary);

      const sharp = Sharp(file);

      const resized = await sharp.resize(width, height).toBuffer();

      await this.upload(
        this.generatePath(withoutExtension, extension, width, height),
        resized,
      );

      return resized;
    }

    const { result } = await this.client.filesDownload({
      path: this.generatePath(withoutExtension, extension, width, height),
    });

    return Buffer.from((result as any).fileBinary);
  }

  async upload(path: string, content: Buffer) {
    return this.client.filesUpload({
      contents: content,
      path,
    });
  }

  private async isFileExist(path: string) {
    try {
      const metadata = await this.client.filesGetMetadata({
        path,
      });
      return metadata !== null;
    } catch (error) {
      if (
        error instanceof DropboxResponseError &&
        error.error['.tag'] === 'path'
      ) {
        return false;
      }
    }
  }

  private generatePath(
    basePath: string,
    extension: string,
    width?: number,
    height?: number,
  ) {
    if (!width || !height) return `${basePath}.${extension}`;

    return `${basePath}_dim_w=${width}&_dim_h=${height}.${extension}`;
  }

  private parseFileMetadata(path: string) {
    const parts = path.split('.');

    if (parts.length === 0) throw new Error('No file extension in path');

    const fileExtension = parts.pop();

    return {
      extension: fileExtension,
      withoutExtension: parts.join(''),
    };
  }
}
