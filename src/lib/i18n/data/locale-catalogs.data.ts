import zhCNMessages from "@/locales/zh-CN.json";
import enUSMessages from "@/locales/en-US.json";

export const localeCatalogs = {
  "zh-CN": zhCNMessages,
  "en-US": enUSMessages,
} as const;

export const supportedLocales = Object.keys(localeCatalogs) as (keyof typeof localeCatalogs)[];
