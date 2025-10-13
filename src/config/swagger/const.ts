import { AuthModule } from 'src/modules/auth/modules/auth.module';
import { ScanModule } from 'src/modules/auth/modules/scan.module';
import { MemoWordModule } from 'src/modules/biz/memo-word/memo.module';
import { TranslateModule } from 'src/modules/biz/memo-word/translate/translate.module';
import { WxModule } from 'src/modules/wx/wx.module';

/**
 * 自动以暴露出 swagger 接口平台
 */
export const platformConfigs = {
  full: {
    title: 'Full API',
    description: '所有接口文档',
    modules: [AuthModule, ScanModule, WxModule],
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
    title: 'Memo Platform API',
    description: '翻译 接口',
    modules: [TranslateModule],
    path: 'platform/translate',
  },
};
