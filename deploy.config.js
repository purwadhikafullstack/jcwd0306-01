module.exports = {
  apps: [
    {
      name: "JCWD-0306-01", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8001,

        // config database
        MYSQL_USER: "jcwd030601",
        MYSQL_PASSWORD: "jcwd030601",
        MYSQL_DATABASE: "jcwd030601",
        MYSQL_HOST: "adminer2.purwadhikabootcamp.com",
        MYSQL_DIALECT: "mysql",
        MYSQL_TIMEZONE: "+07:00",

        JWT_SECRET_KEY: "RAHASIA",
        nodemailer_email: "gadgetgallerygroup2@gmail.com",
        nodemailer_password: "ngjodqocydilwihr",

        OpenCage_api_key: "c79ccba183824510808d5899fc0f6e62",
        RajaOngkir_api_key: "a44bb964bbfe84f56d5c38ca505def6e",
        Googlemaps_api_key: "AIzaSyD0BznkOcWn2BonYVT94uhlkwz1DycFjxg",
        URL: "https://jcwd030601.netlify.app/",
        REDIS_URL: "redis://localhost:6379",
      },
      time: true,
    },
  ],
};
