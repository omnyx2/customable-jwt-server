import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { types } from 'joi';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if(!metatype || !this.toValidate(metatype)){
            return value;
        }
        const object = plainToClass(metatype, value)
        // validate에 기재된 대로 잘 잘동하는지 확인
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException('Validation failed');
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}



//PipeTransfrom의 원형, T, R 전부 가능
/*
export interface PipeTransform<T = any, R = any> {
    transform(value: T, metadata: ArgumentMetadata): R;
}
*/
// transform 홤수는 2개의 매개 변수 소유
// value: 현재 파이프에 전달된 인자
// metadata: 현재 파이프에 전달된 인자으 ㅣ메타데이터

//  ArgumentMetadata의 정의
/*
export interface ArgumentMetadata {
    readonly type: Paramtype;
    readonly metatype?: Type<any> | undefined;
    readonly data?: string | undefined;
}

export declare type Paramtype = 'body' | 'query' | 'param' | 'custom';
*/
// Paramatype: 'body' | 'query' | 'param' | 'custom' 중 어떤 것인지 고른다.
// metatype: Router handler에서 정의 된 인자파입을 알려준다. 바닐라 자바스크립 또는 핸들러 사용시 undefined
// data: 데이터가 있다면 문자열 이다. 없으면 undefined
