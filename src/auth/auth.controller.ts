import { Controller, Post, Body, UseGuards, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { Response} from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { User as UserModel} from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() user: UserModel): Promise<{access_token: string}> {
    return this.authService.signUp(user);
  }

  @Post('sign-in')
  signIn(@Body() user: UserModel): Promise<{access_token: string}>{
    return this.authService.signIn(user)
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {

    const token = await this.authService.signIn(req.user);

    res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    return HttpStatus.OK;
  }
}
