const firebase = require('firebase')
const FIREBASE_CONFIG = require('./config').FIREBASE_CONFIG

const server = require('swyx')()

const app = server.app
app.get('/api', (req, res) => res.send('this is api route'))

let fbdata = {}
app.get('/api/db', (req, res) => res.json(fbdata))
app.use(server.finalHandler) // optional error handling
server.start()

firebase.initializeApp(FIREBASE_CONFIG)

// write dumy data to start pple off
function writeUserData () {
  firebase.database().ref('lobbies').set({
    'AlwaysBusyLobby': {
      players: {
        1: {
          username: 'player1',
          readyState: false,
          role: 'red'
        },
        2: {
          username: 'player2',
          readyState: false,
          role: 'blue'
        }
      }
    }
  })
  // firebase.database().ref('lobbies').push().set({name: 'sldkj', '123': '345'})
}

writeUserData()
firebase.database().ref('lobbies').on('value', snapshot => {
  fbdata = snapshot.toJSON()
})
