import { CacheConfig } from './cache.interface';
import { FileStorageConfig } from './file-storage.interface';
import { Jwt } from './jwt.interface';

export interface Config {
  id: string;
  port: number;
  domain: string;
  jwt: Jwt;
  fileStorage: FileStorageConfig;
  cache: CacheConfig;
}
