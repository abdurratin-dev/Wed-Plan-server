import express from 'express'
import cors from 'cors'
import router from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';

const app = express();

app.use(cors({origin: env.CLIENT_URL}));
app.use(express.json());

app.use('/', router);

app.use(notFound);
app.use(errorHandler);

export default app;