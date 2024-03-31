const { WebSocketServer } = require('ws')
const chokidar = require('chokidar')

const wss = new WebSocketServer({ port: 3001 })
const watchCallbacks = []

const watcher = chokidar.watch('./md')
watcher.on('change', () => {
  watchCallbacks.forEach((cb) => cb())
})

wss.on('connection', (ws) => {
  ws.on('error', console.error)

  const onChange = () => {
    ws.send('refresh')
  }

  watchCallbacks.push(onChange)

  ws.on('close', () => {
    const index = watchCallbacks.findIndex((cb) => cb === onChange)
    watchCallbacks.splice(index, 1)
  })
})
