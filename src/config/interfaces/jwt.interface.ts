export interface SingleJwt {
  secret: string;
  time: number;
}

export interface Jwt {
  access: SingleJwt;
  refresh: SingleJwt;
}
