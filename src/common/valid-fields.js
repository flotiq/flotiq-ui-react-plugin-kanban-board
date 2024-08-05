import pluginInfo from "../plugin-manifest.json";

//@todo check if we can use radio
export const validSourceFields = ["select", "radio"];
export const validCardFields = ["text", "number", "select", "date"];

export const getValidFields = (contentTypes) => {
    const sourceFields = {};
    const sourceFieldsKeys = {};

    const cardFields = {};
    const cardFieldsKeys = {};

    contentTypes
        ?.filter(({ internal }) => !internal)
        .map(({ name, label }) => ({ value: name, label }));

    (contentTypes || []).forEach(({ name, metaDefinition }) => {
        sourceFields[name] = [];
        sourceFieldsKeys[name] = [];

        cardFields[name] = [];
        cardFieldsKeys[name] = [];

        Object.entries(metaDefinition?.propertiesConfig || {}).forEach(
            ([key, fieldConfig]) => {
                const inputType = fieldConfig?.inputType;

                if (validSourceFields.includes(inputType)) {
                    sourceFields[name].push({ value: key, label: fieldConfig.label });
                    sourceFieldsKeys[name].push(key);
                }

                if (validCardFields.includes(inputType)) {
                    cardFields[name].push({ value: key, label: fieldConfig.label });
                    cardFieldsKeys[name].push(key);
                }
            },
        );
    });

    return { sourceFields, sourceFieldsKeys, cardFields, cardFieldsKeys };
};

export const validFieldsCacheKey = `${pluginInfo.id}-form-valid-fields`;
