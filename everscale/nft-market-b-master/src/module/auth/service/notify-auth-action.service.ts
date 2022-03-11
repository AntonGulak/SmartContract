import { MessageBuilder } from "../../email/builder/message.builder";
import { SendEmailService } from "../../email/service/send-email.service.";

export class NotifyAuthActionService {
    private readonly messageBuilder: MessageBuilder;
    private readonly sendEmailService: SendEmailService;

    constructor() {
        this.messageBuilder = new MessageBuilder();
        this.sendEmailService = new SendEmailService();
    }

    notifyUserNew(userEmail: string|null): void {
        if (userEmail) {
            const message = this.messageBuilder
                .setSubject('Welcome to NFT market')
                .setText('You have successfully registered on NFT market!')
                .addRecipient(userEmail);
            this.sendEmailService.send(message);
        }
    }
}