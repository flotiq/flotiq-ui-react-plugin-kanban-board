import { getCachedElement } from '../../common/plugin-helpers';
import { validFieldsCacheKey } from '../../common/valid-fields';

export const handlePluginFormConfig = ({ name, config, formik }) => {
  const { index, type } =
    name.match(/buttons\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

  if (index == null || !type) return;

  if (type === 'content_type') {
    config.onChange = (_, value) => {
      if (value == null) formik.setFieldValue(name, '');
      else formik.setFieldValue(name, value);

      formik.setFieldValue(`buttons[${index}].source`, '');
    };
  } else if (type === 'source') {
    const { sourceFields } = getCachedElement(validFieldsCacheKey);

    const ctd = formik.values.buttons[index].content_type;

    config.options = sourceFields?.[ctd] || [];
    config.additionalHelpTextClasses = 'break-normal';
  } else if (type === 'card_field') {
    const { cardFields } = getCachedElement(validFieldsCacheKey);
    const ctd = formik.values.buttons[index].content_type;

    config.options = cardFields?.[ctd] || [];
    console.log(config);

    config.additionalHelpTextClasses = 'break-normal';
  }
};
