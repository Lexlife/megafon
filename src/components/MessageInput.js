import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, IconButton, InputBase, Divider } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { connect } from 'react-redux';
import { sendMessage, readRoom } from '../store/actions';

const styles = theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    maxWidth: 600,
    margin: 'auto',
    width: '100%',
    position: 'sticky',
    bottom: '8px',
    zIndex: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    marginTop: 'auto',
    transition: '.25s cubic-bezier(0.75, 0, 0.1, 1.01)',
  },
  divider: {
    height: 28,
    margin: '8px 4px',
    marginTop: 'auto',
    transition: '.25s cubic-bezier(0.75, 0, 0.1, 1.01)',
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'scale(.8)',
  },
});

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };

    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handlePrintMessage = this.handlePrintMessage.bind(this);
    this.handleCtrlEnter = this.handleCtrlEnter.bind(this);
  }

  handleSendMessage() {
    let text = this.state.message;
    text = text
      .replace(/<+/g, '&lt;')
      .replace(/>+/g, '&gt;')
      .replace(/\r?\n{2,}/g, '<br>\n')
      .replace(/\r?\n/g, '<br>')
      .replace(/\s+/g, ' ');

    while (text.indexOf('<br>') == 0) text = text.substring(4);
    while (~text.lastIndexOf('<br>') && text.length - 4 == text.lastIndexOf('<br>')) text = text.substring(0, text.length - 4);

    text = text.replace(/<br>/g, '\n');

    if (text == '') return;

    this.props.sendMessage(text);
    this.props.readRoom(this.props.chats.roomId);
    document.getElementById('input-message').value = this.state.message = '';
    this.setState(this.state);
  }

  componentDidMount() {
    if (this.props.onChange) this.props.onChange();
  }

  componentDidUpdate() {
    if (this.props.onChange) this.props.onChange();
  }

  handlePrintMessage(e) {
    this.state.message = e.target.value;
    this.setState(this.state);
    if(this.props.onChange) this.props.onChange();
  }

  handleCtrlEnter(e) {
    if (e.keyCode == 13 && e.ctrlKey) this.handleSendMessage();
  }

  render() {
    const { classes } = this.props;

    let helperHidden = this.state.message.length > 0 ? '' : classes.hidden;

    return (
      <Paper className={classes.root} id="input-wrp">
        <InputBase
          className={classes.input}
          placeholder="Введите сообщение"
          multiline
          inputProps={{
            'aria-label': 'Введите ваше сообщение',
            'id': 'input-message',
            'onKeyDown': this.handleCtrlEnter,
          }}
          onChange={this.handlePrintMessage}
        />
        <Divider className={classes.divider + ' ' + helperHidden} orientation="vertical" />
        <IconButton color="primary" className={classes.iconButton + ' ' + helperHidden} aria-label="send"
                    onClick={this.handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Paper>
    );
  }
}

export default connect(
  state => {
    return state;
  },
  { sendMessage, readRoom },
)(withStyles(styles)(MessageInput));
