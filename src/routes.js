
import ChallengesController from './controllers/ChallengesController';

export default {
  '/users/:handle/challenges': {
    post: {
      method: ChallengesController.addUserChallenges,
      public: true,
    },
  },
  '/challenges': {
    get: {
      method: ChallengesController.search,
      public: true,
    },
  },
  '/challenges/:id': {
    get: {
      method: ChallengesController.getChallenge,
      public: true,
    },
  },
};
