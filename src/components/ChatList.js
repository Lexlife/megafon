import React from 'react';
import { connect } from 'react-redux';
import { readRoom, toggleMenu } from '../store/actions';
import { CHANNELS } from '../channels';
import { CardHeader, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { preferTime } from './App.js';

const styles = theme => ({
  root: {
    height: '100%',
  },
  inline: {
    display: 'inline',
  },
  headerDialog: {
    width: '100%',
    display: 'flex',
  },
  timeDialog: {
    marginLeft: 'auto',
  },
  noDialogs: {
    justifyContent: 'center',
    flexGrow: 1,
    alignItems: 'center',
    display: 'flex',
  },
  unreadDialog: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    marginLeft: 'auto',
    float: 'right',
    padding: '3px 6px',
    lineHeight: '16px',
    minWidth: '22px',
    textAlign: 'center',
    borderRadius: '11px',
  },
});

function MessagePreview(props) {
  const classes = makeStyles(styles)();

  return (
    <ListItem alignItems="flex-start" button onClick={props.onClick} selected={props.selected}>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" aria-label="recipe">{props.roomId[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText
        classes={{ primary: classes.headerDialog }}
        primary={
          <>
            {props.roomId}
            <Typography
              component="span"
              variant="body2"
              className={classes.timeDialog}
              color="textPrimary"
            >
              {preferTime(props.message.ts)}
            </Typography>
          </>
        }
        secondary={
          <>
            <Typography
              component="span"
              variant="body2"
              className={classes.inline}
              color="textPrimary"
            >
              {props.message.autor}
            </Typography>
            {' — ' + (props.message.body.length > 110 ? props.message.body.substring(0, 110) + '...' : props.message.body)}
            {
              props.unread[CHANNELS.ALL] > 0 ?
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.unreadDialog}
                >
                  {props.unread[CHANNELS.ALL]}
                </Typography>
                : null
            }
          </>
        }
      />
    </ListItem>
  );
}

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectRoom = this.handleSelectRoom.bind(this);
  }

  handleSelectRoom(e) {
    this.props.readRoom(e);
    this.props.toggleMenu();
  }

  render() {
    const { classes } = this.props;
    let list = null;
    if (this.props.chats.timeline.length == 0) {
      list = (
        <div className={classes.noDialogs}>
          <Typography variant="subtitle2">
            {'Начните свой первый чат'}
          </Typography>
        </div>
      );
    } else {
      list = (
        <List className={classes.root}>
          {
            this.props.chats.timeline.map((roomId, i) =>
              <span key={i}>
                <MessagePreview
                  roomId={roomId}
                  message={this.props.chats.rooms[roomId].lastMessage}
                  onClick={e => this.handleSelectRoom(roomId)}
                  selected={this.props.chats.roomId === roomId}
                  unread={this.props.chats.rooms[roomId].unread}
                />
                {(i != this.props.chats.timeline.length - 1) ? <Divider variant="inset" component="li" /> : null}
              </span>,
            )
          }
        </List>
      );
    }

    return (
      <>
        <CardHeader title={'Ваши чаты Мегафон:'}></CardHeader>
        {list}
      </>
    );
  }
}

export default connect(
  state => state,
  { readRoom, toggleMenu },
)(withStyles(styles)(ChatList));
