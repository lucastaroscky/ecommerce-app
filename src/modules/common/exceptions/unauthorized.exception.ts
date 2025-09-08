import HTTP_STATUS from '../enums/http-status.enum'
import HttpException from './http.exception'

class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(message, HTTP_STATUS.UNAUTHORIZED)
  }
}

export default UnauthorizedException
