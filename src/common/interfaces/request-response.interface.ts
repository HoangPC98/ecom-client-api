export interface IResponse {
  statusCode: number;
  data: unknown;
  message: string[] | string | null;
}
