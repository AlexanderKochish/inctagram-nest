import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signUp(user: Prisma.UserCreateInput) {
    const findUser = await this.prisma.user.findUnique({where: { email: user.email}})
    if(findUser){
      throw new HttpException('This user are exists', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcrypt.hash(user.password, 5)
    const newUser = {
      ...user,
      password: hashPassword
    }

    const person = await this.prisma.user.create({ data: newUser });
    const payload = { username: person.name, id: person.id, email: person.email };
    return { access_token: this.jwtService.sign(payload) }
  }
}
