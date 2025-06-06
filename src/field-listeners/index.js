import pluginInfo from '../plugin-manifest.json';

export const handleFormFieldListenrsAdd = ({ contentType, formik, name }) => {
  if (contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
    const { index, type } =
      name.match(/kanbanBoard\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index == null || !type) return;

    if (type === 'content_type') {
      return {
        onChange: () => {
          ['source', 'title', 'image', 'additional_fields'].forEach((key) => {
            formik.setFieldValue(`kanbanBoard[${index}].${key}`, '');
          });
        },
      };
    }
  }
};
