export const parsePluginSettings = (settings) => {
  const parsedSettings = JSON.parse(settings || '{}');

  return (parsedSettings?.kanbanBoard || []).reduce((settings, element) => {
    settings[element.content_type] = element;
    return settings;
  }, {});
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
