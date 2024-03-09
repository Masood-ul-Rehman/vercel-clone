import express from "express";
import cors from "cors";
import { generate } from "./utils";
import simpleGit from "simple-git";
import path from "path";
import { uploadFile } from "./aws";
import { getAllFiles } from "./file";
import { createClient } from "redis";
const publisher = createClient({
  url: process.env.redisUrl,
});
publisher.connect();
const app = express();
app.use(cors());
app.use(express.json());
app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
  const files = getAllFiles(path.join(__dirname, `output/${id}`));
  console.log(files.slice(__dirname.length + 1));
  files.forEach(async (file) => {
    const path = file.slice(__dirname.length + 1);
    const modifiedPath = path.replace(/\\/g, "/");

    await uploadFile(modifiedPath, file);
  });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await publisher.lPush("build-queue", id);
  res.json({
    id,
  });
});
app.listen(5000, () => {
  console.log("Hello, it's started on port 5000");
});
