import { MessageBuilder } from "../../email/builder/message.builder";
import { SendEmailService } from "../../email/service/send-email.service.";
import { UserRepository, userRepository } from "../../user/repository/user.repository";

export class NotifyOfferActionService {
    private readonly messageBuilder: MessageBuilder;
    private readonly sendEmailService: SendEmailService;
    private readonly userRepository: UserRepository;

    constructor() {
        this.messageBuilder = new MessageBuilder();
        this.sendEmailService = new SendEmailService();
        this.userRepository = userRepository;
    }

    async notifyOwnerNew(productId: number, price: number, ownerId: number): Promise<void> {
        const owner = await this.userRepository.findOneById(ownerId);
        if (owner && owner.email) {
            const email = this.messageBuilder
                .setSubject('Your product has received a new offer')
                .setText(`Your product ${productId} received a new offer for ${price} crystals`)
                .addRecipient(owner.email);
            this.sendEmailService.send(email);
        }
    }
}