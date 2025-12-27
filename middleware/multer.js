import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/"); // 📂 folder must exist
  },

  filename: function (req, file, callback) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    callback(null, uniqueName);
  },
});

// File filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  if (
  file.mimetype === "image/jpeg" ||
  file.mimetype === "image/jpg" ||   // 🔥 ADD THIS
  file.mimetype === "image/png" ||
  file.mimetype === "image/webp"
) {
  cb(null, true);
} else {
  cb(new Error("Only image files are allowed"), false);
}

};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
