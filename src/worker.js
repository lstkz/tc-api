import ms from 'ms';
import Timer from './common/timer';
import ChallengeService from './services/ChallengeService';

const _updateNewChallenges = new Timer({
  name: 'Update New Challenges',
  timeout: ms('10s'),
  fn: async() => {
    await ChallengeService.updateChallenges({
      _isComplete: false,
      _invalid: { $ne: true },
    });
  },
});

const _updateRunningChallenges = new Timer({
  name: 'Update Running Challenges',
  timeout: ms('1m'),
  fn: async() => {
    await ChallengeService.updateChallenges({
      _isComplete: true,
      currentStatus: { $ne: 'Completed' },
      _invalid: { $ne: true },
    });
  },
});

const _addActiveChallenges = new Timer({
  name: 'Add Active Challenges',
  timeout: ms('1m'),
  fn: async() => {
    await ChallengeService.addActiveChallenges();
  },
});

_updateNewChallenges.start();
_updateRunningChallenges.start();
_addActiveChallenges.start();
