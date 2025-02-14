import express from 'express';
import ShuffleController from '../controllers/shuffle.controller.js';
import fileUpload from '../middlewares/fileUpload.middleware.js';

const shuffleRouter = express.Router();
// Create an instance of ShuffleController
const shuffleController = new ShuffleController();

// Route to handle employee shuffling
shuffleRouter.post('/shuffle', fileUpload.single('file'), (req, res, next) => {
    shuffleController.shuffleEmployees(req, res, next);
});

// Route to handle downloading a shuffled file by filename
shuffleRouter.get('/download/:filename', (req, res, next) => {
    shuffleController.downloadCsv(req, res, next);
});

// Route to handle deleting a downloaded file by filename
shuffleRouter.delete('/delete/:filename', (req, res, next) => {
    shuffleController.deleteDownloadedFile(req, res, next);
});

export default shuffleRouter;
