import { commandOptions, createClient } from "redis";

const subscriber = createClient();
subscriber.connect();
const publisher = createClient();
publisher.connect();
async function main() {
  while (1) {
    const res = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );
  }
}
main();
