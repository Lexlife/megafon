import React from 'react';
import { connect } from 'react-redux';
import { toggleMenu, readChannel } from '../store/actions';
import { CHANNELS } from '../channels';

import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Badge } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 360;

const styles = theme => ({
  appBar: {
    marginLeft: drawerWidth,
    backgroundColor: '#00BB5C',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      backgroundColor: '#00BB5C',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  headerTitle: {
    flexGrow: 1,
  },
});

class ChatBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };

    this.handleSelectSourceMenu = this.handleSelectSourceMenu.bind(this);
    this.handleSelectSource = this.handleSelectSource.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
  }

  handleSelectSourceMenu(e) {
    this.state.anchorEl = e.currentTarget;
    this.setState(this.state);
  }

  handleSelectSource(e) {
    this.state.anchorEl = null;
    this.setState(this.state);
    if (e) {
      this.props.readChannel(e);
    }
  }

  handleMenuToggle() {
    this.props.toggleMenu();
  }

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={this.handleMenuToggle}
            className={classes.menuButton}
          >
            <Badge badgeContent={this.props.chats.unread} color="secondary">
              <MenuIcon />
            </Badge>
          </IconButton>
          <Typography variant="h6" className={classes.headerTitle}>
            {this.props.chats.roomId || 'Чат не выбран'}
          </Typography>
          <Badge
            badgeContent={this.props.chats.roomId ? this.props.chats.rooms[this.props.chats.roomId].unread[CHANNELS.ALL] : null}
            color="secondary">
            <Button
              color="inherit"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={this.handleSelectSourceMenu}
            >
              {this.props.chats.channelId}
            </Button>
          </Badge>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={e => this.handleSelectSource()}

          >
            <MenuItem
              onClick={e => this.handleSelectSource(CHANNELS.VK)}
              selected={this.props.chats.channelId === CHANNELS.VK}
            >
              <Badge
                badgeContent={this.props.chats.roomId ? this.props.chats.rooms[this.props.chats.roomId].unread[CHANNELS.VK] : null}
                color="secondary"
              >
                Вконтакте
              </Badge>
            </MenuItem>
            <MenuItem
              onClick={e => this.handleSelectSource(CHANNELS.OK)}
              selected={this.props.chats.channelId === CHANNELS.OK}
            >
              <Badge
                badgeContent={this.props.chats.roomId ? this.props.chats.rooms[this.props.chats.roomId].unread[CHANNELS.OK] : null}
                color="secondary"
              >
                Одноклассники
              </Badge>
            </MenuItem>
            <MenuItem
              onClick={e => this.handleSelectSource(CHANNELS.FB)}
              selected={this.props.chats.channelId === CHANNELS.FB}
            >
              <Badge
                badgeContent={this.props.chats.roomId ? this.props.chats.rooms[this.props.chats.roomId].unread[CHANNELS.FB] : null}
                color="secondary"
              >
                Фейсбук
              </Badge>
            </MenuItem>
            <MenuItem
              onClick={e => this.handleSelectSource(CHANNELS.ALL)}
              selected={this.props.chats.channelId == CHANNELS.ALL}
            >
              Все каналы
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect(
  state => state,
  { toggleMenu, readChannel },
)(withStyles(styles)(ChatBar));
