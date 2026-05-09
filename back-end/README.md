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
    - Toujours: seed `system` pour `category/type/item` + migration ownership vers `SYSTEM_USER_ID`.
    - Dev seulement (`NODE_ENV=development` ou `SEED_INCLUDE_DEV_DATA=true`): seed `useruser` pour `session/lot/session_line`.

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
  3. `npm run prisma:seed` (seulement si ton process de déploiement le prévoit)

- **Avant de valider une PR en local**
  1. `npm run prisma:deploy`
  2. `npm run test:all`

## Notes importantes

- `prisma:reset` ne doit pas être utilisé en production.
- `prisma:migrate` sert à **créer** des migrations; `prisma:deploy` sert à **appliquer** des migrations existantes.
- Si tu utilises une base de test dédiée, pense à surcharger `DATABASE_URL` dans la commande ou l'environnement.
