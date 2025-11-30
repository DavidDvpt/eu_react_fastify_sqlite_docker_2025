// Auto-generated from datas.sql
import type { Prisma } from "../generated/client.js";

export const USER: Prisma.userCreateManyInput[] = [
  {
    "id": "0FB0E33F-424C-4A2A-A135-FFF8A2D81E5E",
    "firstname": "Lucien",
    "lastname": "User",
    "pseudo": "user",
    "password_hash": "$2a$11$Z/SxhvNHo6VZ0IKE/0LRvOdkWThfK9qW02iEADsZQf4.IIR5h4KCS",
    "role": "USER",
    "date_created": "2025-11-23 10:59:01.126532",
    "date_updated": null,
    "is_active": true
  },
  {
    "id": "1947DAFD-0CA4-4673-8F25-EB4702265ACA",
    "firstname": "David",
    "lastname": "Admin",
    "pseudo": "admin",
    "password_hash": "$2a$11$6EnsdZSI5GwnHFL0yly6KeTnqsQa.XKJaqAEjXiGIPqYMB57Yez.a",
    "role": "ADMIN",
    "date_created": "2025-11-23 10:59:01.1264783",
    "date_updated": null,
    "is_active": true
  }
] as const;
