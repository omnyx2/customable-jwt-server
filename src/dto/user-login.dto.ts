import { IsString, MinLength, MaxLength, IsEmail, Matches,  } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common'

export class UserLoginDto {
    @IsString()
    @IsEmail()
    @MaxLength(60)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    password: string;

    @Transform(({ value, obj }) => {
        if (obj.affiliatedInstitutions?.length === 0) {
          throw new BadRequestException('서비스는 존재해야 합니다');
        }
        return value;
    })
    @MinLength(2, { each: true })
    @MaxLength(100, { each: true })
    affiliatedInstitutions: string[];
}