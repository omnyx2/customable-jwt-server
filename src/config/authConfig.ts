import { registerAs } from '@nestjs/config';
// @nestjs/config, joi연동
export default registerAs('jwt', () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
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