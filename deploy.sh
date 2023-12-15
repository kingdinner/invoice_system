#!/bin/bash

# Step 1: Build the Docker image locally
docker build -t kingdinner1/invoice_system .

# Step 2: Tag the Docker image as 'latest'
docker tag kingdinner1/invoice_system kingdinner1/invoice_system:latest

# Push the Docker image to Docker Hub with retry mechanism
MAX_RETRIES=30
CURRENT_RETRY=0

while [ ${CURRENT_RETRY} -lt ${MAX_RETRIES} ]; do
    docker push kingdinner1/invoice_system:latest

    if [ $? -eq 0 ]; then
        echo "Image pushed successfully"
        break
    else
        echo "Image push failed. Retrying..."
        CURRENT_RETRY=$((CURRENT_RETRY+1))
        sleep 10  # Adjust the time between retries (in seconds)
    fi
done

if [ ${CURRENT_RETRY} -eq ${MAX_RETRIES} ]; then
    echo "Reached maximum retries. Image push unsuccessful."
fi

# SSH into the remote server and perform deployment steps
ssh root@128.199.211.230 << 'ENDSSH'
# Within the remote server:

    # Step 3: Stop the currently running container
    docker stop kingdinner1/invoice_system

    # Step 4: Pull the Docker image from Docker Hub
    docker pull kingdinner1/invoice_system

    # Step 6: Run the Docker container with the updated image
    docker run -d -p 3000:3000 kingdinner1/invoice_system

    # Step 7: Test Nginx configuration
    nginx -t

    # Step 8: Reload Nginx to apply the changes
    systemctl reload nginx
ENDSSH