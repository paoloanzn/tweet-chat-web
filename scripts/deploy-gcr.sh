#!/bin/bash

# Exit on error
set -e

# Check if GCP_PROJECT_ID is set
if [ -z "$GCP_PROJECT_ID" ]; then
    echo "Error: GCP_PROJECT_ID environment variable is not set"
    exit 1
fi

# Configure docker to use gcloud as a credential helper
gcloud auth configure-docker

# Build and push using docker-compose
docker-compose build api
docker-compose push api

echo "Successfully built and pushed image to GCR"