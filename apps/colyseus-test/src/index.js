import { Client } from '@colyseus/sdk';

console.log(typeof fetch);
console.log(typeof Headers);
console.log(typeof WebSocket);

// ---- Global State ----
let client = null;
let room = null;

// ---- DOM Elements ----
const $ = (id) => document.getElementById(id);

const elServerUrl = $('serverUrl');
const elRoomName = $('roomName');
const elToken = $('token');
const elMsgType = $('msgType');
const elMsgPayload = $('msgPayload');
const elLogArea = $('logArea');
const elStatusDot = $('statusDot');
const elStatusText = $('statusText');
const elRoomBadge = $('roomBadge');

const btnConnect = $('btnConnect');
const btnDisconnect = $('btnDisconnect');
const btnJoin = $('btnJoin');
const btnLeave = $('btnLeave');
const btnSend = $('btnSend');

// ---- Logger ----
function timestamp() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

function addLog(message, tag = 'info') {
  const entry = document.createElement('div');
  entry.className = `log-entry ${tag}`;
  entry.textContent = `[${timestamp()}] ${message}`;
  elLogArea.appendChild(entry);
  elLogArea.scrollTop = elLogArea.scrollHeight;
}

// ---- UI State ----
function setConnectionState(connected) {
  if (connected) {
    elStatusDot.className = 'status-dot connected';
    elStatusText.textContent = '已连接';
    btnConnect.disabled = true;
    btnDisconnect.disabled = false;
    btnJoin.disabled = false;
  } else {
    elStatusDot.className = 'status-dot disconnected';
    elStatusText.textContent = '未连接';
    btnConnect.disabled = false;
    btnDisconnect.disabled = true;
    btnJoin.disabled = true;
  }
}

function setRoomState(joined, roomName) {
  if (joined) {
    elRoomBadge.innerHTML = `<span class="badge badge-success">房间: ${roomName}</span>`;
    btnJoin.disabled = true;
    btnLeave.disabled = false;
    btnSend.disabled = false;
  } else {
    elRoomBadge.innerHTML = '';
    btnJoin.disabled = !client;
    btnLeave.disabled = true;
    btnSend.disabled = true;
  }
}

// ---- Actions ----
async function doConnect() {
  const url = elServerUrl.value.trim();
  if (!url) {
    addLog('请输入服务器地址', 'error');
    return;
  }

  try {
    addLog(`正在连接到 ${url} ...`, 'info');
    client = new Client(url);
    setConnectionState(true);
    addLog(`已成功连接到 ${url}`, 'success');
  } catch (err) {
    addLog(`连接失败: ${err.message}`, 'error');
  }
}

function doDisconnect() {
  if (room) {
    room.leave();
    room = null;
  }
  setRoomState(false);

  if (client) {
    client = null;
    setConnectionState(false);
    addLog('已断开连接', 'system');
  }
}

async function doJoinRoom() {
  if (!client) {
    addLog('请先连接服务器', 'error');
    return;
  }
  const roomName = elRoomName.value.trim();
  if (!roomName) {
    addLog('请输入房间名称', 'error');
    return;
  }
  const token = elToken.value.trim();
  if (!token) {
    addLog('请输入Token', 'error');
    return;
  }

  try {
    addLog(`正在加入房间 "${roomName}" ...`, 'info');
    const option = {
      token,
      name: 'test',
      password: '',
      timeoutSeconds: 20,
    };
    addLog(`准备加入房间 "${roomName}"，${JSON.stringify(option)}`, 'info');

    room = await client.joinOrCreate(roomName, option);

    addLog(`已加入房间 "${roomName}"，sessionId: ${room.sessionId}`, 'success');
    setRoomState(true, roomName);

    // 监听服务端消息
    room.onMessage('*', (type, message) => {
      addLog(`[收到] ${type}: ${JSON.stringify(message)}`, 'receive');
    });

    // 监听状态变化
    room.onStateChange((state) => {
      addLog(`[状态更新] ${JSON.stringify(state)}`, 'receive');
    });

    // 监听错误
    room.onError((code, message) => {
      addLog(`[错误] code=${code}: ${message}`, 'error');
    });

    // 监听离开
    room.onLeave((code) => {
      addLog(`[离开房间] code=${code}`, 'system');
      room = null;
      setRoomState(false);
    });
  } catch (err) {
    addLog(`加入房间失败: ${err.message}`, 'error');
  }
}

function doLeaveRoom() {
  if (!room) return;
  const roomName = room.name;
  room.leave();
  room = null;
  setRoomState(false);
  addLog(`已离开房间 "${roomName}"`, 'system');
}

function doSendMessage() {
  if (!room) {
    addLog('请先加入房间', 'error');
    return;
  }

  const type = elMsgType.value;
  let payload;

  try {
    payload = JSON.parse(elMsgPayload.value.trim() || '{}');
  } catch {
    addLog('消息内容不是合法的 JSON', 'error');
    return;
  }

  room.send(type, payload);
  addLog(`[发送] ${type}: ${JSON.stringify(payload)}`, 'send');
}

function doClearLogs() {
  elLogArea.innerHTML = '';
}

// ---- Expose to global scope for HTML onclick handlers ----
globalThis.doConnect = doConnect;
globalThis.doDisconnect = doDisconnect;
globalThis.doJoinRoom = doJoinRoom;
globalThis.doLeaveRoom = doLeaveRoom;
globalThis.doSendMessage = doSendMessage;
globalThis.doClearLogs = doClearLogs;

// ---- Init ----
addLog('Colyseus 测试客户端已就绪', 'system');
addLog(`默认服务器: ${elServerUrl.value}`, 'info');
addLog(`默认房间: ${elRoomName.value}`, 'info');
