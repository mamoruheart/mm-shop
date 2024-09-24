const AWS = require("aws-sdk");

const keys = require("../config/keys");

exports.s3Upload = async (image) => {
  try {
    let imageUrl = "";
    let imageKey = "";

    if (!keys.aws.accessKeyId) {
      throw new Error("Missing aws keys");
    }

    if (image) {
      const s3bucket = new AWS.S3({
        accessKeyId: keys.aws.accessKeyId,
        secretAccessKey: keys.aws.secretAccessKey,
        region: keys.aws.region
      });

      const params = {
        Bucket: keys.aws.bucketName,
        Key: image.originalname,
        Body: image.buffer,
        ContentType: image.mimetype
      };

      const s3Upload = await s3bucket.upload(params).promise();

      imageUrl = s3Upload.Location;
      imageKey = s3Upload.Key;
    }

    return { imageUrl, imageKey };
  } catch (err) {
    console.error("s3Upload:", err);
    return { imageUrl: "", imageKey: "" };
  }
};
