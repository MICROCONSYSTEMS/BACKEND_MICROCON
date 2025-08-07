import express from 'express';
import { sendQuery } from '../controller/ContactPage/index.js';

const ContactFormRouter = express.Router();

ContactFormRouter.post('/send-query',sendQuery);

export default ContactFormRouter;