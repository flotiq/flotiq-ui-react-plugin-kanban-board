import { getCachedElement } from '../../common/plugin-helpers';
import {
  validCardAdditionalFields,
  validCardTitleFields,
  validFieldsCacheKey,
  validSourceFields,
} from '../../common/valid-fields';
import i18n from '../../i18n';

const insertSelectOptions = (config, options = [], emptyOptionMessage) => {
  config.additionalHelpTextClasses = 'break-normal';

  if (options.length === 0) {
    config.options = [{ label: emptyOptionMessage, disabled: true }];
    return;
  }
  config.options = options;
};

export const handlePluginFormConfig = ({ name, config, formik }) => {
  const { index, type } =
    name.match(/kanbanBoard\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

  if (index == null || !type) return;
  const ctd = formik.values.kanbanBoard[index].content_type;
  const {
    sourceFields,
    cardTitleFields,
    cardImageFields,
    cardAdditionalFields,
  } = getCachedElement(validFieldsCacheKey);

  const keysToClearOnCtdChange = [
    'source',
    'title',
    'image',
    'additional_field_1',
    'additional_field_2',
    'additional_field_3',
  ];

  switch (type) {
    case 'content_type':
      config.onChange = (_, value) => {
        if (value == null) formik.setFieldValue(name, '');
        else formik.setFieldValue(name, value);

        keysToClearOnCtdChange.forEach((key) => {
          formik.setFieldValue(`kanbanBoard[${index}].${key}`, '');
        });
      };
      break;
    case 'source':
      insertSelectOptions(
        config,
        sourceFields?.[ctd],
        i18n.t('NonRequiredFieldsInCTD', {
          types: validSourceFields.join(', '),
        }),
      );
      break;
    case 'title':
      insertSelectOptions(
        config,
        cardTitleFields?.[ctd],
        i18n.t('NonRequiredFieldsInCTD', {
          types: validCardTitleFields.join(', '),
        }),
      );
      break;
    case 'image':
      insertSelectOptions(
        config,
        cardImageFields?.[ctd],
        i18n.t('NonRequiredFieldsInCTD', {
          types: ['Relation to media, media'],
        }),
      );
      break;
    case 'additional_field_1':
    case 'additional_field_2':
    case 'additional_field_3':
      insertSelectOptions(
        config,
        cardAdditionalFields?.[ctd],
        i18n.t('NonRequiredFieldsInCTD', {
          types: validCardAdditionalFields.join(', '),
        }),
      );
      break;
    default:
      break;
  }
};
