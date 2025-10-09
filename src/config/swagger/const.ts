import { AuthModule } from 'src/modules/auth/modules/auth.module';
import { WxModule } from 'src/modules/wx/wx.module';

/**
 * 自动以暴露出 swagger 接口平台
 */
export const platformConfigs = {
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
  full: {
    title: 'Full API',
    description: '所有接口文档',
    modules: [AuthModule, WxModule],
    path: 'platform/all',
  },
};
