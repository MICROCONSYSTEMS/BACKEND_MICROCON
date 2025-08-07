import express from 'express';
import {
    createOrUpdateGlobalConfig,
    GetGlobalConfig
} from '../controller/GlobalConfig/index.js';

const GlobalConfigRouter = express.Router();

GlobalConfigRouter.get('/get-global-config',GetGlobalConfig);
GlobalConfigRouter.post('/add-edit-global-config',createOrUpdateGlobalConfig);

export default GlobalConfigRouter;