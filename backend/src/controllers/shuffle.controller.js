
import path from "path";
import { assignSecretChild, deleteFile, getDownloadFile } from "../services/shuffle.service.js";
import fs from 'fs';
export default class ShuffleController{
    async shuffleEmployees(req, res, next){
        try {
          const newFile = await assignSecretChild(req.file);
          if (!fs.existsSync(path.resolve("public", "downloads", newFile))) {
            return res.status(404).send("File not found");
          }
          res.status(201).json({ message: "File ready to download", file: newFile });
        } catch (error) {
          next(error);
        }
    }
    downloadCsv(req, res, next){
        try {
            const fileName = req.params.filename;
            const downloadFilePath = getDownloadFile(fileName)
            res.status(200).download(downloadFilePath);
        } catch (error) {
            next(error)
        }
    }
    deleteDownloadedFile(req, res, next){
        try {
            const fileName = req.params.filename;
            deleteFile(fileName);
            res.status(200).json({message: "File deleted"})
        } catch (error) {
            next(error)
        }
    }
}