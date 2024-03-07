import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('data')
export class AppController {
  @UseGuards(AuthGuard('api-key'))
  @Get()
  getData(@Request() req): string {
    // Access teamId from req.user.teamId
    return 'Protected data';
  }
}
