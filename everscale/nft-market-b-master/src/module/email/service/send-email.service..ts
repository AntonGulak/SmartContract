import { Message, SMTPClient } from "emailjs";
import { notifications_hosts } from '../../../config/notifications_hosts';
import { MessageBuilder } from "../builder/message.builder";
import {SendEmailContract} from "../contract/send-email.contract";

export class SendEmailService implements SendEmailContract{
    send(messageBuilder: MessageBuilder) : void {
        const messageHeaders = messageBuilder.build();
        const client  = new SMTPClient({
            user:       notifications_hosts.smtp.user,
            password:   notifications_hosts.smtp.password,
            host:       notifications_hosts.smtp.host,
            port:       notifications_hosts.smtp.port,
            ssl:        notifications_hosts.smtp.certificate === 'ssl',
            tls:        notifications_hosts.smtp.certificate === 'tls'
        });

        const message = new Message(messageHeaders);

        client.send(message, (err, message) => {
            console.log(err || message);
        });
    }
}
