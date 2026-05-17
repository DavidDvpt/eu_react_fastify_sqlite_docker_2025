import { FormatTools } from "@/shared/tools/formatTools";
import { ImageService } from "@/shared/services/imageService";

const formatToFiveDecimals = FormatTools.formatToFiveDecimals;

const getItemImageUrl = ImageService.getItemImageUrl;

export { formatToFiveDecimals, getItemImageUrl };

export const MANAGE_TABS = ["category", "type", "item"] as const;
