import { TOGGLE_MENU, SEND_MESSAGE, READ_ROOM,  READ_CHANNEL } from './actionTypes'

export const toggleMenu = isMobile => ({
  type: TOGGLE_MENU,
  payload: { isMobile }
})

export const sendMessage = message => ({
  type: SEND_MESSAGE,
  payload: { message }
})

export const readRoom = roomId => ({
  type: READ_ROOM,
  payload: { roomId }
})

export const readChannel = channelId => ({
  type: READ_CHANNEL,
  payload: { channelId }
})
