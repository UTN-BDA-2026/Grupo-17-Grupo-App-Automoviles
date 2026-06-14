
import { IsObject, IsOptional } from 'class-validator';

export class UpdateProfileDto {
    @IsObject()
    @IsOptional()
    preferences?: Record<string, any>;
}
