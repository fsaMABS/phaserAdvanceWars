const socketCallback = socket => {
  console.log(`A socket connection to the server has been made: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`Connection ${socket.id} has left the building`)
  })
  socket.on('client', val => {
    console.log('client received', val)
    socket.broadcast.emit('server', val)
  })
}
const middlewareOptions = {
  // userApp,    // supply an express instance if you want, will set one up for you if you don't have one
  // bodyParser, // supply `bodyParser: null` to turn off the default json and urlencoded config
  // morgan,     // supply `morgan: null` to turn off. defaults to `morgan('dev')`, supply string to change logging type or supply `morgan` object to avoid default morgan logging
  // staticRouting, // supply `staticRouting: null` to turn off. defaults to `/public`.
}
const listenOptions = {
  // htmlSPA, // catchall to render single page apps. supply `htmlSPA: null` to turn off. defaults to `/public/index.html`.
  socketCallback // off by default. supply a callback fn `socket => {socket.on('event', ()=>console.log('event'))}` to turn on
}
const server = require('swyx').server(middlewareOptions, listenOptions)
const app = server.app
app.get('/api', (req, res) => res.send('this is api route'))
app.use(server.finalHandler) // optional error handling
server.listen()
