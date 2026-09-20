import { FormatTools } from "@/shared/tools/formatTools";
import { getItemImageUrl } from "@/shared/helpers/imageUrl";

const formatToFiveDecimals = FormatTools.formatToFiveDecimals;

export { formatToFiveDecimals, getItemImageUrl };

export const MANAGE_TABS = ["category", "type", "item"] as const;
