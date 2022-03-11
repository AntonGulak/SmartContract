import { CommandContract } from '../../../contract/command.contract';
import { Request } from 'express';
import { UnprocessableEntityError } from '../../../error/unprocessable-entity.error';
import { userRepository, UserRepository } from '../../user/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { secure } from '../../../config/secure';
import { UserModel } from '../../user/model/user.model';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { NotifyAuthActionService } from "../service/notify-auth-action.service";

export class SignUpCommand extends CommandContract {
    private readonly userRepository: UserRepository;
    private readonly notifyAuthAction: NotifyAuthActionService;

    constructor() {
        super();
        this.userRepository = userRepository;
        this.notifyAuthAction = new NotifyAuthActionService();
    }

    async run(req: Request): Promise<any> {
        const signUpRequestDto = <SignUpDto>{...req.body};
        if (signUpRequestDto.password !== signUpRequestDto.password_confirm) {
            throw new UnprocessableEntityError('Passwords must match.');
        }

        const existingUser = await this.userRepository.findOneByEmail(signUpRequestDto.email);
        if (existingUser) {
            throw new UnprocessableEntityError(`User with email "${ signUpRequestDto.email }" already exists.`);
        }

        const userModel = <UserModel>{
            email: signUpRequestDto.email,
            first_name: signUpRequestDto.first_name,
            last_name: signUpRequestDto.last_name,
            password_hash: await bcrypt.hash(signUpRequestDto.password, secure.saltRounds),
            active: true,
        };

        const createdUser = await this.userRepository.insert(userModel);
        this.notifyAuthAction.notifyUserNew(createdUser.email);
        return <SignUpResponseDto>{
            user_id: createdUser.id,
        };
    }
}
