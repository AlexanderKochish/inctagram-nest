import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() user): Promise<{access_token: string}> {
    return this.authService.signUp(user);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  // @Get('google/callback')
  // @UseGuards(GoogleOauthGuard)
  // async googleAuthCallback(@Req() req, @Res() res: Response) {
  //   const token = await this.authService.signIn(req.user);
  //
  //   res.cookie('access_token', token, {
  //     maxAge: 2592000000,
  //     sameSite: true,
  //     secure: false,
  //   });
  //
  //   return HttpStatus.OK;
  // }
}
