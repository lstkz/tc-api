import request from 'superagent';
import decorate from 'decorate-it';
import Joi from 'joi';
import _ from 'lodash';
import { Challenge } from '../models';
import logger from '../common/logger';
import socket from '../socket';

// ------------------------------------
// Exports
// ------------------------------------

const ChallengeService = {
  addUserChallenges,
  updateChallenges,
  addActiveChallenges,
  search,
  getChallenge,
};

decorate(ChallengeService, 'ChallengeService');

export default ChallengeService;

// ------------------------------------
// Private
// ------------------------------------

function _removeEmptyStrings(obj) {
  return JSON.parse(JSON.stringify(obj, (name, value) => {
    if (_.isString(value) && !value.trim().length) {
      return null;
    }
    return value;
  }));
}

function _addNewChallenge(id) {
  return Challenge.findByIdAndUpdate(id, { $setOnInsert: { _isComplete: false } }, { upsert: true });
}

// ------------------------------------
// Public
// ------------------------------------


async function addUserChallenges(handle) {
  await Promise.map(_.range(20), async (page) => {
    try {
      const { body } = await request.get(`https://api.topcoder.com/v3/members/${handle}/challenges/`)
        .query({
          limit: 50,
          offset: page * 50,
        })
        .endAsync();

      await Promise.map(body.result.content, (challenge) => _addNewChallenge(challenge.id));
    } catch (e) {
      logger.error(e);
    }
  }, { concurrency: 10 });
}
addUserChallenges.params = ['handle'];
addUserChallenges.schema = {
  handle: Joi.string().required(),
};


async function updateChallenges(filter) {
  const challenges = await Challenge
    .find(filter)
    .sort({ _lastUpdate: 1 })
    .limit(200);

  await Promise.map(
    challenges,
    async(challenge) => {
      try {
        const { body } = await request.get(`https://api.topcoder.com/v2/develop/challenges/${challenge.id}`)
          .endAsync();
        _.assignIn(challenge, _removeEmptyStrings(body), { _isComplete: true, _lastUpdate: new Date() });
        await challenge.save();
      } catch (e) {
        const status = _.get(e, 'response.status');
        logger.error(challenge.id, e);
        if (status === 404 || status === 401) {
          challenge._invalid = true;
          await challenge.save();
        }
      }
//      socket.notifyUpdate(challenge);
    }, { concurrency: 10 });
}
updateChallenges.params = ['filter'];
updateChallenges.schema = {
  filter: Joi.object().required(),
};


async function addActiveChallenges() {
  const { body } = await request
    .get('https://api.topcoder.com/v2/challenges/active')
    .query({
      pageIndex: 1,
      pageSize: 1000,
      type: 'develop',
    })
    .endAsync();

  await Promise.map(body.data, (challenge) => _addNewChallenge(challenge.challengeId));
}
addActiveChallenges.params = [];
addActiveChallenges.schema = {};


async function search(criteria) {
  const filter = _.pick(criteria, 'challengeType', 'currentStatus');
  filter._invalid = {$ne: true};
  if (criteria.registeredHandle) {
    filter.registrants = {
      $elemMatch: {
        handle: criteria.registeredHandle,
      },
    };
  }
  if (criteria.submittedHandle) {
    filter.registrants = {
      $elemMatch: {
        handle: criteria.submittedHandle,
        submissionDate: { $ne: null },
      },
    };
  }

  const result = await Promise.props({
    count: Challenge.count(filter),
    items: Challenge
      .find(filter)
      .select('-detailedRequirements -finalSubmissionGuidelines')
      .sort(criteria.sort)
      .skip(criteria.offset)
      .limit(criteria.limit),
  });
  _.forEach(result.items, (item) => {
    if (!item._isComplete) {
      item.challengeName = '<loading>';
      item.platforms = [];
      item.technology = [];
      item.prize = [];
      item.registrants = [];
      item.submissions = [];
    }
  });
  return result;
}

search.removeOutput = true;
search.params = ['criteria'];
search.schema = {
  criteria: {
    challengeType: Joi.string().valid('UI Prototype Competition', 'Code', 'Assembly Competition', 'First2Finish'),
    currentStatus: Joi.string().valid('Active', 'Completed'),
    sort: Joi.string().valid('submissionEndDate', '-submissionEndDate').default('-postingDate'),
    registeredHandle: Joi.string(),
    submittedHandle: Joi.string(),
    offset: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).max(1000).default(20),
  },
};

async function getChallenge(id) {
  return await Challenge.findByIdOrError(id);
}
getChallenge.params = ['id'];
getChallenge.schema = {
  id: Joi.number().required(),
};