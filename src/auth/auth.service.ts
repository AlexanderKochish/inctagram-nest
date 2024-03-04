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
      throw new HttpException('This user already exists', HttpStatus.BAD_REQUEST)
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

  async signIn(data: {email: string, password: string}){
    const user = await  this.prisma.user.findUnique({where: {email: data.email}})

    if(!user){
      throw new HttpException('This user not register', HttpStatus.BAD_REQUEST)
    }

    const checkPassword = await bcrypt.compare(data.password, user.password)

    if(!checkPassword){
      throw new HttpException('Password doesn\`t match', HttpStatus.FORBIDDEN)
    }

    const payload = { username: user.name, id: user.id, email: user.email };

    return { access_token: this.jwtService.sign(payload)}
  }
}
