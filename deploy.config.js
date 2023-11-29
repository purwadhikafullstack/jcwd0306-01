module.exports = {
  apps: [
    {
      name: 'JCWD-0306-01', // Format JCWD-{batchcode}-{groupnumber}
      script: './projects/server/src/index.js',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: process.env.PORT || 8001,
        MYSQL_USER: process.env.MYSQL_USER || 'jcwd030601',
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'jcwd030601',
        MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'jcwd030601',
        MYSQL_HOST: process.env.MYSQL_HOST || 'adminer2.purwadhikabootcamp.com',
        MYSQL_DIALECT: process.env.MYSQL_DIALECT || 'mysql',
        MYSQL_TIMEZONE: process.env.MYSQL_TIMEZONE || '+07:00',
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'RAHASIA',
        nodemailer_email:
          process.env.nodemailer_email || 'gadgetgallerygroup2@gmail.com',
        nodemailer_password:
          process.env.nodemailer_password || 'ngjodqocydilwihr',
        OpenCage_api_key:
          process.env.OpenCage_api_key || 'c79ccba183824510808d5899fc0f6e62',
        RajaOngkir_api_key:
          process.env.RajaOngkir_api_key || 'RajaOngkir_api_key',
        Googlemaps_api_key:
          process.env.Googlemaps_api_key ||
          'AIzaSyD0BznkOcWn2BonYVT94uhlkwz1DycFjxg',
        URL: process.env.URL || 'https://jcwd030601.netlify.app/',
        REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
      },
      time: true,
    },
  ],
};
