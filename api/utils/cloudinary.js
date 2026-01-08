// I made this file from youtube tutorial to handle image upload to cloudinary via backend
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // 🔴 replace
  api_key: process.env.CLOUDINARY_API_KEY, // 🔴 replace
  api_secret: process.env.CLOUDINARY_API_SECRET, // 🔴 replace
});

module.exports = cloudinary;