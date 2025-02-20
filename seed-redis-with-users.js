const Redis = require("ioredis");
const falso = require('@ngneat/falso');
const dotenv = require('dotenv');
dotenv.config();

// Configuration
const USERS_COUNT = 100;
const BATCH_SIZE = 5;

// Initialize Redis
const redis = new Redis({
  port: Number(process.env.redisPort || 6379),
  host: process.env.redisEndpoint,
});

// Generate a random username and password
function generateUser() {
  return {
    username: falso.randUserName(),
    password: falso.randPassword(),
  };
}

async function storeUsersInRedis(users) {
    const pipeline = redis.pipeline();
    users.forEach(user => {
      if (user) {
        pipeline.lpush('users', user);
      }
    });
    await pipeline.exec();
  }

// Main function to seed users
async function seedUsers() {
  for (let i = 0; i < USERS_COUNT; i += BATCH_SIZE) {
    // Generate users
    const users = Array.from({ length: BATCH_SIZE }, generateUser);
    await storeUsersInRedis(users);
    console.log(users);
    console.log(`Batch ${i / BATCH_SIZE + 1} completed.`);
  }
  console.log('All users have been seeded and stored in Redis.');
  process.exit(0);
}

seedUsers();
