import { IsString } from 'class-validator';

export class WeChatOfficialConfigParamsDto {
  @IsString()
  url: string;
}
