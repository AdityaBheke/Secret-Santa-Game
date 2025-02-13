import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.resolve('public', 'uploads'))
    },
    filename: (req, file, cb)=>{
        const fileName = Date.now() +'-'+ file.originalname;
        cb(null, fileName)
    }
})

const fileUpload = multer({storage});

export default fileUpload;