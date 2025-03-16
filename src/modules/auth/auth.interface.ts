export interface ILoginResponse {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface IJwtPayload {
  id: string;
  email: string;
}
