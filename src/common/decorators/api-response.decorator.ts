import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';

export const ApiCommonResponse = <TModel extends Type<any>>(
  model?: TModel,
  isArray: boolean = false,
) => {
  const decorators = [ApiExtraModels(ApiResponseDto)];
  
  if (model) {
    decorators.push(ApiExtraModels(model));
    
    decorators.push(
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                result: isArray
                  ? {
                      type: 'array',
                      items: { $ref: getSchemaPath(model) },
                    }
                  : {
                      $ref: getSchemaPath(model),
                    },
              },
            },
          ],
        },
      }),
    );
  } else {
    decorators.push(
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                result: {
                  nullable: true,
                },
              },
            },
          ],
        },
      }),
    );
  }

  return applyDecorators(...decorators);
};
