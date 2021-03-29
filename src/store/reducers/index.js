import { combineReducers } from 'redux';
import app from './app';
import chats from './chats';

export default combineReducers({ app, chats });
