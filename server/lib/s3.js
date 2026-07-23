const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function publicUrl(key) {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

function buildKey(folder, originalName) {
  const ext = (originalName.match(/\.[a-zA-Z0-9]+$/) || [""])[0];
  return `${folder}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
}

async function uploadBuffer({ buffer, contentType, folder = "uploads", originalName = "file" }) {
  const key = buildKey(folder, originalName);
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return { key, url: publicUrl(key) };
}

async function deleteObject(key) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

async function getUploadPresignedUrl({ folder = "uploads", originalName = "file", contentType }) {
  const key = buildKey(folder, originalName);
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { key, uploadUrl, publicUrl: publicUrl(key) };
}

module.exports = { s3, uploadBuffer, deleteObject, getUploadPresignedUrl, publicUrl, BUCKET, REGION };
