
const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
  jwt: {
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_age: process.env.ACCESS_TOKEN_AGE,
    refresh_token_key: process.env.REFRESH_TOKEN_KEY,
  },
};

module.exports = config;
