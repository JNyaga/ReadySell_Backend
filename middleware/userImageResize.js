const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path')


const outputFolder = "/tmp/";



module.exports = async (req, res, next) => {
  const file = req.file;
  const imageName = "profile" + req.user.userId;

  fs.readdir('/tmp/', async (err, files) => {
    if (err) {
      console.error(err);
    } else {
      for (const file of files) {
        console.log(path.parse(file).name);
      }
    }
  }
  );

  await sharp(file.path)
    .resize(2000)
    .jpeg({ quality: 50 })
    .toFile(path.resolve(outputFolder, imageName + "_full.jpg"));

  await cloudinary.uploader.upload(path.resolve(outputFolder, imageName + "_full.jpg"), {
    folder: "readysell/assets/",
    public_id: imageName + "_full",
    overwrite: true
  })


  await sharp(file.path)
    .resize(100)
    .jpeg({ quality: 30 })
    .toFile(path.resolve(outputFolder, imageName + "_thumb.jpg"));

  await cloudinary.uploader.upload(path.resolve(outputFolder, imageName + "_thumb.jpg"), {
    folder: "readysell/assets/",
    public_id: imageName + "_thumb",
    overwrite: true
  })


  fs.unlinkSync(file.path);


  req.image = imageName;

  next();
};
