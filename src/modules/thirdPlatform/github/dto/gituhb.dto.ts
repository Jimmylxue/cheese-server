import { IsNotEmpty, IsString } from 'class-validator';

export class GetCommitDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名类型错误' })
  user: string;

  @IsNotEmpty({ message: '仓库名不能为空' })
  @IsString({ message: '仓库名类型错误' })
  repos: string;

  @IsNotEmpty({ message: '分支名不能为空' })
  @IsString({ message: '分支名类型错误' })
  branch: string;

  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsString({ message: '开始时间类型错误' })
  startTime: string;
}

export type TCommitList = {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: {
      verified: false;
      reason: 'unsigned';
      signature: null;
      payload: null;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
}[];
