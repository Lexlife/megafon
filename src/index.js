import http from 'http';

const loremIpsum = require('lorem-ipsum').loremIpsum;

let app = require('./server').default;

const server = http.createServer(app);

const io = require('socket.io')(server);

let currentApp = app;

let init = true;
let id = 0;
const roomIds = ['Евгений Касперский', 'Игорь Данилов', 'Михаил Донской', 'Лев Королев', 'Дмитрий Крюков'];
const channelIds = ['Вконтакте', 'Одноклассники', 'Фейсбук'];

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.error(error);
  }
  console.log('Сервер запущен на порту 3000');
});

if (module.hot) {
  console.log('Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}

io.on('connection', client => {
  let timeoutId = null;
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
    timeoutId = setTimeout(emit, randomBetween(3000, 12000));
  }

  function handle(message) {
    client.broadcast.emit('on_message', message);
  }

  client.on('disconnect', () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  });
});

function randomBetween(min, max) {
  return Math.floor((max - min + 1) * Math.random()) + min;
}

function randomChoose(array) {
  return array[randomBetween(0, array.length - 1)];
}
