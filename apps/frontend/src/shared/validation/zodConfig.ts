import { z } from "zod";

z.config({
  customError: (issue) => {
    if (issue.code === "invalid_type" && issue.input === undefined) {
      return "Ce champ est obligatoire";
    }

    if (issue.code === "too_small" && issue.origin === "string") {
      return `Ce champ doit contenir au moins ${issue.minimum} caractères`;
    }

    if (issue.code === "too_big" && issue.origin === "string") {
      return `Ce champ doit contenir au maximum ${issue.maximum} caractères`;
    }

    if (issue.code === "invalid_format" && issue.format === "email") {
      return "Email invalide";
    }

    return undefined;
  },
});
