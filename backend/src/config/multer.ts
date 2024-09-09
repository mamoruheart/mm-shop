import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where files will be stored
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName); // File name format
    }
});

export const upload = multer({storage})