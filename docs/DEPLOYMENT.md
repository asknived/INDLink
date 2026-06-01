# INDLink Deployment Guide (VPS & Hostinger)

## Hardware Requirements (Ubuntu 24.04)
*   **Development / Staging:** 2 vCPU, 4 GB RAM
*   **Production (Minimum):** 4 vCPU, 8 GB RAM, 100 GB NVMe SSD (Hostinger VPS recommended)

## 1. Initial Server Setup
SSH into your Ubuntu 24.04 VPS:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw nginx certbot python3-certbot-nginx
```

## 2. Docker & Docker Compose Setup
INDLink relies heavily on Docker for orchestration:
```bash
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 3. Deployment Steps
1.  Clone the repository: `git clone https://github.com/your-org/indlink.git /var/www/indlink`
2.  Navigate to the directory: `cd /var/www/indlink`
3.  Create your production `.env` file based on `.env.example`.
4.  Launch the stack: `sudo docker compose up -d --build`

## 4. Nginx Reverse Proxy
Copy the provided `nginx.conf` to `/etc/nginx/sites-available/indlink`:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/indlink
sudo ln -s /etc/nginx/sites-available/indlink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. SSL / HTTPS Setup
Run Certbot to secure the domain:
```bash
sudo certbot --nginx -d indlink.in -d www.indlink.in
```
