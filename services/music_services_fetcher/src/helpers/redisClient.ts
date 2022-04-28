import * as redis from 'redis';


function initRedis() {
  if(process.env.NODE_ENV === 'production') {
    throw new Error('Redis is not supported in production');
  } else {
    return redis.createClient(6379, 'localhost');
  }
}
const redisClient = initRedis()

export default redisClient;