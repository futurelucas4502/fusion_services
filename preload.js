// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// Start making ipc safe

const { contextBridge, ipcRenderer } = require('electron');

function callIpcRenderer(method, channel, ...args) {
  if (typeof channel !== 'string') {
    throw 'Error: IPC channel name not allowed';
  }
  if (['invoke', 'send'].includes(method)) {
    return ipcRenderer[method](channel, ...args);
  }
  if ('on' === method) {
    const listener = args[0];
    if (!listener) throw 'Listener must be provided';

    // Wrap the given listener in a new function to avoid exposing
    // the `event` arg to our renderer.
    const wrappedListener = (_event, ...a) => listener(...a);
    ipcRenderer.on(channel, wrappedListener);

    // The returned function must not return anything (and NOT
    // return the value from `removeListener()`) to avoid exposing ipcRenderer.
    return () => { ipcRenderer.removeListener(channel, wrappedListener); };
  }
}

contextBridge.exposeInMainWorld(
  'ipcRenderer', {
  invoke: (...args) => callIpcRenderer('invoke', ...args),
  send: (...args) => callIpcRenderer('send', ...args),
  on: (...args) => callIpcRenderer('on', ...args),
}
);

// End making ipc safe