const cloudinary = require("./Utils/cloudinary");

cloudinary.api
  .ping()
  .then((result) => {
    console.log("✅ Cloudinary Connected");
    console.log(result);
  })
  .catch((err) => {
    console.log("❌ Cloudinary Error");
    console.log(err);
  });
