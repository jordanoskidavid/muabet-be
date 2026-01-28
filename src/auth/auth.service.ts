import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing: User | null = await this.usersRepo.findOne({
      where: { email },
    });
    if (existing) throw new BadRequestException('Email already exists');

    const passwordHash: string = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = email;
    user.password = passwordHash;
    user.role = 'USER';

    const saved = await this.usersRepo.save(user);

    const payload = { sub: saved.id, email: saved.email, role: saved.role };
    const access_token: string = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: { id: saved.id, email: saved.email, role: saved.role },
    };
  }

  async login(email: string, password: string) {
    const user: User | null = await this.usersRepo.findOne({
      where: { email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token: string = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
