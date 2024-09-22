import locales from "@/lang/locales";
import { z } from "zod";

const localeSchema = z.enum(locales);

export default localeSchema;
