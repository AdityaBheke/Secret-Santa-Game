import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from './src/middlewares/errorhandler.middleware.js';
import shuffleRouter from './src/routes/shuffle.route.js';
const PORT = process.env.PORT || 3000;
const server = express();
server.use(bodyParser.json());

server.use('/api/secret-santa', shuffleRouter);

server.get('/',(req, res)=>{
    res.json('Hello world')
})
// For Invalid API
server.use((req, res)=>{
    res.status(404).send("API not found")
})
// Error Handler
server.use(errorHandler);

server.listen(PORT,()=>{
    console.log('Server is listening on port ',PORT);
})