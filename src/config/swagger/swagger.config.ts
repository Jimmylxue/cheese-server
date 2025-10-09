// src/config/swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { platformConfigs } from './const';

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

  // 为每个平台创建独立的文档
  Object.entries(platformConfigs).forEach(([_, config]) => {
    const document = SwaggerModule.createDocument(
      app,
      baseConfig
        .setTitle(config.title)
        .setDescription(config.description)
        .setVersion('1.0')
        .build(),
      {
        include: config.modules,
        deepScanRoutes: true,
      },
    );
    SwaggerModule.setup(config.path, app, document);
  });
}
