export pathRx='/home/bp/Development/doctime-rx-frontend'


#!/bin/bash

export $(cat $pathRx/.env | grep APP_ENV)

# First i will install dependencies and build
cd $pathRx
/home/bp/.local/share/pnpm/pnpm install
/home/bp/.local/share/pnpm/pnpm run build

# I have left a few things in here and will explain this further (see below)
# echo "Syncing started: /var/www/releases/doctime-rx-frontend/ /var/www/doctime-rx-frontend" >> /var/log/deploy.log

# rsync --delete-before --verbose --archive --exclude ".git/*"  /var/www/releases/doctime-rx-frontend/ /var/www/doctime-rx-frontend/ >> /var/log/deploy.log

# echo "Syncing end: /var/www/releases/doctime-rx-frontend /var/www/doctime-rx-frontend" >> /var/log/deploy.log

cd $pathRx



echo "["$(date)"] Running npm dev script..." >> /var/log/deploy.log

fuser -k 3000/tcp
/home/bp/.nvm/versions/node/v21.5.0/bin/pm2 delete "doctime-rx-frontend-dev"

/home/bp/.nvm/versions/node/v21.5.0/bin/pm2 start pnpm --name doctime-rx-frontend-dev --time -- run dev

echo "["$(date)"] npm dev script completed..." >> /var/log/deploy.log
