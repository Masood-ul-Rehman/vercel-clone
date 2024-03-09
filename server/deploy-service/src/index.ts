import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

const subscriber = createClient({ url: process.env.redisUrl });
subscriber.connect();

async function main() {
  while (1) {
    const res = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );
    if (res && res.element) {
      await downloadS3Folder(`/output/${res.element}`);
      await buildProject(res.element);
    }
  }
}
main();
