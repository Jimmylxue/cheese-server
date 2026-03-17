import {
  IsIn,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsMobilePhone('zh-CN')
  @IsNotEmpty({ message: 'phone不能为空' })
  phone: string;

  // @IsNumberString({ message: '类型错误' })
  @IsOptional()
  @IsNumber({}, { message: '类型错误-必须是字符串类型' })
  @IsIn([0, 1, 2], {
    // message: '0 男 1 女',
  })
  sex: string;

  @IsOptional()
  @IsString({ message: '类型错误' })
  avatar: string;

  @IsOptional()
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '类型错误' })
  username: string;
}

export class UpdateMailDto {
  @IsString()
  @IsOptional()
  mail: string;

  @IsNotEmpty({ message: '验证码-不能为空' })
  @IsString({ message: '验证码-类型错误' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: '新邮箱不能为空' })
  newMail: string;
}
