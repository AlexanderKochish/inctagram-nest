import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { ReviewModule } from './review/review.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UserModule, AuthModule, PostModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
