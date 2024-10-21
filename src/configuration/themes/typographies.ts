const DEFAULT_FONT_FAMILY =
  (import.meta.env.VITE_DEFAULT_FONT_FAMILY as string) || '"DM Sans", Arial';

const modules = import.meta.glob("./**/typography.ts", { eager: true });

const allExports = {};

for (const path in modules) {
  if (path) {
    const themeName = (path.match(/\.\/(.*)\/typography\.ts$/) || [])[1];
    Object.assign(allExports, {
      [themeName]: (modules[path] as any).default(DEFAULT_FONT_FAMILY),
    });
  }
}

export default allExports;
