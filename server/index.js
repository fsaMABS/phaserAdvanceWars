const server = require('swyx').server()
const app = server.app
app.get('/api', (req, res) => res.send('this is api route'))
app.use(server.finalHandler) // optional error handling
server.listen()
