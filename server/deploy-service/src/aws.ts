import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: process.env.endpoint,
});
export const downloadS3Folder = async (id: string) => {
  const allFiles = await s3
    .listObjectsV2({
      Bucket: "vercel-clone",
      Prefix: id,
    })
    .promise();
  const allPromises =
    allFiles.Contents?.map(async ({ Key: fileName }) => {
      return new Promise(async (reslove) => {
        if (!fileName) {
          reslove("");
          return;
        }
        const finalOutputPath = path.join(__dirname, fileName);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);

        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }

        try {
          await s3
            .getObject({
              Bucket: "vercel-clone",
              Key: fileName || "",
            })
            .createReadStream()
            .pipe(outputFile);
        } catch (error) {
          console.error(`Error fetching object from S3: ${error}`);
        }
      });
    }) || [];
  await Promise.all(allPromises?.filter((x) => x !== undefined));
};
