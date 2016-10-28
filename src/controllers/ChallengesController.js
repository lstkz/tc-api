import ChallengeService from '../services/ChallengeService';

export default {
  search,
  addUserChallenges,
  getChallenge,
};


async function search(req, res) {
  const result = await ChallengeService.search(req.query);
  res.json(result);
}

async function getChallenge(req, res) {
  const result = await ChallengeService.getChallenge(req.params.id);
  res.json(result);
}

async function addUserChallenges(req, res) {
  await ChallengeService.addUserChallenges(req.params.handle);
  res.end();
}
