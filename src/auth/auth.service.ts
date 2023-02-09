import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){ }

    private getJwtToken( userId: string ) {
        return this.jwtService.sign({ id: userId });
    }

    async signup( signupInput: SignupInput ): Promise<AuthResponse>{
        const user = await this.usersService.create( signupInput );
        const token = this.getJwtToken( user.id );
        
        return {
            token,
            user
        }
    }
    
    async login( { email, password }: LoginInput): Promise<AuthResponse> {
        const user = await this.usersService.findOneByEmail( email );
        if ( !bcrypt.compareSync( password, user.password) ) throw new BadRequestException(`Email/Password Do not match.`);
        
        const token = this.getJwtToken( user.id );
        return {
            token,
            user
        }
    }
}
