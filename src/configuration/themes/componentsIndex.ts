const modules = import.meta.glob("./**/components/*.ts", { eager: true });

const allExports = {} as {
  [key: string]: {
    [key: string]: any;
  };
};

for (const path in modules) {
  if (path) {
    const themeName = (path.match(/\/([^\/]*)\/components\//) || [])[1];
    const componentName = (path.match(/\/components\/(.*)\.ts$/) || [])[1];

    Object.assign(allExports, {
      [themeName]: {
        ...(allExports[themeName] || {}),
        [componentName]: modules[path] as any,
      },
    });
  }
}

export default allExports;
