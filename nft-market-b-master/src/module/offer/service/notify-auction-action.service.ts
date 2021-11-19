import { MessageBuilder } from "../../email/builder/message.builder";
import { SendEmailService } from "../../email/service/send-email.service.";
import { UserRepository, userRepository } from "../../user/repository/user.repository";

export class NotifyAuctionActionService {
    private readonly messageBuilder: MessageBuilder;
    private readonly sendEmailService: SendEmailService;
    private readonly userRepository: UserRepository;

    constructor() {
        this.messageBuilder = new MessageBuilder();
        this.sendEmailService = new SendEmailService();
        this.userRepository = userRepository;
    }

    async notifyOwnerSold(ownerId: number, productId: number): Promise<void> {
        const prevOwner = await this.userRepository.findOneById(ownerId);
        if (prevOwner && prevOwner.email) {
            const prevOwnerMessage = this.messageBuilder
                .addRecipient(prevOwner.email)
                .setSubject('Your product has been sold')
                .setText(`Congratulations! Your product (${productId}) has been sold.`);
            this.sendEmailService.send(prevOwnerMessage);
        }

    }

    async notifyBuyerWin(ownerId:number, productId: number): Promise<void> {
        const currentOwner = await this.userRepository.findOneById(ownerId);
        if (currentOwner && currentOwner.email) {
            const newOwnerMessage = this.messageBuilder
                .addRecipient(currentOwner.email)
                .setSubject('Your offer won.')
                .setText(`Congratulations! Your offer won. You are the new owner of the product (${productId}).`);
            this.sendEmailService.send(newOwnerMessage);
        }
    }

    async notifyOwnerStop(ownerId: number, productId: number): Promise<void> {
        const owner = await this.userRepository.findOneById(ownerId);
        if (owner && owner.email) {
            const message = this.messageBuilder
                .addRecipient(owner.email)
                .setSubject('Auction stopped.')
                .setText(`Product (${productId}) auction stopped.`);
            this.sendEmailService.send(message);
        }
    }
}