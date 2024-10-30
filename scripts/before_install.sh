
#!/usr/bin/env bash

# I want to make sure that the directory is clean and has nothing left over from
# previous deployments. The servers auto scale so the directory may or may not
# exist.
echo "Cleaning release folder.." >> /var/log/deploy.log

if [ -d /var/www/releases/doctime-rx-frontend-docker ]; then
    rm -rf /var/www/releases/doctime-rx-frontend-docker
fi
mkdir -vp /var/www/releases/doctime-rx-frontend-docker

echo "Cleaning release finished.." >> /var/log/deploy.log
