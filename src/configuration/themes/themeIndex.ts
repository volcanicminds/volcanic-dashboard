const modules = import.meta.glob("./**/baseTheme.ts", { eager: true });

const allExports = {};

for (const path in modules) {
  if (path) {
    const themeName = (path.match(/\.\/(.*)\/baseTheme\.ts$/) || [])[1];
    Object.assign(allExports, {
      [themeName]: modules[path] as any,
    });
  }
}

export default allExports;
