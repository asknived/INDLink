# INDLink Backup & Disaster Recovery Plan

## 1. Database Backups (MySQL)
**Automated Cron Strategy:**
A daily cron job on the VPS must execute `mysqldump` and upload the compressed archive securely to Cloudflare R2.

`backup.sh`
```bash
#!/bin/bash
DATE=$(date +"%Y%m%d%H%M")
mysqldump -u indlink -p'securepassword' indlink > /tmp/db_$DATE.sql
gzip /tmp/db_$DATE.sql
# Use AWS CLI mapped to R2 endpoint to upload
aws s3 cp /tmp/db_$DATE.sql.gz s3://indlink-backups/db_$DATE.sql.gz --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com
rm /tmp/db_$DATE.sql.gz
```

**Cron Schedule:** `0 2 * * * /path/to/backup.sh` (Runs at 2 AM Daily)

## 2. Media Backups (Cloudflare R2)
Cloudflare R2 inherently replicates data across regions. However, to protect against accidental bucket deletion or logical data corruption by the application:
*   Enable **Object Versioning** on the `indlink-media` bucket. This ensures deleted or overwritten files can be restored.

## 3. Disaster Recovery (RTO & RPO)
*   **Recovery Point Objective (RPO):** 24 hours (Based on daily database backup schedule).
*   **Recovery Time Objective (RTO):** < 1 hour.
    *   *Procedure:* Spin up a new VPS using the deployment script, restore the latest `.sql.gz` dump, and update Cloudflare DNS to the new VPS IP.
