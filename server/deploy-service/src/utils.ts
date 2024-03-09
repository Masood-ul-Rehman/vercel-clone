import { exec } from "child_process";
import fs from "fs";
import path from "path";
export const buildProject = (id: string) => {
  return new Promise((resolve) => {
    const child = exec(
      `cd ${path.join(
        __dirname,
        `output/${id}`
      )} ** npm install && npm run build`
    );
    child.stdout?.on("data", function (data) {
      console.log("stdout:" + data);
    });
    child.stderr?.on("data", function (data) {
      console.log("stderr:" + data);
    });
    child.stdout?.on("close", function () {
      resolve("");
    });
  });
};
export const getAllFiles = (folderPath: string) => {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};
