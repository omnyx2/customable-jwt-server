import { IsString, MinLength, MaxLength, IsEmail, Matches,  } from 'class-validator';
import { Transform } from 'class-transformer';
export class GetUserDto {
    @IsString()
    @MaxLength(30)
    @MinLength(2)
    readonly id: string;

    @IsString()
    @MaxLength(50)
    @MinLength(2)
    readonly affiliatedInstitution:string;
}
