import { PUSH_MESSAGE, READ_ROOM, READ_CHANNEL, SEND_MESSAGE } from '../actionTypes';
import { CHANNELS } from '../../channels';

const initialState = {
  rooms: {},
  timeline: [],
  roomId: null,
  channelId: CHANNELS.ALL,
  unread: 0,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PUSH_MESSAGE: {
      let message = action.payload;

      let isUnread = state.roomId != message.roomId ||
        state.channelId != message.channelId &&
        state.channelId != CHANNELS.ALL;

      return {
        ...state,
        rooms: {
          ...state.rooms,
          [message.roomId]: {
            roomId: message.roomId,
            messages: [
              ...(state.rooms[message.roomId] ? state.rooms[message.roomId].messages : []),
              {
                channelId: message.channelId,
                body: message.body,
                ts: message.ts,
                autor: message.autor || message.roomId,
              },
            ],
            lastMessage: {
              channelId: message.channelId,
              body: message.body,
              ts: message.ts,
              autor: message.autor || message.roomId,
            },
            unread: {
              [CHANNELS.VK]: 0,
              [CHANNELS.OK]: 0,
              [CHANNELS.FB]: 0,
              ...(state.rooms[message.roomId] ? state.rooms[message.roomId].unread : {}),
              [message.channelId]: (state.rooms[message.roomId] ? state.rooms[message.roomId].unread[message.channelId] : 0) + (+isUnread),
              [CHANNELS.ALL]: (state.rooms[message.roomId] ? state.rooms[message.roomId].unread[CHANNELS.ALL] : 0) + (+isUnread),
            },
          },
        },
        timeline: [
          ...(state.roomId != null && state.roomId != message.roomId ? [state.roomId] : []),
          message.roomId,
          ...state.timeline.filter(roomId => roomId != state.roomId && roomId != message.roomId),
        ],
        unread: state.unread + (+isUnread),
      };
    }
    case READ_ROOM: {
      const { roomId } = action.payload;

      return {
        ...state,
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...state.rooms[roomId],
            unread: {
              ...state.rooms[roomId].unread,
              [state.channelId]: 0,
              [CHANNELS.ALL]: state.rooms[roomId].unread[CHANNELS.ALL] - state.rooms[roomId].unread[state.channelId],
              ...(state.channelId == CHANNELS.ALL ? {
                [CHANNELS.VK]: 0,
                [CHANNELS.FB]: 0,
                [CHANNELS.OK]: 0,
              } : {}),
            },
          },
        },
        timeline: [
          roomId,
          ...state.timeline.filter(checkRoomId => checkRoomId != roomId),
        ],
        roomId: roomId,
        unread: state.unread - state.rooms[roomId].unread[state.channelId],
      };
    }
    case READ_CHANNEL: {
      const { channelId } = action.payload;

      return {
        ...state,
        rooms: {
          ...state.rooms,
          ...(
            state.roomId != null ?
              {
                [state.roomId]: {
                  ...state.rooms[state.roomId],
                  unread: {
                    ...state.rooms[state.roomId].unread,
                    [channelId]: 0,
                    [CHANNELS.ALL]: state.rooms[state.roomId].unread[CHANNELS.ALL] - state.rooms[state.roomId].unread[channelId],
                  },
                },
              }
              : {}
          ),

        },
        channelId: channelId,
        unread: state.unread - (state.roomId != null ? state.rooms[state.roomId].unread[channelId] : 0),
      };
    }
    case SEND_MESSAGE: {
      const { message } = action.payload;

      return {
        ...state,
        rooms: {
          ...state.rooms,
          [state.roomId]: {
            ...state.rooms[state.roomId],
            messages: [
              ...state.rooms[state.roomId].messages,
              {
                autor: 'Me',
                channelId: state.channelId === CHANNELS.ALL ? state.rooms[state.roomId].lastMessage.channelId : state.channelId,
                body: message,
                ts: new Date(),
              },
            ],
            lastMessage: {
              autor: 'Me',
              channelId: state.channelId === CHANNELS.ALL ? state.rooms[state.roomId].lastMessage.channelId : state.channelId,
              body: message,
              ts: new Date(),
            },
          },
        },
      };
    }
    default:
      return state;
  }
}
