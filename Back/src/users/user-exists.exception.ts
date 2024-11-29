import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistsException extends HttpException {
  constructor(field: string) {
    super(
      {
        status: HttpStatus.CONFLICT,
        error: `${field} already exists`,
      },
      HttpStatus.CONFLICT,
    );
  }
}
