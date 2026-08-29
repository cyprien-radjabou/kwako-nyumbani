module.exports = {
  apps: [
    {
      name: "kwako-nyumbani",
      script: "node_modules/vinext/dist/cli.js",
      args: "start --hostname 127.0.0.1",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        DATABASE_PATH: "/var/lib/kwako-nyumbani/database.sqlite",
      },
    },
  ],
};
