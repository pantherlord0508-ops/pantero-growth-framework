import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, intelligently resolving conflicts.
 *
 * Combines {@link https://github.com/lukeed/clsx | clsx} for conditional class
 * construction with {@link https://github.com/dcastil/tailwind-merge | tailwind-merge}
 * so that later utility classes override earlier ones when they target the same
 * CSS property.
 *
 * @param inputs - Any number of class values (strings, arrays, objects, or
 *   `undefined`/`false` entries accepted by `clsx`).
 * @returns A single merged class string with Tailwind conflicts resolved.
 *
 * @example
 * ```ts
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-6");
 * // => "py-2 bg-blue-500 px-6"   (px-6 overrides px-4)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
