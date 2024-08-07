import ReactDOM from 'react-dom/client';
import { addElementToCache, getCachedElement } from '../common/plugin-helpers';
import { parseOptions } from './helpers';
import KanbanContainer from './components/KanbanContainer';

const updateApp = (
  root,
  kanbanCols,
  selectedField,
  apiClient,
  pluginConfig,
) => {
  root.render(
    <KanbanContainer
      kanbanColumns={kanbanCols}
      selectedField={selectedField}
      client={apiClient}
      pluginConfig={pluginConfig}
    />,
  );
};

const initApp = (div, kanbanCols, selectedField, apiClient, pluginConfig) => {
  const root = ReactDOM.createRoot(div);
  updateApp(root, kanbanCols, selectedField, apiClient, pluginConfig);
  return root;
};

export const handleBoardPlugin = (
  config,
  { contentTypeName, contentType },
  pluginInfo,
  client,
  getApiUrl,
) => {
  if (!config.contentTypes.includes(contentTypeName) || !contentType) {
    return null;
  }

  const key = `${contentTypeName}-${contentType.id}`;
  const cachedApp = getCachedElement(key);

  const pluginConfig = config.settings[contentTypeName];
  const selectedField = pluginConfig?.source;
  const kanbanCols = parseOptions(contentType, selectedField);

  if (cachedApp) {
    updateApp(
      cachedApp.root,
      kanbanCols,
      selectedField,
      {
        apiClient: client[contentTypeName],
        getApiUrl: getApiUrl,
      },
      pluginConfig,
    );
    return cachedApp.element;
  }

  const div = document.createElement('div');
  addElementToCache(
    div,
    initApp(
      div,
      kanbanCols,
      selectedField,
      {
        apiClient: client[contentTypeName],
        getApiUrl: getApiUrl,
      },
      pluginConfig,
    ),
    key,
  );
  return div;
};
