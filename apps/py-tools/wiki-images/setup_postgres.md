**But**
Préparer une base PostgreSQL dédiée à `wiki-images` tout en réutilisant l'instance locale Docker déjà utilisée par le back-end.

**Variables**
Le fichier local [`.env`](</Users/davidmosca/personalProjects/eu_react_fastify_docker/apps/py-tools/wiki-images/.env>) contient:

- `PY_IMAGE_DB_HOST`
- `PY_IMAGE_DB_PORT`
- `PY_IMAGE_DB_NAME`
- `PY_IMAGE_DB_USER`
- `PY_IMAGE_DB_PASSWORD`
- `PY_IMAGE_DATABASE_URL`
- `PY_IMAGE_DOWNLOAD_BASE_URL`

Le modèle versionnable est [`.env.example`](</Users/davidmosca/personalProjects/eu_react_fastify_docker/apps/py-tools/wiki-images/.env.example>).

**Choix retenu**

- instance PostgreSQL existante: `localhost:5433`
- base dédiée: `wiki_images`
- user dédié: `py_image_user`

**Connexion Python**
Le module [db.py](/Users/davidmosca/personalProjects/eu_react_fastify_docker/apps/py-tools/wiki-images/db.py) charge le `.env` local et fournit:

- `load_postgres_settings()`
- `build_database_url()`
- `connect_database()`

Le driver Python utilisé en dev et en prod est déclaré dans [requirements.txt](/Users/davidmosca/personalProjects/eu_react_fastify_docker/apps/py-tools/wiki-images/requirements.txt):

- `psycopg[binary]==3.2.12`

**Init DB**
Le script [init_db.py](/Users/davidmosca/personalProjects/eu_react_fastify_docker/apps/py-tools/wiki-images/init_db.py) fait maintenant l'initialisation complète:

- création des tables via [init_schema.sql](/Users/davidmosca/personalProjects/eu_react_fastify_docker/apps/py-tools/wiki-images/sql/init_schema.sql)
- hydratation de la table `images` depuis les fichiers déjà présents dans `micro/`, `normal/`, `original/`

Le schéma créé contient:

- `images`: état courant des images disponibles sur disque
- `download_attempts`: historique des tentatives de téléchargement

**Smoke test**
Le script [smoke_test_db.py](/Users/davidmosca/personalProjects/eu_react_fastify_docker/apps/py-tools/wiki-images/smoke_test_db.py) vérifie:

- l'ouverture de connexion
- un insert/upsert simple
- une relecture
- un check d'existence pour l'exclusion
- le nettoyage final de la ligne de test

Le script [test_download_range_flow.py](/Users/davidmosca/personalProjects/eu_react_fastify_docker/apps/py-tools/wiki-images/test_download_range_flow.py) couvre le flux métier de plage d'ids:

- un id déjà présent dans `images` est exclu
- un id déjà marqué `404` dans `download_attempts` est exclu
- les résultats de download simulés sont insérés dans `download_attempts`
- les succès simulés sont upsertés dans `images`
