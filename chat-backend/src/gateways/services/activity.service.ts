import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/api/auth/auth.service';
import { WsE } from '../messages.gateway';
import { ISession } from 'src/common/schemas/session.schema';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class ActivityService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  async setResolved(token: string): Promise<ISession> {
    try {
      const session = await this.authService.findSessionByToken(token);
      if (!session) {
        throw new Error('session not found');
      }

      return session;
    } catch (error) {
      console.error(error);
      throw false;
    }
  }

  async getContactsWS(userId: string, clientMap: Map<string, WsE>): Promise<WsE[]> {
    const userData = await this.userService.findOne(userId);
    return userData.contacts.map(contact => clientMap.get(userId));
  }
}
