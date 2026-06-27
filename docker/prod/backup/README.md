# Backup journalier

Ce dossier contient le script de sauvegarde de la base `entropia-manager`.

Principe:

1. Le script s'exécute sur le serveur via cron.
2. Il lance `pg_dump` dans le conteneur `entropia-manager-api`.
3. Il écrit une archive dans `files/entropia-manager_YYYY-MM-DD.sql.gz`.
4. Il supprime les archives de plus de `30` jours.

Fichier d'environnement:

- Copier `backup.env.example` vers `.env` sur le serveur.
- Le script lit `.env` automatiquement s'il est présent dans le même dossier.
- `.env` doit définir `API_CONTAINER_NAME`, `BACKUP_DIR`, `RETENTION_DAYS` et `BACKUP_PREFIX`.
- `BACKUP_DIR` doit être un chemin absolu, pas `~`.
- Les dumps sont stockés dans `$BACKUP_DIR/files`.

Copie vers le serveur:

- Copier `.env.script.example` vers `.env.script` en local et remplir les valeurs.
- Lancer `copy-to-ser5.sh` pour pousser le script de backup et le fichier `.env` sur SER5.

Exemple de cron:

```cron
0 3 * * * /bin/bash /srv/apps/entropia-manager/docker/backup/backup-entropia-manager-db.sh >> /srv/apps/entropia-manager/docker/backup/backup.log 2>&1
```
