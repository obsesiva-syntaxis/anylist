import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll( @Args() validRoles: ValidRolesArgs, @CurrentUser([ ValidRoles.superUser ]) user: User ): Promise<User[]> {
    console.log(user);
    return this.usersService.findAll( validRoles.roles );
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
    throw new Error(`Not implemented yet`);
  }

  @Mutation(() => User)
  blockUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.block(id);
  }
}