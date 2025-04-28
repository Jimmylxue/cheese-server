// src/common/exceptions/error.factory.ts
import { HttpStatus } from '@nestjs/common';
import {
  BusinessException,
  UserAlreadyExistsException,
  InvalidCredentialsException,
  WeakPasswordException,
} from './custom.exception';

export class ErrorFactory {
  static userAlreadyExists(): UserAlreadyExistsException {
    return new UserAlreadyExistsException();
  }

  static invalidCredentials(): InvalidCredentialsException {
    return new InvalidCredentialsException();
  }

  static weakPassword(): WeakPasswordException {
    return new WeakPasswordException();
  }

  static custom(message: string, code: HttpStatus = HttpStatus.BAD_REQUEST) {
    return new BusinessException(message, code);
  }
}
