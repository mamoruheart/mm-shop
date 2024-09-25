module.exports = {
  app: {
    name: "Michael’s Machines",
    apiURL: process.env.BASE_API_URL,
    //-- Toggle value by Git branch
    clientURL: process.env.CLIENT_URL_DEV
  },
  port: process.env.PORT || 3000,
  database: {
    url: process.env.MONGO_URI
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    tokenLife: "7d",
    myBearerPrefix: process.env.BEARER_PREFIX,
    sessSecret: process.env.SESSION_SECRET
  },
  mailchimp: {
    key: process.env.MAILCHIMP_KEY,
    listKey: process.env.MAILCHIMP_LIST_KEY
  },
  mailgun: {
    key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    sender: process.env.MAILGUN_EMAIL_SENDER
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //-- Toggle value by Git branch
    callbackURL: process.env.GOOGLE_CALLBACK_URL_DEV
  },
  apple: {
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    //-- Toggle value by Git branch
    callbackURL: process.env.APPLE_CALLBACK_URL_DEV
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME
  }
};
