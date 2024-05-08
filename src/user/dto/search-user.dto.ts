import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsJWT, IsOptional, IsString } from "class-validator"

export class SearchUserBodyDTO {
    @ApiProperty()
    @IsJWT()
    access_token: string
}

export class SearchUserQueryDTO {
    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
    nickname: string
}