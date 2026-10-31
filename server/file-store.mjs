import { mkdir, open, readdir, readFile, rename } from "node:fs/promises";
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

// One JSON file per submission. Ids are validated UUIDs before they reach this module.
export async function createFileStore(directory) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const fileFor = (id) => path.join(directory, `${id}.json`);
  const read = async (file) => JSON.parse(await readFile(file, "utf8"));

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
      try {
        await writeDurably(fileFor(record.id), JSON.stringify(record), "wx");
        return true;
      } catch (error) {
        if (error.code === "EEXIST") return false;
        throw error;
      }
    },

    async markDelivered(id, deliveredAt) {
      const file = fileFor(id);
      const temporary = `${file}.tmp`;
      await writeDurably(temporary, JSON.stringify({ ...(await read(file)), deliveredAt }), "w");
      await rename(temporary, file);
    },

    async pending() {
      const names = (await readdir(directory)).filter((name) => name.endsWith(".json"));
      const records = await Promise.all(names.map((name) => read(path.join(directory, name))));
      return records.filter((record) => !record.deliveredAt);
    },
  };
}
