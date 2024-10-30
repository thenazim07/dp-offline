#!/bin/bash

# Name of the Docker container
CONTAINER_NAME="rx-frontend"

# Backup the current log file
LOG_FILE="/var/log/deployment.log"
if [ -f "$LOG_FILE" ]; then
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    mv "$LOG_FILE" "${LOG_FILE}_backup_$TIMESTAMP"
fi

# Function to log messages
log() {
    echo "$(date): $1" | tee -a "$LOG_FILE"
}
cd /var/www/releases/doctime-rx-frontend-docker
# Load the Docker image from the tarball and get the image name
log "Loading Docker image from rx-frontend.tar.gz..."
LOAD_OUTPUT=$(docker load -i rx-frontend.tar.gz 2>&1)
log "$LOAD_OUTPUT"

# Extract the image name
IMAGE_NAME=$(echo "$LOAD_OUTPUT" | grep -oP '(?<=Loaded image: )[^ ]+')
if [ -z "$IMAGE_NAME" ]; then
    log "Error: Failed to find the Docker image."
    exit 1
fi
log "Docker image loaded: $IMAGE_NAME"

# Stop and remove the existing container if it exists
if [ $(docker ps -aq -f name=$CONTAINER_NAME) ]; then
    log "Stopping and removing existing container..."
    docker stop $CONTAINER_NAME >> "$LOG_FILE" 2>&1
    docker rm $CONTAINER_NAME >> "$LOG_FILE" 2>&1
fi

# Run the new container
export $(cat /var/www/releases/doctime-rx-frontend-docker/.env | grep APP_ENV)
if [ "$APP_ENV" = "production" ]; then
    log "Running new container from the image..."
    docker run -d --restart=always --name $CONTAINER_NAME -p 4502:3000 --log-driver gelf --log-opt gelf-address=udp://10.0.0.118:12202 $IMAGE_NAME >> "$LOG_FILE" 2>&1
else
    docker run -d --restart=always --name $CONTAINER_NAME -p 4502:3000 $IMAGE_NAME >> "$LOG_FILE" 2>&1
fi

# Remove the old Docker image (optional)
# docker rmi $(docker images -q | awk 'NR>1')
log "Deployment completed successfully."
