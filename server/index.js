const firebase = require('firebase')
const FIREBASE_CONFIG = require('./config').FIREBASE_CONFIG

const server = require('swyx')()

const app = server.app
app.get('/api', (req, res) => res.send('this is api route'))
app.use(server.finalHandler) // optional error handling
server.start()

firebase.initializeApp(FIREBASE_CONFIG)

// write dumy data to start pple off
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('lobbies').set({
    'Lobby1': {
      players: {
        1: {
          username: 'player1',
          readyState: false
        },
        2: {
          username: 'player2',
          readyState: false
        }
      }
    },
    'Lobby2': {
      players: {
        1: {
          username: 'player3',
          readyState: false
        }
      }
    }
  })
  // firebase.database().ref('lobbies').push().set({name: 'sldkj', '123': '345'})
}

writeUserData('1', 'Larry', 'larry@larry.com', 'url')
