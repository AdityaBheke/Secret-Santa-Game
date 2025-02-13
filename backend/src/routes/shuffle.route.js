import express from 'express';
import ShuffleController from '../controllers/shuffle.controller.js';
import fileUpload from '../middlewares/fileUpload.middleware.js';

const shuffleRouter = express.Router();
const shuffleController = new ShuffleController();
shuffleRouter.post('/shuffle',fileUpload.single('file'),(req, res, next)=>{
    shuffleController.shuffleEmployees(req, res, next);
})
export default shuffleRouter;