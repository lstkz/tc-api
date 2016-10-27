/* eslint-disable no-magic-numbers, import/no-commonjs */
/**
 * Main config file
 */

module.exports = {
  PORT: process.env.PORT || 3100,
  MONGODB_URL: process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tc_api',
  VERBOSE_LOGGING: true,
};
