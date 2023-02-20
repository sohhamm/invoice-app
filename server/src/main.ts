import {buildServer} from './server'

const server = buildServer()

server.listen(
  {
    port: 8000,
    host: '0.0.0.0',
  },
  (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`Server listening at ${address} 🚀`)
  },
)
