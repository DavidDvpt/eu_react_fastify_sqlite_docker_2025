import type {
  Category,
  CategoryApi,
  Categories,
  CategoryApis,
} from "@/shared/types";

async function parseCategory(data: CategoryApi): Promise<Category> {
  try {
    if (!data) throw new Error("No category data found");
    if (typeof data !== "object") throw new Error("Invalid category payload");

    if (!("id" in data) || typeof data.id !== "string" || !data.id.trim()) {
      throw new Error("No valid category id found");
    }

    if (
      !("name" in data) ||
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      throw new Error("No valid category name found");
    }

    if (!("is_active" in data) || typeof data.is_active !== "boolean") {
      throw new Error("No valid category is_active found");
    }

    if (
      !("date_created" in data) ||
      typeof data.date_created !== "string" ||
      !data.date_created.trim()
    ) {
      throw new Error("No valid category date_created found");
    }

    if (
      "user_id" in data &&
      data.user_id !== undefined &&
      data.user_id !== null &&
      typeof data.user_id !== "string"
    ) {
      throw new Error("Invalid category user_id found");
    }

    if (
      "date_updated" in data &&
      data.date_updated !== undefined &&
      data.date_updated !== null &&
      typeof data.date_updated !== "string"
    ) {
      throw new Error("Invalid category date_updated found");
    }

    return {
      id: data.id,
      name: data.name,
      isActive: data.is_active,
      userId: data.user_id ?? null,
      createdAt: data.date_created,
      updatedAt: data.date_updated ?? null,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

async function parseCategories(data: CategoryApis): Promise<Categories> {
  try {
    if (!Array.isArray(data))
      throw new Error("Categories payload is not an array");

    const parsed = await Promise.all(data.map((item) => parseCategory(item)));
    return parsed;
  } catch (error) {
    return Promise.reject(error);
  }
}

export { parseCategories, parseCategory };
