import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./aws";

const subscriber = createClient({ url: process.env.redisUrl });
subscriber.connect();

async function main() {
  while (1) {
    const res = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );
    await downloadS3Folder(`/output/${res?.element}`);
  }
}
main();
