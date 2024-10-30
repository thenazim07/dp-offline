#!/usr/bin/env bash

export $(cat /var/www/releases/doctime-rx-frontend/.env | grep APP_ENV)

# First i will install dependencies and build
cd /var/www/releases/doctime-rx-frontend
pnpm install
pnpm run build

# I have left a few things in here and will explain this further (see below)
echo "Syncing started: /var/www/releases/doctime-rx-frontend/ /var/www/doctime-rx-frontend" >> /var/log/deploy.log

rsync --delete-before --verbose --archive --exclude ".git/*"  /var/www/releases/doctime-rx-frontend/ /var/www/doctime-rx-frontend/ >> /var/log/deploy.log

echo "Syncing end: /var/www/releases/doctime-rx-frontend /var/www/doctime-rx-frontend" >> /var/log/deploy.log

cd /var/www/doctime-rx-frontend


if [ "$APP_ENV" = "development" ]; then
    echo "["$(date)"] Running npm dev script..." >> /var/log/deploy.log

#    fuser -k 4500/tcp
#    pm2 delete "doctime-rx-frontend-dev"

#    pm2 start pnpm --name doctime-rx-frontend-dev --time -- run development

fuser -k 3000/tcp
pm2 delete doctime-rx-frontend-dev
pm2 start pnpm --name doctime-rx-frontend-dev --time -- run preview

   echo "["$(date)"] npm dev script completed..." >> /var/log/deploy.log
else
    echo "["$(date)"] Running npm prod script..." >> /var/log/deploy.log


    fuser -k 3000/tcp

    pm2 delete "doctime-rx-frontend"

    pm2 --name doctime-rx-frontend start node -- .output/server/index.mjs --port 3000

    echo "["$(date)"] npm prod script completed..." >> /var/log/deploy.log

fi



# fuser -k 3000/tcp

# pm2 delete "doctime-rx-frontend"

# #pm2 --name doctime-rx-frontend start pnpm -- start --port 3000

# # for nuxt 3

# pm2 --name doctime-rx-frontend start node -- .output/server/index.mjs --port 3000
