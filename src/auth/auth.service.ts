// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly apiKeys = [
    { key: 'exampleKey1', teamId: '10' },
    // Add more API keys as needed
  ];

  validateApiKey(apiKey: string): { teamId: string } | null {
    const apiKeyObj = this.apiKeys.find(
      (apiKeyObj) => apiKeyObj.key === apiKey,
    );
    if (!apiKeyObj) {
      return null;
    }
    return { teamId: apiKeyObj.teamId };
  }
}
