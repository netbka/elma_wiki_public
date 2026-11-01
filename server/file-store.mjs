import { randomUUID } from "node:crypto";
import { link, mkdir, open, readdir, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";

async function writeDurably(file, content, flags) {
  const handle = await open(file, flags, 0o600);
  try {
    await handle.writeFile(content);
    await handle.sync();
  } finally {
    await handle.close();
  }
}

// A new name is durable only once its directory is synced. Windows cannot open a directory this way.
async function syncDirectory(directory) {
  let handle;
  try {
    handle = await open(directory, "r");
    await handle.sync();
  } catch (error) {
    if (!["EISDIR", "EPERM", "EACCES"].includes(error.code)) throw error;
  } finally {
    await handle?.close();
  }
}

// One JSON file per submission. Ids are validated UUIDs before they reach this module.
export async function createFileStore(directory) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const fileFor = (id) => path.join(directory, `${id}.json`);
  const read = async (file) => JSON.parse(await readFile(file, "utf8"));
  const recordFiles = async () =>
    (await readdir(directory)).filter((name) => name.endsWith(".json")).map((name) => path.join(directory, name));

  // Leftovers of a crash mid-write hold visitor data and were never answered as received.
  for (const name of await readdir(directory)) {
    if (name.endsWith(".tmp")) await rm(path.join(directory, name), { force: true });
  }

  return {
    async has(id) {
      try {
        await read(fileFor(id));
        return true;
      } catch (error) {
        if (error.code === "ENOENT") return false;
        throw error;
      }
    },

    // False means the id already exists, so concurrent duplicates send one mail.
    async save(record) {
      const file = fileFor(record.id);
      const temporary = `${file}.${randomUUID()}.tmp`;
      try {
        await writeDurably(temporary, JSON.stringify(record), "wx");
        // The record appears whole or not at all: a crash cannot leave a broken file under its id.
        await link(temporary, file);
        await syncDirectory(directory);
        return true;
      } catch (error) {
        if (error.code === "EEXIST") return false;
        throw error;
      } finally {
        await rm(temporary, { force: true });
      }
    },

    async markDelivered(id, deliveredAt) {
      const file = fileFor(id);
      const temporary = `${file}.tmp`;
      await writeDurably(temporary, JSON.stringify({ ...(await read(file)), deliveredAt }), "w");
      await rename(temporary, file);
    },

    async pending() {
      const records = await Promise.all((await recordFiles()).map(read));
      return records.filter((record) => !record.deliveredAt);
    },

    async deleteDeliveredBefore(cutoff) {
      let deleted = 0;
      for (const file of await recordFiles()) {
        const { deliveredAt, receivedAt } = await read(file);
        if (deliveredAt && receivedAt < cutoff) {
          await rm(file, { force: true });
          deleted += 1;
        }
      }
      return deleted;
    },
  };
}
