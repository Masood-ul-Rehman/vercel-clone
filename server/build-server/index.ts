import express from "express";
import { exec } from "child_process";
import path from "path";
const app = express();
const intit = async () => {
  console.log("executing main funtion");
  const outdir = path.join(__dirname, "output");
  const p = exec(`cd ${outdir} && npm install && npm run build`);
  if (p.stdout) {
    p.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
    p.stdout.on("error", (data) => {
      console.log(`stdout: ${data}`);
    });
  }
  p.on("close", async () => {
    const distFolderPath = path.join(__dirname, "output", "dist");
  });
};
