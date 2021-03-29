import React from 'react';
import { connect } from 'react-redux';
import { readRoom } from '../store/actions';
import { CHANNELS } from '../channels';

import { Container, List, ListItem, Typography, ListSubheader, Divider, Fab, Zoom } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { withStyles } from '@material-ui/core/styles';
import MessageInput from './MessageInput.js';
import { preferTime } from './App.js';

const styles = theme => {
  transitionDuration = transitionDuration(theme);

  return {
    messages: {
      flexGrow: 1,
    },
    message: {
      borderRadius: '18px',
      backgroundColor: theme.palette.grey[300],
      color: '#282828',
      marginBottom: '15px',
      width: 'fit-content',
      maxWidth: '90%',
    },
    messageText: {
      whiteSpace: 'pre-wrap',
    },
    myMessage: {
      marginLeft: 'auto',
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    selectDialogHelper: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fab: {
      position: 'fixed',
      marginBottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 100,
    },
    messageTime: {
      marginLeft: 'auto',
      float: 'right',
      paddingLeft: '8px',
      fontSize: '12px',
      opacity: .6,
      marginTop: '3px',
    },
  };
};

let transitionDuration = theme => ({
  enter: theme.transitions.duration.enteringScreen,
  exit: theme.transitions.duration.leavingScreen,
});

class ChatItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userScroll: false,
      messageList: null,
      input: null,
      fabOffset: 0,
    };

    this.checkUserScroll = this.checkUserScroll.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.state.messageList = document.getElementById('message-list');
  }

  componentDidUpdate() {
    if (!this.state.userScroll && this.state.messageList) this.state.messageList.lastChild.scrollIntoView(false);
  }

  checkUserScroll() {
    if (!this.state.input) this.state.input = document.getElementById('input-wrp');
    if (this.state.input) this.state.fabOffset = this.state.input.clientHeight;
    this.setState(this.state);
  }

  scrollToBottom() {
    this.state.userScroll = false;
    if (this.state.messageList) this.state.messageList.lastChild.scrollIntoView(false);
    this.setState(this.state);
  }

  render() {
    const { classes } = this.props;

    this.state.userScroll = document.documentElement.scrollTop != document.documentElement.scrollHeight - document.documentElement.clientHeight;

    let chat = null;
    let room = null;
    let messages = null;
    if (this.props.chats.roomId) {
      room = this.props.chats.rooms[this.props.chats.roomId];
      messages = room.messages.filter(message => this.props.chats.channelId == CHANNELS.ALL || message.channelId == this.props.chats.channelId);
    }

    if (this.props.chats.roomId && messages != null && messages.length) {
      messages = messages.map((message, i) => {
        let divider = null;

        if (
          this.props.chats.channelId == CHANNELS.ALL &&
          (
            i == 0 ||
            room.messages[i - 1].channelId != room.messages[i].channelId
          )
        ) {
          divider = (
            <>
              <Divider />
              <ListSubheader>{message.channelId}</ListSubheader>
            </>
          );
        }

        return (
          <span key={i}>
            {divider}
            <ListItem alignItems="flex-start"
                      className={classes.message + ' ' + (message.autor == 'Me' ? classes.myMessage : '')}>
              <Typography variant="body2" className={classes.messageText}>
                {message.body}
                <Typography variant="body2" component="span" className={classes.messageTime}>
                  {preferTime(message.ts)}
                </Typography>
              </Typography>
            </ListItem>
          </span>
        );
      });

      chat = (
        <>
          <List className={classes.messages}>
            {messages}
          </List>
          <MessageInput onChange={this.checkUserScroll} />
          <Zoom
            key="primary"
            in={this.state.userScroll}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${this.state.userScroll ? transitionDuration.exit : 0}ms`,
            }}
            unmountOnExit
          >
            <Fab aria-label="Вниз" className={classes.fab} style={{
              bottom: this.state.fabOffset + 'px',
            }} color="primary" onClick={this.scrollToBottom}>
              <ArrowDownwardIcon />
            </Fab>
          </Zoom>
        </>
      );
    } else {
      chat = (
        <div className={classes.selectDialogHelper}>
          <Typography variant="subtitle2">
            {messages != null ? 'В этом канале пока сообщений нет' : 'Выберите чат для общения'}
          </Typography>
        </div>
      );
    }
    return (
      <Container maxWidth="md" className={classes.root}>{chat}</Container>
    );
  }
}

export default connect(
  state => state,
  { readRoom },
)(withStyles(styles)(ChatItem));
