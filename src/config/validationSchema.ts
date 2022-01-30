import * as Joi from 'joi';
// 설정 추가법
// 1. env파일 내부에 설정 추가하고
// 2. **Config.ts 파일 생성하고 어떤 데이터를 가져올지 결정
// 3. Config가 이상해질수 없는 최소한의 조건을 이 파일에 넣으주면됌

// 설정 추가시 해줘야하는 사항
// 1. app.module가서 새로 추가한 config file 추가해 줄것, ex) authConfig
// 2. 설정사용할 provider 또는 controller에 가서 마찬가지로 config file 추가해 줄것
// 3. injection하고 사용하기


export const validationSchema = Joi.object({
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required().uri()
});

export const jwtSecretSchema = Joi.object({
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required()
})
export const jwtAccessSecretSchema = Joi.object({
    JWT_ACCESS_SECRET: Joi.string().required()
  })
export const jwtRefreshSecretSchema = Joi.object({
    JWT_REFRESH_SECRET: Joi.string().required()
})