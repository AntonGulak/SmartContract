import { CommandContract } from '../../../contract/command.contract';
import { Request } from 'express';
import { UnprocessableEntityError } from '../../../error/unprocessable-entity.error';
import { UserRepository, userRepository } from '../../user/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { GenerateUserTokenService } from '../../user/service/generate-user-token.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginByEmailDto } from './dto/login-by-email.dto';

export class LoginCommand extends CommandContract {
    private readonly userRepository: UserRepository;
    private readonly generateUserTokenService: GenerateUserTokenService;

    constructor() {
        super();
        this.userRepository = userRepository;
        this.generateUserTokenService = new GenerateUserTokenService();
    }

    async run(req: Request): Promise<any> {
        const loginByEmailRequestDto = <LoginByEmailDto>{...req.body};
        const existingUser = await this.userRepository.findOneByEmail(loginByEmailRequestDto.email);
        if (!existingUser) {
            throw new UnprocessableEntityError(`Incorrect email or password.`);
        }

        const isValidPassword = await bcrypt.compare(loginByEmailRequestDto.password, existingUser.password_hash);
        if (!isValidPassword) {
            throw new UnprocessableEntityError(`Incorrect email or password.`);
        }

        const token = await this.generateUserTokenService.generate(existingUser);

        return <LoginResponseDto>{
            token,
        };
    }
}
