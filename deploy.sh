#!/bin/bash
set -e

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "Docker daemon is not running. Please start Docker."
    exit 1
fi

IMAGE_NAME="dim-website"
CONTAINER_NAME="dim-website"
HOST_PORT=3000
CONTAINER_PORT=80

# Build the image
docker build -t $IMAGE_NAME .

# Stop and remove existing container if it exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Run the container
docker run -d \
    --name $CONTAINER_NAME \
    --restart always \
    -p $HOST_PORT:$CONTAINER_PORT \
    $IMAGE_NAME

echo "Deployment complete!"
