import { Request } from 'express';
import { CommandContract } from '../../../contract/command.contract';
import { AuthorAssembler } from '../assembler/author.assembler';
import { GetAuthorDto } from './dto/get-author.dto';


export class GetAuthorCommand extends CommandContract {

    private authorAssembler: AuthorAssembler;

    constructor() {
        super();
        this.authorAssembler = new AuthorAssembler();
    }

    async run(req: Request): Promise<any> {
        const authorId = Number(req.params.id);
        const authorDto = await this.authorAssembler.assemble(authorId);

        return <GetAuthorDto>{ 
            item: authorDto
        };
    }
}
