
import { Controller, Get, Patch, Body, Headers } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getMe(@Headers('user-id') userId: string) {
        return this.usersService.getProfile(userId);
    }

    @Patch('me')
    updateMe(@Headers('user-id') userId: string, @Body() body: any) {
        return this.usersService.updateProfile(userId, body);
    }
}