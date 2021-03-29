import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store/store';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import deepPurple from '@material-ui/core/colors/deepPurple';

const loremIpsum = require('lorem-ipsum').loremIpsum;

import Home from './Home.js';

let init = true;
let id = 0;
const roomIds = ['Сергей Белоусов', 'Александр Степанов', 'Игорь Данилов', 'Евгений Касперский', 'Дмитрий Крюков'];
const channelIds = ['Вконтакте', 'Одноклассники', 'Фейсбук'];

let theme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: purple,
  },
  status: {
    danger: 'orange',
  },
});

theme = responsiveFontSizes(theme);

const styles = theme => ({
  body: {
    margin: 0,
    height: '100vh',
  },
  root: {
    height: '100%',
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    emit();

    function emit() {
      if (init) {
        init = false;
      } else {
        handle({
          id: ++id,
          roomId: randomChoose(roomIds),
          channelId: randomChoose(channelIds),
          body: loremIpsum({
            count: randomBetween(1, 5),
            format: 'plain',
            units: randomChoose(['sentences', 'words']),
          }),
          ts: new Date(),
        });
      }
      setTimeout(emit, randomBetween(1500, 4000));
    }

    function handle(message) {
      store.dispatch({ type: 'PUSH_MESSAGE', payload: message });
    }
  }

  render() {
    const { classes } = this.props;
    document.body.className = classes.body;
    document.getElementById('root').className = classes.root;

    return (
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Switch>
              <Route path='/' component={Home} />
            </Switch>
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);

export function preferTime(time) {
  let h = time.getHours();
  let m = time.getMinutes();

  return h + ':' + (m < 10 ? '0' : '') + m;
}

function randomBetween(min, max) {
  return Math.floor((max - min + 1) * Math.random()) + min;
}

function randomChoose(array) {
  return array[randomBetween(0, array.length - 1)];
}
