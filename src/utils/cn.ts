type ClassValue = string | false | null | undefined;

/**
 * 最轻量的 className 拼接工具。
 *
 * 作用：
 * - 过滤掉 false / null / undefined
 * - 适合当前模板阶段的基础字符串拼接
 *
 * 建议：
 * 如果以后需要处理 Tailwind 冲突合并，再考虑升级为 clsx + tailwind-merge。
 */
export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}
