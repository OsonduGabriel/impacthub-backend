import multer from "multer";
import path from "path";

const __filename = import.meta.filename;
const __dirname = import.meta.dirname;

// configure multer for file uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "../../uploads/";
    if (file.fieldname === "avatar") {
      uploadPath += "avatars/";
    }
    if (file.fieldname === "document") {
      uploadPath += "documents/";
    }
    if (file.fieldname === "evidence") {
      uploadPath += "evidences/";
    }
    cb(null, path.join(__dirname, uploadPath));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// file filter: to determine specific formats to accept

const fileFilter = (req, file, callback) => {
  // Accept only images
  if (file.fieldname === "avatar") {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = "Only image files are allowed!";
      return callback(new Error("Only image files are allowed!"), false);
    }
  }
  // Accept only images and pdfs
  else if (file.fieldname === "document") {
    if (
      !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|pdf|PDF)$/)
    ) {
      req.fileValidationError = "Only image and pdf files are allowed!";
      return callback(
        new Error("Only image and pdf files are allowed!"),
        false,
      );
    }
  }

  callback(null, true);
};

// create a multer upload instance

const fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

const uploadProfileFiles = fileUpload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "document", maxCount: 1 },
  { name: "evidence", maxCount: 1 },
]);

export default uploadProfileFiles;