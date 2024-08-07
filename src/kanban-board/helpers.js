export const parsePluginSettings = (settings) => {
  const parsedSettings = JSON.parse(settings || '{}');
  settings = {};

  const contentTypes = parsedSettings?.buttons.map((element) => {
    settings[element.content_type] = element;
    return element.content_type;
  });

  return {
    contentTypes: contentTypes,
    settings: settings,
  };
};

export const parseOptions = (contentDefinition, selectedField) => {
  return contentDefinition?.metaDefinition?.propertiesConfig?.[selectedField]
    .options;
};

export const extractFieldType = ({ metaDefinition }, propertyKey) => {
  const fieldType = metaDefinition?.propertiesConfig[propertyKey]?.inputType;
  if (!fieldType) return {};
  return { key: propertyKey, type: fieldType };
};
