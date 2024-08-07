import { registerFn } from './common/plugin-helpers';
import pluginInfo from './plugin-manifest.json';
import { parsePluginSettings } from './kanban-board/helpers';
import { handlePluginFormConfig } from './field-config/plugin-form';
import { handleManagePlugin } from './manage';
import { handleBoardPlugin } from './kanban-board';

import cssString from './styles/style.css';

const loadStyles = () => {
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement('style');
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }
};

registerFn(
  pluginInfo,
  (handler, client, { getPluginSettings, getLanguage, getApiUrl }) => {
    loadStyles();

    handler.on('flotiq.plugins.manage::form-schema', (data) =>
      handleManagePlugin(data),
    );

    handler.on('flotiq.form.field::config', (data) => {
      if (
        data.contentType?.id === pluginInfo.id &&
        data.contentType?.nonCtdSchema &&
        data.name
      ) {
        return handlePluginFormConfig(data);
      }
    });

    handler.on('flotiq.content-objects-view::render', (data) => {
      const pluginSettings = parsePluginSettings(getPluginSettings());

      return handleBoardPlugin(
        pluginSettings,
        data,
        pluginInfo,
        client,
        getApiUrl,
      );
    });
  },
);
