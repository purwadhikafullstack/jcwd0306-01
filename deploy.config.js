module.exports = {
  apps: [
    {
      name: 'JCWD-0306-01', // Format JCWD-{batchcode}-{groupnumber}
      script: './projects/server/src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      time: true,
    },
  ],
};
