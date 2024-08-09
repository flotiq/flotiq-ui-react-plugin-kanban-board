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
  contentDefinition,
  openModal,
  toast,
) => {
  root.render(
    <KanbanContainer
      kanbanColumns={kanbanCols}
      selectedField={selectedField}
      client={apiClient}
      pluginConfig={pluginConfig}
      contentDefinition={contentDefinition}
      openModal={openModal}
      toast={toast}
    />,
  );
};

const initApp = (
  div,
  kanbanCols,
  selectedField,
  apiClient,
  pluginConfig,
  contentDefinition,
  openModal,
  toast,
) => {
  const root = ReactDOM.createRoot(div);
  updateApp(
    root,
    kanbanCols,
    selectedField,
    apiClient,
    pluginConfig,
    contentDefinition,
    openModal,
    toast,
  );
  return root;
};

export const handleBoardPlugin = (
  config,
  { contentTypeName, contentType },
  pluginInfo,
  client,
  getApiUrl,
  openModal,
  toast,
) => {
  if (!config.contentTypes?.includes(contentTypeName) || !contentType) {
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
      contentType,
      openModal,
      toast,
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
      contentType,
      openModal,
      toast,
    ),
    key,
  );
  return div;
};
