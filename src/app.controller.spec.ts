// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate } from '@nestjs/common';
class MockAuthGuard implements CanActivate {
  canActivate() {
    return true;
  }
}

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    })
      .overrideGuard(AuthGuard('api-key'))
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
