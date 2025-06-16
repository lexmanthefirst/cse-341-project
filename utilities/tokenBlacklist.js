const redisClient = require('../config/redis');

const BLACKLIST_PREFIX = 'blacklist';

const addToBlacklist = async (token, ttlInSeconds) => {
  const key = `${BLACKLIST_PREFIX}:${token}`;
  await redisClient.set(key, 'blacklisted', {
    EX: ttlInSeconds,
  });
};

const isBlacklisted = async token => {
  const key = `${BLACKLIST_PREFIX}:${token}`;
  const result = await redisClient.get(key);
  return result === 'blacklisted';
};
module.exports = {
  addToBlacklist,
  isBlacklisted,
};
