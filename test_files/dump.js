import fs from 'mz/fs';
import path from 'path';
import '../src/bootstrap';
import { Challenge } from '../src/models';

async function start() {
  const challenges = await Challenge.find({}).lean();
  await Promise.map(challenges, (challenge) => {
    return fs.writeFile(path.join(__dirname, `../data/${challenge._id}.json`), JSON.stringify(challenge, null, 2));
  }, { concurrency: 100 });
  process.exit();
}

start();
