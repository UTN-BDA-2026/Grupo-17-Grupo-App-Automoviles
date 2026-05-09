
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getProfile(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('Usuario no encontrado en la base de datos');
        return user;
    }

    async updateProfile(userId: string, data: any) {
        await this.userRepository.update(userId, data);
        return this.getProfile(userId);
    }
}