
import { assignSecretChild } from "../services/shuffle.service.js";
export default class ShuffleController{
    async shuffleEmployees(req, res, next){
        if (!req.file) {
            res.status(400).json({message: "Please Upload a file"});
            return
        }
        await assignSecretChild(req.file);
        res.status(200).json({message: "File Uploaded", file: req.file});
    }
}