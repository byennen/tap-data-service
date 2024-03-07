import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<any> {
    // token here should directly be the API key without 'Bearer '
    // console.log('token', token);
    const apiKeyValidation = this.authService.validateApiKey(token);
    if (!apiKeyValidation) {
      throw new UnauthorizedException('API key is invalid');
    }
    return { teamId: apiKeyValidation.teamId };
  }
}
