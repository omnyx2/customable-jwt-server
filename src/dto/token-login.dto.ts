import { IsString, MinLength, MaxLength, IsEmail, Matches,  } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common'

export class TokenLoginDto {
    @IsString()
    @MaxLength(1000)
    jwtAccessString: string;

    @IsString()
    @MaxLength(1000)
    jwtRefreshString: string;
}