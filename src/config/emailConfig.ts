import { registerAs } from '@nestjs/config';
// @nestjs/config, joi연동
export default registerAs('email', () => ({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD,
    },
    baseUrl: process.env.EMAIL_BASE_URL,
  }));

// registerAs의 내부 구현체
/*
import { ConfigModule, ConfigObject, ConfigFactory } from "@nestjs/config";

export interface ConfigFactoryKeyHost<T = unknown> {
    KEY: string;
    asProvider(): {
        imports: [ReturnType<typeof ConfigModule.forFeature>];
        useFactory: (config: T) => T;
        inject: [string];
    };
}

export declare function registerAs<TConfig extends ConfigObject, TFactory extends ConfigFactory = ConfigFactory<TConfig>>(token: string, configFactory: TFactory): TFactory & ConfigFactoryKeyHost<ReturnType<TFactory>>;
  */