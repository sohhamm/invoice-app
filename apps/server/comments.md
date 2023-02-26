# to-do

- add pino as the logger of fastify
- move create server + logger to utils
- review this
  [Fastify server repo](https://github.com/TomDoesTech/password-manager/tree/main/server)
- add fastify cors
- add dotenv
- use private and public key for jwt, get the keys from
  [here](https://travistidwell.com/jsencrypt/demo/)

## Troubleshooting

- sudo lsof -i -P | grep LISTEN | grep :5432
- sudo kill -9 PID
