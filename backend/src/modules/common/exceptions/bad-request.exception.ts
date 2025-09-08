import HTTP_STATUS from "../enums/http-status.enum";
import HttpException from "./http.exception";

class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST)
  }
}

export default BadRequestException
