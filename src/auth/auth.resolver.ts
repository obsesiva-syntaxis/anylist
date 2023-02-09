import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto/inputs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation( () => AuthResponse,{ name: 'signup'})
  async signup( @Args('signupInput') signupInput: SignupInput ): Promise<AuthResponse> { return this.authService.signup(signupInput) }

  @Mutation( () => AuthResponse ,{ name: 'login'})
  async login( @Args('loginInput') loginInput: LoginInput ): Promise<AuthResponse> {
    return this.authService.login(loginInput)
  }

  @Query( () => AuthResponse ,{ name: 'revalidate'})
  @UseGuards( JwtAuthGuard )
  revalidenToken(  ): AuthResponse {
    // return this.authService.revalidateToken(  )
    throw new Error(`not implemented`);
  }
  

}
