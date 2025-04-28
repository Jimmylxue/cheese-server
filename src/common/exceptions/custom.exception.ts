import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 这里做一些自定义的 业务类型错误，拿用户为例 后续的错误类型可以继承这个类
 */
export class BusinessException extends HttpException {
  constructor(message: string, code: HttpStatus = HttpStatus.BAD_REQUEST) {
    super({ message, code }, code);
  }
}

export class UserAlreadyExistsException extends BusinessException {
  constructor() {
    super('用户已存在', HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends BusinessException {
  constructor() {
    super('用户名或密码错误', HttpStatus.UNAUTHORIZED);
  }
}

export class WeakPasswordException extends BusinessException {
  constructor() {
    super('密码强度不足，至少需要6位字符', HttpStatus.BAD_REQUEST);
  }
}
