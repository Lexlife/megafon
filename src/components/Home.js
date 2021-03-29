import React from 'react';
import { connect } from 'react-redux';
import { toggleMenu } from '../store/actions';
import { CssBaseline, Drawer, Hidden } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Chat from './ChatItem.js';
import ChatBar from './ChatBar.js';
import ChatsActivity from './ChatList.js';

const drawerWidth = 360;

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  mobileMenu: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    maxWidth: drawerWidth,
    width: '100%',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    document.title = 'Чаты Мегафон';
    this.handleMenuToggle = this.handleChatsActivityToggle.bind(this);
  }

  handleChatsActivityToggle(e) {
    this.setState(this.state);
  }

  render() {
    const { classes } = this.props;
    if (this.props.chats.unread > 0) document.title = 'Новых сообщений: ' + this.props.chats.unread;
    else document.title = 'Чаты Мегафон';

    if (isWidthUp('md', this.props.width) && this.props.app.isMobile) this.props.toggleMenu();

    return (
      <div className={classes.root}>
        <CssBaseline />
        <ChatBar />
        <nav className={classes.drawer}>
          <Hidden mdUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={'left'}
              open={this.props.app.isMobile}
              onClose={this.props.toggleMenu}
              classes={{ paper: classes.drawerPaper }}
              className={classes.mobileMenu}
              ModalProps={{ keepMounted: true }}
            >
              {<ChatsActivity />}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              classes={{ paper: classes.drawerPaper }}
              variant="permanent"
              open
            >
              {<ChatsActivity />}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content} id="message-list">
          <div className={classes.toolbar} />
          <Chat />
        </main>
      </div>
    );
  }
}

export default connect(
  state => state,
  { toggleMenu },
)(withWidth()(withStyles(styles)(Home)));
