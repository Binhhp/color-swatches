/* eslint-disable @typescript-eslint/no-explicit-any */
export class ResponseModel<Type> {
  status: boolean;
  statusCode: number;
  result?: Type;
  message?: string;
  public constructor(status: boolean = true, statusCode: number = 200) {
    this.status = status;
    this.statusCode = statusCode;
  }

  public AddResult(result: any): this {
    this.result = result;
    return this;
  }

  public AddMessage(message: string): this {
    this.message = message;
    return this;
  }
}
