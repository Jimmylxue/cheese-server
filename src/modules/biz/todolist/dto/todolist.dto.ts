import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UserTaskBody {
  @IsNotEmpty()
  @IsString()
  typeId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class UserTypeQuery {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class AddUserTypeParams {
  @IsNotEmpty()
  @IsNumberString()
  userId: number;

  @IsNotEmpty()
  @IsString()
  typeName: string;
}
