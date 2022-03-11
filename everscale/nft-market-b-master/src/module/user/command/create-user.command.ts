import { CommandContract } from '../../../contract/command.contract';
import { Request } from 'express';
import { UnprocessableEntityError } from '../../../error/unprocessable-entity.error';
import { userRepository, UserRepository } from '../repository/user.repository';
import * as bcrypt from 'bcrypt';
import { secure } from '../../../config/secure';
import { UserModel } from '../model/user.model';
import { NotifyAuthActionService } from "../../auth/service/notify-auth-action.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { userStorage, UserStorage } from "../storage/user.storage";
import { ForbiddenError } from "../../../error/forbidden.error";
import { UserRole } from "../vo/user-role.vo";
import { AccountType } from "../vo/account-type.vo";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";

export class CreateUserCommand extends CommandContract {
    private readonly userRepository: UserRepository;
    private readonly notifyAuthAction: NotifyAuthActionService;
    private readonly userStorage: UserStorage;

    constructor() {
        super();
        this.userRepository = userRepository;
        //this.onlyAuthorized = true;
        this.notifyAuthAction = new NotifyAuthActionService();
        this.userStorage = userStorage;
    }

    async run(req: Request): Promise<any> {
        const createUserDto = <CreateUserDto>{...req.body};
        const user = this.userStorage.get() as UserModel;

        // if (!(new UserRole(user.role)).isAdmin()) {
        //     throw new ForbiddenError('Only admin can create user');
        // }

        if (createUserDto.password !== createUserDto.password_confirm) {
            throw new UnprocessableEntityError('Passwords must match.');
        }

        // if ((new AccountType(createUserDto.account_type).isOwnerForIdRequired()) && !createUserDto.owner_for_id) {
        //     throw new UnprocessableEntityError('For this account type owner_for_id is required');
        // }

        if (await this.userRepository.findOneByEmail(createUserDto.email)) {
            throw new UnprocessableEntityError(`User with email "${ createUserDto.email }" already exists.`);
        }

        const userModel = <UserModel>{
            email: createUserDto.email,
            first_name: createUserDto.first_name,
            last_name: createUserDto.last_name,
            password_hash: await bcrypt.hash(createUserDto.password, secure.saltRounds),
            active: true,
            //account_type: createUserDto.account_type,
            //owner_for_id: createUserDto.owner_for_id,
            account_type: AccountType.GALLERY,
            owner_for_id: 6,
            wallet: createUserDto.wallet
        };

        const createdUser = await this.userRepository.insert(userModel);
        this.notifyAuthAction.notifyUserNew(createdUser.email);
        return <CreateUserResponseDto>{
            user_id: createdUser.id,
        };
    }
}
