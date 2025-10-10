// src/config/swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { platformConfigs } from './const';

export function setupSwagger(app: INestApplication): void {
  // 为每个平台创建独立的文档
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(platformConfigs).forEach(([_, config]) => {
    const baseConfig = new DocumentBuilder()
      .setTitle('Cheese API 文档')
      .setDescription('Cheese API 相关的接口文档')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .setContact(
        'Jimmylxue',
        'https://github.com/Jimmylxue',
        '1002661758@qq.com',
      );
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
