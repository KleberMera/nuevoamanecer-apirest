

export interface apiResponse<T> {
  message: string;
  data?: T;
  access_token?: string;
  status: number;
}
