#!/bin/bash

# Step 1: Build the Docker image locally
docker build -t kingdinner1/invoice_system .

# Step 2: Tag the Docker image as 'latest'
docker tag kingdinner1/invoice_system kingdinner1/invoice_system:latest

# Step 3: Push the Docker image to Docker Hub
docker push kingdinner1/invoice_system

# Step 4: SSH into the remote server on DigitalOcean
ssh root@128.199.211.230 << 'ENDSSH'
# Within the remote server:

# Step 5: Update system packages
apt update

# Step 6: Install Docker
apt install -y docker.io

# Step 7: Start and enable the Docker service
systemctl start docker
systemctl enable docker

# Step 8: Pull the Docker image from Docker Hub
docker pull kingdinner1/invoice_system

# Step 9: Run the Docker container
docker run -d -p 3000:3000 kingdinner1/invoice_system

# Step 10: Add Nginx Configuration for Basic Authentication
echo 'server {
    location /protected {
        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}' > /etc/nginx/sites-available/your-site-config

# Step 11: Create a symbolic link to enable the site
ln -s /etc/nginx/sites-available/your-site-config /etc/nginx/sites-enabled/

# Step 12: Test Nginx configuration
nginx -t

# Step 13: Reload Nginx to apply the changes
systemctl reload nginx
ENDSSH
