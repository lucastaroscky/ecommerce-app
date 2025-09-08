import HTTP_STATUS from '../enums/http-status.enum'
import HttpException from './http.exception'

class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HTTP_STATUS.NOT_FOUND)
  }
}

export default NotFoundException
