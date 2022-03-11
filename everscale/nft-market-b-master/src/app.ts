import express, { Request, Response } from 'express';
import { router } from './app-routing';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { globals } from './config/globals';
import { AuthorizeUserInterceptor } from './module/user/interceptor/authorize-user.interceptor';

const app = express();
app.use(cors());
app.use(fileUpload({
    createParentPath: true,
}));
app.use(globals.BASE_PATH, express.static(globals.PUBLIC_ROOT));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authorizeUserInterceptor = new AuthorizeUserInterceptor();
app.use(authorizeUserInterceptor.intercept.bind(authorizeUserInterceptor));

app.use(router);

app.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Not found'});
});

app.listen(globals.APP_PORT, () => {
    console.log(`Running on PORT ${ globals.APP_PORT }.`);
});
