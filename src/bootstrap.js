/* eslint-disable no-magic-numbers */
/**
 * Configure all libraries
 */

import bluebird from 'bluebird';
import Joi from 'joi';
import mongoose from 'mongoose';
import decorate from 'decorate-it';
import request from 'superagent';
import config from 'config';
import _ from 'lodash';
import { DroneStatus } from './Const';

mongoose.Promise = bluebird;
bluebird.promisifyAll(request);
require('babel-runtime/core-js/promise').default = bluebird; // eslint-disable-line import/no-commonjs

Joi.objectId = () => Joi.string().regex(/^[a-f0-9]{24}$/);
Joi.droneStatus = () => Joi.string().valid(_.values(DroneStatus));
Joi.lat = () => Joi.number().min(-90).max(90);
Joi.lng = () => Joi.number().min(-180).max(180);

decorate.configure({
  debug: config.VERBOSE_LOGGING,
});
