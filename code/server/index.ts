import WorshipMgr from './worshipMgr';
import PlayerMgr from './playerMgr';
import { WebSocketServer, WebSocket } from 'ws';
const PORT = 12345;
const wss = new WebSocketServer({ port: PORT });
global.worshipMgr = new WorshipMgr();
global.playerMgr = new PlayerMgr();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log(`Received message from client', ${data}`);
    let message = JSON.parse(data.toString());
    let response: Response = {
      msgType: '',
      data: {},
    };
    try {
      let groupId = message.data.groupId;
      let playerId = message.data.playerId;
      if (message) {
        switch (message.msgType) {
          case 'join':
            let players = global.worshipMgr.join(groupId, playerId, ws);
            // response to player
            response = {
              msgType: 'joinRes',
              data: { players: players },
            };
            ws.send(toBuffer(response));

            // notify all player
            let player = global.playerMgr.getPlayerById(playerId);
            if (player) {
              response = {
                msgType: 'joinNotify',
                data: global.playerMgr.getPlayerById(playerId),
              };
            }
            break;
          case 'quit':
            let worship = global.worshipMgr.worships.get(groupId);
            if (worship) {
              let player = global.playerMgr.getPlayerById(playerId);
              if (!worship.players.has(player)) {
                throw Error('not in this worship');
              }
              worship.quit(player);
              response = {
                msgType: 'quitRes',
                data: player.id,
              };
            }
            break;
          case 'moveTo':
            let worshipM = global.worshipMgr.worships.get(groupId);
            if (worshipM) {
              let player = global.playerMgr.getPlayerById(playerId);
              if (!worshipM.players.has(player)) {
                throw Error('not in this worship');
              }
              worshipM.moveTo(playerId, {
                X: message.data.x,
                Y: message.data.y,
              });
              response = {
                msgType: 'moveTo',
                data: player,
              };
            }
            break;
          default:
            throw Error('wrong request');
        }
        // retBuf = Buffer.from(JSON.stringify(response));
      } else {
        throw Error('message is empty');
      }
      // console.log("groupId", groupId)
      let worship = global.worshipMgr.worships.get(groupId);
      if (worship) {
        let players = worship.players;
        let clients: WebSocket[] = [];
        for (var value of players.values()) {
          clients.push(value);
        }
        broadcast(toBuffer(response), clients);
      }
    } catch (err) {
      response.errMsg = err.message;
      ws.send(toBuffer(response));
    }
  });
});

function toBuffer(obj: Object): Buffer {
  return Buffer.from(JSON.stringify(obj));
}

function broadcast(buf: Buffer, clients: WebSocket[]) {
  // console.log('broadcast');
  clients.forEach((item) => {
    item.send(buf);
  });
}

type Response = {
  msgType: string;
  data: Object;
  errMsg?: String;
};

console.log(`Listening at ${PORT}`);
