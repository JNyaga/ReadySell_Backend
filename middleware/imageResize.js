const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2;


const outputFolder = "public/assets";

module.exports = async (req, res, next) => {
  const images = [];

  const resizePromises = req.files.map(async (file) => {
    await sharp(file.path)
      .resize(2000)
      .jpeg({ quality: 50 })
      .toFile(path.resolve(outputFolder, file.filename + "_full.jpg"));
    
    await cloudinary.uploader.upload(path.resolve(outputFolder, file.filename + "_full.jpg"),{ 
      folder: "readysell/assets/",
      public_id:file.filename + "_full",
      overwrite:true
    })

    await sharp(file.path)
      .resize(100)
      .jpeg({ quality: 30 })
      .toFile(path.resolve(outputFolder, file.filename + "_thumb.jpg"));
    
    await cloudinary.uploader.upload(path.resolve(outputFolder, file.filename + "_thumb.jpg"),{ 
      folder: "readysell/assets/",
      public_id:file.filename + "_thumb",
      overwrite:true
    })

    fs.unlinkSync(file.path);

    images.push(file.filename);
  });

  await Promise.all([...resizePromises]);

  req.images = images;

  next();
};
