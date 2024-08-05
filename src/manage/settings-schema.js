import i18n from '../i18n';
import pluginInfo from '../plugin-manifest.json';

export const getSchema = (contentTypes) => ({
  id: pluginInfo.id,
  name: pluginInfo.id,
  label: pluginInfo.name,
  internal: false,
  schemaDefinition: {
    type: 'object',
    allOf: [
      {
        $ref: '#/components/schemas/AbstractContentTypeSchemaDefinition',
      },
      {
        type: 'object',
        properties: {
          buttons: {
            type: 'array',
            items: {
              type: 'object',
              required: ['content_type', 'source', 'card_fields'],
              properties: {
                source: {
                  type: 'string',
                  minLength: 1,
                },
                content_type: {
                  type: 'string',
                  minLength: 1,
                },
                card_fields: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    ],
    required: ['api_key'],
    additionalProperties: false,
  },
  metaDefinition: {
    order: ['buttons'],
    propertiesConfig: {
      buttons: {
        items: {
          order: ['content_type', 'source', 'card_fields'],
          propertiesConfig: {
            source: {
              label: i18n.t('Source'),
              unique: false,
              helpText: i18n.t('SourceHelpText'),
              inputType: 'select',
              options: [],
            },
            card_fields: {
              label: 'Card field',
              unique: false,
              helpText: i18n.t('SourceHelpText'),
              inputType: 'select',
              options: [],
              multiple: true,
            },
            content_type: {
              label: i18n.t('ContentType'),
              unique: false,
              helpText: '',
              inputType: 'select',
              optionsWithLabels: contentTypes,
              useOptionsWithLabels: true,
            },
          },
        },
        label: i18n.t('Configure'),
        unique: false,
        helpText: '',
        inputType: 'object',
      },
    },
  },
});

const addToErrors = (errors, index, field, error) => {
  if (!errors.buttons) errors.buttons = [];
  if (!errors.buttons[index]) errors.buttons[index] = {};
  errors.buttons[index][field] = error;
};

export const getValidator = (sourceFieldKeys) => {
  return (values) => {
    const errors = {};

    values.buttons?.forEach(({ content_type, source, card_fields }, index) => {
      if (!content_type) {
        addToErrors(errors, index, 'content_type', i18n.t('FieldRequired'));
      }

      if (!source) {
        addToErrors(errors, index, 'source', i18n.t('FieldRequired'));
      } else if (!(sourceFieldKeys[content_type] || []).includes(source)) {
        addToErrors(errors, index, 'source', i18n.t('WrongSource'));
      }

      // if (!card_fields) {
      //   addToErrors(errors, index, "card_fields", i18n.t("FieldRequired"));
      // } else if (true) {
      //   addToErrors(errors, index, "card_fields", i18n.t("WrongSource"));
      // }
    });

    return errors;
  };
};
