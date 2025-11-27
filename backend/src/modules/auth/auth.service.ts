import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { AuthResponse, JwtPayload } from './interfaces/auth.interface';
import { UserRole } from '@smart-forecast/shared';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('google.clientId');
    this.googleClient = new OAuth2Client(clientId);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials 1');
    }

    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials 2');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async validateUser(userId: string) {
    return await this.userService.findById(userId);
  }

  /**
   * Verify Google ID Token and authenticate user (Mobile)
   */
  async googleAuth(
    googleAuthDto: GoogleAuthDto,
  ): Promise<AuthResponse & { isNewUser: boolean }> {
    try {
      // Verify the Google ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleAuthDto.idToken,
        audience: this.configService.get<string>('google.clientId'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const { sub: googleId, email, name, email_verified } = payload;

      if (!email) {
        throw new UnauthorizedException('Email not provided by Google');
      }

      // Find or create user
      let user = await this.userService.findByGoogleId(googleId);
      let isNewUser = false;

      if (!user) {
        // Check if user exists with same email (different provider)
        user = await this.userService.findByEmail(email);

        if (user) {
          // Link Google account to existing user
          user.googleId = googleId;
          user.emailVerified = email_verified || true;
          await this.userService.update(user.id, {
            googleId,
            emailVerified: email_verified || true,
          });
        } else {
          // Create new user
          user = await this.userService.create({
            email,
            fullName: name || email.split('@')[0],
            googleId,
            provider: 'google',
            emailVerified: email_verified || true,
            role: UserRole.USER,
          });
          isNewUser = true;
        }
      }

      // Generate JWT
      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        access_token: this.jwtService.sign(jwtPayload),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        isNewUser,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Google authentication failed: ' + error.message,
      );
    }
  }
}
