import dir from 'node-dir';
import fs from 'mz/fs';
import path from 'path';
import '../src/bootstrap';
import { Challenge } from '../src/models';

Promise.promisifyAll(dir);

async function start() {
  const files = await dir.filesAsync(path.join(__dirname, '../data'));
  await Challenge.remove({});
  const objects = await Promise.map(files,
    async(filePath) => JSON.parse(await fs.readFile(filePath, 'utf8')),
    { concurrency: 100 });
  await Challenge.create(objects);
  process.exit();
}

start();
