import express from 'express';
import { RequestBackInStock } from "../controller/NotifyUser/index.js";

const NotifyRouter = express.Router();

NotifyRouter.post('/update-notify-user',RequestBackInStock);

export default NotifyRouter