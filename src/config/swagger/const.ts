import { AuthModule } from 'src/modules/auth/modules/auth.module';
import { ScanModule } from 'src/modules/auth/modules/scan.module';
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
};
