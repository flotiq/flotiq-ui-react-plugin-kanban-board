import i18n from '../i18n';
import pluginInfo from '../plugin-manifest.json';
import {
  validCardAdditionalFields,
  validCardTitleFields,
  validSourceFields,
} from '../common/valid-fields';

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
              required: ['content_type', 'source', 'title'],
              properties: {
                source: {
                  type: 'string',
                  minLength: 1,
                },
                content_type: {
                  type: 'string',
                  minLength: 1,
                },
                title: {
                  type: 'string',
                  minLength: 1,
                },
                image: {
                  type: 'string',
                  minLength: 1,
                },
                additional_field_1: {
                  type: 'string',
                  minLength: 1,
                },
                additional_field_2: {
                  type: 'string',
                  minLength: 1,
                },
                additional_field_3: {
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
          order: [
            'content_type',
            'source',
            'title',
            'image',
            'additional_field_1',
            'additional_field_2',
            'additional_field_3',
          ],
          propertiesConfig: {
            source: {
              label: i18n.t('Source'),
              unique: false,
              helpText: i18n.t('SourceHelpText', {
                types: validSourceFields.join(', '),
              }),
              inputType: 'select',
              options: [],
            },
            content_type: {
              label: i18n.t('ContentType'),
              unique: false,
              helpText: i18n.t('ContentTypeHelpText'),
              inputType: 'select',
              optionsWithLabels: contentTypes,
              useOptionsWithLabels: true,
            },
            title: {
              label: i18n.t('Title'),
              unique: false,
              helpText: i18n.t('TitleHelpText', {
                types: validCardTitleFields.join(', '),
              }),
              inputType: 'select',
              options: [],
            },
            image: {
              label: i18n.t('Image'),
              unique: false,
              helpText: i18n.t('ImageHelpText', {
                types: ['Relation to media, media'],
              }),
              inputType: 'select',
              options: [],
            },
            additional_field_1: {
              label: i18n.t('AdditionalField1'),
              unique: false,
              helpText: i18n.t('AdditionalFieldHelpText', {
                types: validCardAdditionalFields.join(', '),
              }),
              inputType: 'select',
              options: [],
            },
            additional_field_2: {
              label: i18n.t('AdditionalField2'),
              unique: false,
              helpText: i18n.t('AdditionalFieldHelpText', {
                types: validCardAdditionalFields.join(', '),
              }),
              inputType: 'select',
              options: [],
            },
            additional_field_3: {
              label: i18n.t('AdditionalField3'),
              unique: false,
              helpText: i18n.t('AdditionalFieldHelpText', {
                types: validCardAdditionalFields.join(', '),
              }),
              inputType: 'select',
              options: [],
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

export const getValidator = (
  sourceFieldKeys,
  cardTitleFieldsKeys,
  cardImageFieldsKeys,
  cardAdditionalFieldsKeys,
) => {
  return (values) => {
    const errors = {};
    values.buttons?.forEach(
      (
        {
          content_type,
          source,
          card_fields,
          title,
          image,
          additional_field_1,
          additional_field_2,
          additional_field_3,
        },
        index,
      ) => {
        if (!content_type) {
          addToErrors(errors, index, 'content_type', i18n.t('FieldRequired'));
        }

        if (!source) {
          addToErrors(errors, index, 'source', '');
        } else if (!(sourceFieldKeys[content_type] || []).includes(source)) {
          addToErrors(errors, index, 'source', '');
        }

        if (!title) {
          addToErrors(errors, index, 'title', i18n.t('FieldRequired'));
        } else if (!(cardTitleFieldsKeys[content_type] || []).includes(title)) {
          addToErrors(errors, index, 'title', i18n.t('WrongSource'));
        }

        if (
          image &&
          !(cardImageFieldsKeys[content_type] || []).includes(image)
        ) {
          addToErrors(errors, index, 'image', i18n.t('WrongSource'));
        }

        if (
          additional_field_1 &&
          !(
            (additional_field_1 && cardAdditionalFieldsKeys[content_type]) ||
            []
          ).includes(additional_field_1)
        ) {
          addToErrors(
            errors,
            index,
            'additional_field_1',
            i18n.t('WrongSource'),
          );
        }

        if (
          additional_field_2 &&
          !(cardAdditionalFieldsKeys[content_type] || []).includes(
            additional_field_2,
          )
        ) {
          addToErrors(
            errors,
            index,
            'additional_field_2',
            i18n.t('WrongSource'),
          );
        }

        if (
          additional_field_3 &&
          !(cardAdditionalFieldsKeys[content_type] || []).includes(
            additional_field_3,
          )
        ) {
          addToErrors(
            errors,
            index,
            'additional_field_3',
            i18n.t('WrongSource'),
          );
        }
      },
    );

    return errors;
  };
};
