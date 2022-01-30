import { IsString, MinLength, MaxLength, IsEmail, Matches,  } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common'
export class CreateUserDto {
    // 공백을 제거하는 로직
    // name 앞뒤에 포함된 공백은 trim()함수로 잘라내게 됩니다.
    // trim이 짤라내지 못하는 공백이 있다.
    @Transform(params => params.value.trim())
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    readonly name: string;

    @IsString()
    @IsEmail()
    @MaxLength(60)
    readonly email: string;
    
    @Transform(({ value, obj }) => {
        if (obj.name.includes(value.trim())) {
          console.log(obj.password, value)
          throw new BadRequestException('password는 name과 같은 문자열을 포함할 수 없습니다.');
        }
        return value.trim();
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    readonly password: string;

    // panviRD, AI, system 3개가 가능한데 system의 경우 이메일 인증없이 진행
    @Transform(({ value, obj }) => {
        if (obj.affiliatedInstitutions?.length === 0) {
          throw new BadRequestException('서비스는 존재해야 합니다');
        }
        
        return value;
    })
    @MaxLength(100, { each: true })
    readonly affiliatedInstitutions: string[];
      
}

// class-validator가 지원하는 다양한 데코레이터들



