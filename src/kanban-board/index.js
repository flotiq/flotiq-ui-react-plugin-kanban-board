import ReactDOM from 'react-dom/client';
import { addElementToCache, getCachedElement } from '../common/plugin-helpers';
import { parseOptions } from './helpers';
import KanbanContainer from './components/KanbanContainer';

const updateApp = (
  root,
  kanbanCols,
  contentObjects,
  selectedField,
  apiClient,
) => {
  root.render(
    <KanbanContainer
      kanbanColumns={kanbanCols}
      contentObjects={contentObjects}
      selectedField={selectedField}
      apiClient={apiClient}
    />,
  );
};

const initApp = (div, kanbanCols, contentObjects, selectedField, apiClient) => {
  const root = ReactDOM.createRoot(div);
  updateApp(root, kanbanCols, contentObjects, selectedField, apiClient);
  return root;
};

export const handleBoardPlugin = (
  config,
  { contentTypeName, contentType, contentObjects },
  pluginInfo,
  client,
) => {
  if (
    !config.contentTypes.includes(contentTypeName) ||
    !contentType ||
    !contentObjects ||
    contentObjects?.length === 0
  ) {
    return null;
  }

  const key = `${contentTypeName}-${contentType.id}`;
  const cachedApp = getCachedElement(key);

  const selectedField = config.settings[contentTypeName]?.source;
  const kanbanCols = parseOptions(contentType, selectedField);

  if (cachedApp) {
    updateApp(
      cachedApp.root,
      kanbanCols,
      contentObjects,
      selectedField,
      client[contentTypeName],
    );
    return cachedApp.element;
  }

  const div = document.createElement('div');
  addElementToCache(
    div,
    initApp(
      div,
      kanbanCols,
      contentObjects,
      selectedField,
      client[contentTypeName],
    ),
    key,
  );
  return div;
};
