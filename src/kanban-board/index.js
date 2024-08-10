import ReactDOM from 'react-dom/client';
import { addElementToCache, getCachedElement } from '../common/plugin-helpers';
import KanbanContainer from './components/KanbanContainer';

const updateApp = (
  root,
  { client, pluginConfig, contentType, openModal, toast },
) => {
  root.render(
    <KanbanContainer
      client={client}
      pluginConfig={pluginConfig}
      contentType={contentType}
      openModal={openModal}
      toast={toast}
    />,
  );
};

const initApp = (div, data) => {
  const root = ReactDOM.createRoot(div);
  updateApp(root, data);
  return root;
};

export const handleBoardPlugin = (
  config,
  { contentType },
  client,
  openModal,
  toast,
) => {
  const pluginConfig = config[contentType?.name];

  if (!pluginConfig || !contentType) {
    return null;
  }

  const key = `${contentType.name}-${contentType.id}`;
  const cachedApp = getCachedElement(key);

  const data = { client, pluginConfig, contentType, openModal, toast };

  if (cachedApp) {
    updateApp(cachedApp.root, data);
    return cachedApp.element;
  }

  const div = document.createElement('div');
  addElementToCache(div, initApp(div, data), key);
  return div;
};
