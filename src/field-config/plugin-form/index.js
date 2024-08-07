import { getCachedElement } from '../../common/plugin-helpers';
import { validFieldsCacheKey } from '../../common/valid-fields';

const insertSelectOptions = (config, options = []) => {
  config.options = options;
  config.additionalHelpTextClasses = 'break-normal';
};

export const handlePluginFormConfig = ({ name, config, formik }) => {
  const { index, type } =
    name.match(/buttons\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

  if (index == null || !type) return;
  const ctd = formik.values.buttons[index].content_type;
  const {
    sourceFields,
    cardTitleFields,
    cardImageFields,
    cardAdditionalFields,
  } = getCachedElement(validFieldsCacheKey);

  switch (type) {
    case 'content_type':
      config.onChange = (_, value) => {
        if (value == null) formik.setFieldValue(name, '');
        else formik.setFieldValue(name, value);

        formik.setFieldValue(`buttons[${index}].source`, '');
      };
      break;
    case 'source':
      insertSelectOptions(config, sourceFields?.[ctd]);
      break;
    case 'title':
      insertSelectOptions(config, cardTitleFields?.[ctd]);
      break;
    case 'image':
      insertSelectOptions(config, cardImageFields?.[ctd]);
      break;
    case 'additional_field_1':
    case 'additional_field_2':
    case 'additional_field_3':
      insertSelectOptions(config, cardAdditionalFields?.[ctd]);
      break;
  }
};
