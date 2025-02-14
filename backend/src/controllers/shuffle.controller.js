
import path from "path";
import { assignSecretChild, deleteFile, getDownloadFile } from "../services/shuffle.service.js";
import fs from 'fs';
export default class ShuffleController {
    
    // Method to shuffle employees and assign secret children
    async shuffleEmployees(req, res, next) {
        try {
            // Assign secret children and get the new file
            const newFile = await assignSecretChild(req.file);

            // Check if the newly created file exists
            if (!fs.existsSync(path.resolve("public", "downloads", newFile))) {
                return res.status(404).send("File not found");
            }

            // Respond with the file ready for download
            res.status(201).json({ message: "File ready to download", file: newFile });
        } catch (error) {
            // Pass any errors to the next middleware
            next(error);
        }
    }

    // Method to download the CSV file
    downloadCsv(req, res, next) {
        try {
            // Extract the file name from the URL parameters
            const fileName = req.params.filename;

            // Get the file's path to download
            const downloadFilePath = getDownloadFile(fileName);

            // Send the file as a download response
            res.status(200).download(downloadFilePath);
        } catch (error) {
            // Pass any errors to the next middleware
            next(error);
        }
    }

    // Method to delete the downloaded file
    deleteDownloadedFile(req, res, next) {
        try {
            // Extract the file name from the URL parameters
            const fileName = req.params.filename;

            // Delete the file
            deleteFile(fileName);

            // Respond with a success message
            res.status(200).json({ message: "File deleted" });
        } catch (error) {
            // Pass any errors to the next middleware
            next(error);
        }
    }
}
