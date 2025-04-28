// src/config/swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from 'src/modules/auth/modules/auth.module';

export function setupSwagger(app: INestApplication): void {
  // 基础配置
  const baseConfig = new DocumentBuilder()
    .setTitle('Cheese API 文档')
    .setDescription('Cheese API 相关的接口文档')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .setContact(
      'Cheese',
      'https://github.com/jimmy-cheng',
      'jimmy.cheng@outlook.com',
    );

  // 开发环境才加载模块专属文档
  // 猫咪文档
  const catDocument = SwaggerModule.createDocument(
    app,
    baseConfig
      .setTitle('Cats API')
      .setDescription('Cats related APIs')
      .setVersion('1.0')
      .build(),
    {
      include: [AuthModule],
      ignoreGlobalPrefix: true,
    },
  );
  SwaggerModule.setup('test/api', app, catDocument);
}
