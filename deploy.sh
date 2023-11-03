#!/bin/bash

# Step 4: SSH into the remote server on DigitalOcean
ssh root@128.199.211.230 << 'ENDSSH'
# Within the remote server:

    # Step 1: Pull the Docker image from Docker Hub
    docker pull kingdinner1/invoice_system

    # Step 2: Stop the currently running container
    docker stop $(docker ps -q --filter ancestor=kingdinner1/invoice_system)

    # Step 3: Remove the stopped container
    docker rm $(docker ps -aq --filter ancestor=kingdinner1/invoice_system)

    # Step 4: Run the Docker container with the updated image
    docker run -d -p 3000:3000 kingdinner1/invoice_system

    # Step 5: Test Nginx configuration
    nginx -t

    # Step 6: Reload Nginx to apply the changes
    systemctl reload nginx
ENDSSH
