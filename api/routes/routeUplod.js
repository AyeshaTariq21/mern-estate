// I made this file from youtube tutorial to handle image upload to cloudinary via backend
const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../middleware/multer');

router.post('/upload', upload.single('image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({ 
             success: false,
             message: "Eror"});
        }

        res.status(200).json({ 
         success: true,
         message: "Uploaded!",
         data: result});
    });
});

module.exports = router;