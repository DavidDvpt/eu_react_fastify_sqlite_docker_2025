# Back-end

## Prisma scripts

Les scripts Prisma utilisent `dotenv -e .env.dev`, donc ils chargent les variables du fichier `.env.dev` du dossier `back-end`.

- `npm run prisma:generate`
  - Génère le client Prisma à partir de `prisma/schema.prisma`.
  - À lancer après un changement de schéma (souvent fait automatiquement par `migrate dev`, mais utile en manuel).

- `npm run prisma:migrate -- <migration_name>`
  - Crée et applique une nouvelle migration en local (`prisma migrate dev`).
  - Exemple: `npm run prisma:migrate -- add_user_profile`
  - À utiliser quand tu modifies le schéma Prisma et veux versionner ce changement.

- `npm run prisma:deploy`
  - Applique les migrations déjà présentes (`prisma migrate deploy`).
  - À utiliser en CI / staging / prod (pas pour créer de nouvelles migrations).

- `npm run prisma:seed`
  - Exécute le seed Prisma (`prisma db seed`).
  - Comportement:
    - Toujours: seed `system` pour `SYSTEM_USER` + `category/type/item`.
    - Seulement si `NODE_ENV!=production` ou `SEED_INCLUDE_DEV_DATA=true`: seed `DEV_DATA_USER` + données perso (`lot/transaction/transaction_lot`).

- `npm run prisma:reset`
  - Reset complet de la base + réapplication des migrations (`prisma migrate reset --force`).
  - Destructif: supprime les données. Réservé au local/dev.

- `npm run prisma:sync`
  - Enchaîne `prisma:deploy` puis `prisma:generate`.
  - Pratique pour synchroniser une base existante avec les migrations déjà versionnées.

- `npm run dev:reset-and-seed`
  - Enchaîne `prisma:reset` puis `prisma:seed`.
  - Pratique pour repartir d'une base propre en local.

## Tests

- `npm run test:all`
  - Enchaîne `npm run test:db:migrate && npm run test`.
  - But: préparer la DB de test avant de lancer les tests.

## Ordre recommandé selon le cas

- **Premier setup local (ou DB locale vide)**
  1. `npm run prisma:deploy`
  2. `npm run prisma:generate`
  3. `npm run prisma:seed` (optionnel)

- **Tu modifies le schéma Prisma**
  1. Modifier `prisma/schema.prisma`
  2. `npm run prisma:migrate -- <migration_name>`
  3. `npm run prisma:generate` (si nécessaire)
  4. `npm run prisma:seed` (si tes données de dev doivent être réalignées)

- **Tu veux repartir à zéro en local**
  1. `npm run dev:reset-and-seed`

- **CI / staging / production**
  1. `npm run prisma:deploy`
  2. `npm run prisma:generate` (si le build/runtime en a besoin)
  3. `npm run prisma:seed` (seulement si tu veux réellement réinjecter les données seed)

- **Avant de valider une PR en local**
  1. `npm run prisma:deploy`
  2. `npm run test:all`

## Notes importantes

- `prisma:reset` ne doit pas être utilisé en production.
- `prisma:migrate` sert à **créer** des migrations; `prisma:deploy` sert à **appliquer** des migrations existantes.
- Si tu utilises une base de test dédiée, pense à surcharger `DATABASE_URL` dans la commande ou l'environnement.
- En prod Docker, les migrations puis le seed tournent au boot. `SEED_INCLUDE_DEV_DATA` contrôle seulement l'injection des données perso/dev.

## Deploiement SER5 (Docker Hub)

Le deploiement serveur utilise `docker-compose.server.yml` (images only, pas de build sur le serveur).

1. Depuis la machine de dev, copier le compose serveur sur SER5:

```bash
scp docker/docker-compose.server.yml davserv@davserv-SER:~/projects/docker/docker-compose.entropia-manager.yml
```

2. Sur SER5, preparer `~/projects/.env` (runtime):

```env
DOCKERHUB_NAMESPACE=lamouche42
IMAGE_TAG=latest
DATABASE_URL=postgresql://...@ser5-postgres:5432/entropia_manager_db
CORS_ORIGIN=http://entropia-manager
SYSTEM_USER_ID=
SYSTEM_USER_PSEUDO=system
SYSTEM_USER_EMAIL=system@entropia.local
SYSTEM_USER_PASSWORD=...
SEED_INCLUDE_DEV_DATA=false
```

3. Sur SER5, pull + run:

```bash
docker compose -p entropia-manager --env-file ~/projects/.env -f ~/projects/docker/docker-compose.entropia-manager.yml pull
docker compose -p entropia-manager --env-file ~/projects/.env -f ~/projects/docker/docker-compose.entropia-manager.yml up -d
```
