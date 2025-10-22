import { Module } from '@nestjs/common';
import { resolve } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WxModule } from './modules/wx/wx.module';
import { AuthModule } from './modules/auth/modules/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './modules/redis/redis.module';
import { SystemModule } from './modules/system/system.module';
import { BizModule } from './modules/biz/biz.module';
import { ThirdPlatformModule } from './modules/thirdPlatform/thirdPlatform.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
        resolve(process.cwd(), '.env'),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          type: 'mysql',
          host: config.get('MYSQL_HOST'),
          port: config.get('MYSQL_PORT'),
          username: config.get('MYSQL_USERNAME'),
          password: config.get('MYSQL_PASSWORD'),
          database: config.get('MYSQL_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // logging: true, // 将日志级别设置为 true
          synchronize: true,
        };
      },
    }),
    RedisModule,
    WxModule,
    AuthModule,
    SystemModule,
    ThirdPlatformModule,
    BizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
