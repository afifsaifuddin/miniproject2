const multer = require("multer");
const fs = require("fs");

let defaultpath = "./public/images";
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const isdirectoryExist = fs.existsSync(`${defaultpath}/${file.fieldname}`);
    if (!isdirectoryExist)
      await fs.promises.mkdir(`${defaultpath}/${file.fieldname}`, {
        recursive: true,
      });
    cb(null, `${defaultpath}/${file.fieldname}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}` +
        "-" +
        Date.now() +
        Math.round(Math.random() * 1000000000) +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const maxsize = 1 * 1000 * 1000;
const filterFile = (req, file, cb) => {
  const filetype = file.mimetype.split("/")[1];
  if (
    filetype === "png" ||
    filetype === "jpg" ||
    filetype === "jpeg" ||
    filetype === "gif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Error format not match"));
  }
};
exports.multerUpload = multer({
  storage: storage,
  fileFilter: filterFile,
  limits: { fileSize: maxsize },
});
