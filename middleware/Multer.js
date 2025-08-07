import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 200 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.size > 200 * 1024) {
            return cb(new Error('File size should be less than 200KB'));
        }
        cb(null, true);
    }
});

const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: "File validation failed! File must be less than 200KB"
        });
    } else if (err) {
        return res.status(500).json({
            success: false,
            message: "An unknown error occurred during the file upload"
        });
    }
    next();
};



export { upload, uploadErrorHandler };
