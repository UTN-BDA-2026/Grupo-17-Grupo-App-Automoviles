
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getMe(@CurrentUser() user: { id: string }) {
        return this.usersService.getProfile(user.id);
    }

    @Patch('me')
    updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(user.id, dto);
    }
}
