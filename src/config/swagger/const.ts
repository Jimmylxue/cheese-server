import { AuthModule } from 'src/modules/auth/modules/auth.module';
import { ScanModule } from 'src/modules/auth/modules/scan.module';
import { MemoWordModule } from 'src/modules/biz/memo-word/memo.module';
import { TodoListModule } from 'src/modules/biz/todolist/todolist.module';
import { FileUploadModule } from 'src/modules/system/modules/fileUpload/fileUpload.module';
import { SiteLetterModule } from 'src/modules/system/modules/siteLetter/siteLetter.module';
import { ThirdPlatformModule } from 'src/modules/thirdPlatform/thirdPlatform.module';
import { WxModule } from 'src/modules/wx/wx.module';

/**
 * 自动以暴露出 swagger 接口平台
 */
export const platformConfigs = {
  full: {
    title: 'Full API',
    description: '所有接口文档',
    modules: [AuthModule, ScanModule, WxModule, ThirdPlatformModule],
    path: 'platform/all',
  },
  auth: {
    title: 'Auth Platform API',
    description: '认证平台接口',
    modules: [AuthModule],
    path: 'platform/auth',
  },
  wx: {
    title: 'WeChat Platform API',
    description: '微信平台接口',
    modules: [WxModule],
    path: 'platform/wx',
  },
  scan: {
    title: 'Scan Code Auth API',
    description: '扫码登录接口',
    modules: [ScanModule],
    path: 'platform/scan',
  },
  memo: {
    title: 'Memo Platform API',
    description: '单词鸭鸭 接口',
    modules: [MemoWordModule],
    path: 'platform/memo',
  },
  translate: {
    title: 'Third Platform API',
    description: '第三方平台 接口',
    modules: [ThirdPlatformModule],
    path: 'platform/third',
  },
  fileupload: {
    title: 'File Upload API',
    description: '文件上传 接口',
    modules: [FileUploadModule],
    path: 'platform/fileupload',
  },
  siteLetter: {
    title: 'Site Letter API',
    description: '站内信 接口',
    modules: [SiteLetterModule],
    path: 'platform/siteLetter',
  },
  todolist: {
    title: 'To Do List API',
    description: '待办事项 接口',
    modules: [TodoListModule],
    path: 'platform/todolist',
  },
};
