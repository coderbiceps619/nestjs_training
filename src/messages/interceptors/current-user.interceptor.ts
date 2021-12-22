import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies['jwt'];

    const { id } = await this.jwtService.verify(cookie);
    if (id) {
      const user = await this.usersService.findById(id);
      delete user.password;
      request.currentUser = user;
    }

    return handler.handle();
  }
}
