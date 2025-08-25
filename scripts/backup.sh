#!/bin/bash
DATE=$(date +%F)
pg_dump -U postgres -d medical_enote > backup_$DATE.sql
echo "Backup terminé : backup_$DATE.sql"
