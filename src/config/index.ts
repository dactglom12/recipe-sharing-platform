import { Config } from './interfaces/config.interface';

export function config(): Config {
  return {
    id: process.env.APP_ID,
    port: parseInt(process.env.PORT, 10),
    domain: process.env.DOMAIN,
    jwt: {
      access: {
        secret: process.env.JWT_CONFIRMATION_SECRET,
        time: parseInt(process.env.JWT_ACCESS_TIME, 10),
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        time: parseInt(process.env.JWT_REFRESH_TIME, 10),
      },
    },
    fileStorage: {
      accessToken: process.env.DROPBOX_ACCESS_TOKEN,
      appKey: process.env.DROPBOX_APP_KEY,
      appSecret: process.env.DROPBOX_APP_SECRET,
      redirectUri: process.env.DROPBOX_REDIRECT_URI,
    },
    cache: {
      host: process.env.CACHE_HOST,
      password: process.env.CACHE_PASSWORD,
      port: process.env.CACHE_PORT,
    },
  };
}
