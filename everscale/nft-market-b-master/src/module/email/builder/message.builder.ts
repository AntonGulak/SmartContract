import { notifications_hosts } from "../../../config/notifications_hosts";
import { MailDto } from "./dto/mail.dto";

export class MessageBuilder {
    private subject: string = '';
    private text: string = '';
    private sender: MailDto;
    private recipients: MailDto[] = [];
    private ccs: MailDto[] = [];

    constructor() {
        this.sender = <MailDto>{ email: notifications_hosts.smtp.user, title: notifications_hosts.smtp.title};
    }

    public setSubject(subject: string): MessageBuilder {
        this.subject = subject;
        return this;
    }

    public setText(text: string): MessageBuilder {
        this.text = text;
        return this;
    }

    public setSender(email: string, title: string = ''): MessageBuilder {
        this.sender.email = email;
        this.sender.title = title;
        return this;
    }

    public addRecipient(email: string, title: string = ''): MessageBuilder {
        this.recipients.push({email: email, title: title});
        return this;
    }

    public addCc(email: string, title): MessageBuilder {
        this.ccs.push({email: email, title: title});
        return this;
    }

    public reset(): MessageBuilder {
        this.subject = '';
        this.text = '';
        this.sender = <MailDto>{ email: notifications_hosts.smtp.user, title: notifications_hosts.smtp.title};
        this.recipients = [];
        this.ccs = [];
        return this;
    }

    public build(): object {
        const message = {
            subject: this.subject,
            text: this.text,
            from: this.prepareMail(this.sender),
            to: this.prepareMails(this.recipients),
            cc: this.prepareMails(this.ccs)
        };
        this.reset();
        return message;
    }

    private prepareMails(mails: MailDto[]): string {
        return mails.map(mail => this.prepareMail(mail)).join(', ');
    }

    private prepareMail(mail: MailDto): string {
        if (!mail.title || !mail.title.length) {
            return mail.email;
        }
        return `${mail.title}  <${mail.email}>`;
    }
}