const NativeWebSocket = window.WebSocket;

window.WebSocket = class {
  constructor(url, protocols) {
    const ws = protocols ? new NativeWebSocket(url, protocols) : new NativeWebSocket(url);

    console.log('[ws] create', url);

    ws.addEventListener('open', (e) => console.log('[ws] open', e));
    ws.addEventListener('message', (e) => console.log('[ws] message', e.data));
    ws.addEventListener('error', (e) => console.log('[ws] error', e));
    ws.addEventListener('close', (e) => console.log('[ws] close', e.code, e.reason));

    const send = ws.send.bind(ws);
    ws.send = (data) => {
      console.log('[ws] send', data);
      return send(data);
    };

    return ws;
  }
};

window.WebSocket.prototype = NativeWebSocket.prototype;
