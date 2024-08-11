import { getValidFields, validFieldsCacheKey } from '../common/valid-fields';
import {
  addObjectToCache,
  getCachedElement,
  removeRoot,
} from '../common/plugin-helpers';
import { getSchema, getValidator } from './settings-schema';
import pluginInfo from '../plugin-manifest.json';

export const handleManagePlugin = ({ contentTypes, modalInstance }) => {
  const formSchemaCacheKey = `${pluginInfo.id}-form-schema`;
  let formSchema = getCachedElement(formSchemaCacheKey);

  if (!formSchema) {
    const validFields = getValidFields(contentTypes);
    addObjectToCache(validFieldsCacheKey, validFields);

    const ctds = contentTypes
      ?.filter(({ internal }) => !internal)
      ?.map(({ name, label }) => ({ value: name, label }));

    const {
      sourceFieldsKeys,
      cardTitleFieldsKeys,
      cardImageFieldsKeys,
      cardAdditionalFieldsKeys,
    } = validFields;

    formSchema = {
      options: {
        disbaledBuildInValidation: true,
        onValidate: getValidator(
          sourceFieldsKeys,
          cardTitleFieldsKeys,
          cardImageFieldsKeys,
          cardAdditionalFieldsKeys,
        ),
      },
      schema: getSchema(ctds),
    };
  }

  modalInstance.promise.then(() => removeRoot(formSchemaCacheKey));

  return formSchema;
};
