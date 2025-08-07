import express from 'express'
import {
    GetAllMembers,
    AddMember,
    UpdateMember,
    DeleteMember,
} from '../controller/TeamMember/index.js'
import { upload } from '../middleware/Multer.js';
import { AdminMiddleware } from '../middleware/AdminMiddleware.js';

const TeamMember = express.Router();

TeamMember.get('/get-all-members', GetAllMembers);
TeamMember.put('/update-team-member/:memberId', AdminMiddleware, upload.single('file'), UpdateMember);
TeamMember.delete('/delete-team-member/:memberId', AdminMiddleware, DeleteMember);
TeamMember.post('/add-team-member', AdminMiddleware, upload.single('file'), AddMember);

export default TeamMember;