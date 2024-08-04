const appRoots = {};

export const addElementToCache = (element, root, key) => {
  appRoots[key] = {
    element,
    root,
  };

  element.addEventListener("flotiq.detached", () => {
    setTimeout(() => {
      return delete appRoots[key];
    }, 50);
  });
};

export const getCachedElement = (key) => {
  return appRoots[key];
};

export const registerFn = (pluginInfo, callback) => {
  if (window.FlotiqPlugins?.add) {
    window.FlotiqPlugins.add(pluginInfo, callback);
    return;
  }
  if (!window.initFlotiqPlugins) window.initFlotiqPlugins = [];
  window.initFlotiqPlugins.push({ pluginInfo, callback });
};
