# Session Lifecycle

Ce document fige les regles metier autour des sessions et de leur cycle de vie.

## Session Types

- `transaction` (remplace le concept historique `trade`)
- `mining`
- `crafting`

Note: la base actuelle peut encore contenir la valeur technique `TRADE` tant que la migration de schema n'est pas appliquee.

## Session Status

- `open`: la session est en cours (production/ventes pas terminees)
- `closed`: la session est terminee mais il reste au moins un lot `IN` non totalement solde
- `archived`: la session est terminee et tous les lots `IN` generes par la session sont soldes

## Regles de transition

- creation -> `open`
- `open` -> `closed` quand l'activite de production/entree est terminee
- `closed` -> `archived` quand le stock associe a la session est totalement ecoule

## Intention produit

- Une seule porte d'entree fonctionnelle cote UI: inventaire central
- Les operations d'achat/vente sont exposees via:
  - `POST /inventory/transactions`
