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
    config.options = [
      { value: 'empty', label: emptyOptionMessage, disabled: true },
    ];
    return;
  }
  config.options = options;
};

export const handlePluginFormConfig = ({ name, config, form }) => {
  const { index, type } =
    name.match(/kanbanBoard\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

  if (index == null || !type) return;
  const ctd = form.getValue(`kanbanBoard[${index}].content_type`);

  console.log(ctd);

  const {
    sourceFields,
    cardTitleFields,
    cardImageFields,
    cardAdditionalFields,
  } = getCachedElement(validFieldsCacheKey);

  switch (type) {
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
    case 'additional_fields':
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
