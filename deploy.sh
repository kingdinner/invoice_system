#!/bin/bash

# Step 1: Build the Docker image locally
docker build -t kingdinner1/invoice_system --cache-from kingdinner1/invoice_system .

# Step 2: Tag the Docker image as 'latest'
docker tag kingdinner1/invoice_system kingdinner1/invoice_system:latest

# Step 3: Push the Docker image to Docker Hub
docker push kingdinner1/invoice_system:latest

# Step 4: SSH into the remote server on DigitalOcean
ssh root@128.199.211.230 << 'ENDSSH'
# Within the remote server:

    # Step 5: Pull the Docker image from Docker Hub
    docker pull kingdinner1/invoice_system

    # Step 6: Stop the currently running container
    docker stop ae736c8fce21

    # Step 8: Run the Docker container with the updated image
    docker run -d -p 3000:3000 kingdinner1/invoice_system

    # Step 9: Test Nginx configuration
    nginx -t

    # Step 10: Reload Nginx to apply the changes
    systemctl reload nginx
ENDSSH
