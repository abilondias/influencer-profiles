import { constants } from "node:http2"

export class ApiError {
  statusCode: number
  message: string

  constructor(message: string, statusCode?: number) {
    this.message = message
    this.statusCode = !statusCode
      ? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
      : statusCode
  }
}
