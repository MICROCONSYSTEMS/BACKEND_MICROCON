import express from 'express'
import {
    CreateFeedback,
    DeleteFeedback,
    GetFeedbackByProductId,
    GetFeedbackByUserId,
    GetAllFeedbacks,
    UpdateFeedback
} from '../controller/Feedback/index.js'
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';

const FeedbackRouter = express.Router();

FeedbackRouter.post('/create', AuthMiddleware, CreateFeedback);
FeedbackRouter.delete('/delete/:id', AuthMiddleware, DeleteFeedback);
FeedbackRouter.put('/update/:id', AuthMiddleware, UpdateFeedback);
FeedbackRouter.get('/get_by_userid/:id', AuthMiddleware, GetFeedbackByUserId);
FeedbackRouter.get('/get_by_productid/:id', GetFeedbackByProductId);
FeedbackRouter.get('/get_all', AuthMiddleware, GetAllFeedbacks);

export default FeedbackRouter;