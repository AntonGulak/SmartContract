import {MessageBuilder} from "../builder/message.builder";

export interface SendEmailContract {
    send(message: MessageBuilder) : void
}