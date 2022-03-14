FROM node:14.18
RUN [ "npm", "install", "pm2@5.1.2", "-g" ]
RUN [ "adduser", "--disabled-password", "-gecos", "", "testuser" ]
USER testuser
WORKDIR /home/testuser/
RUN [ "git", "clone", "https://github.com/KangnamUnivShuttle/plugin_weather.git", "./app" ]
WORKDIR /home/testuser/app
RUN [ "npm", "i" ]
COPY ecosystem.config.js ./
EXPOSE 3000/tcp
CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]
