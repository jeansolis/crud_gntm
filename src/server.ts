import dotenv from 'dotenv'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import http from 'http'
import ws from 'ws'
import { graphqlHTTP } from 'express-graphql'
import { useServer } from 'graphql-ws/lib/use/ws'
import typeDefs from './graphql/types'
import resolvers from './graphql/resolvers'
import { makeExecutableSchema } from '@graphql-tools/schema'

dotenv.config();

const port = process.env.PORT || 3000;
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

// Middlewares
app.use(cors());
app.use(compression());

// Paths
app.get('/', (_, res) => {
  res.send('Hello there!');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// Subscriptions support for future experiments
const server = http.createServer(app);
const wsServer = new ws.Server({
  server,
  path: '/graphql',
});

app.listen(port, () => {
  useServer({ schema }, wsServer);
  console.info(`Listening on http://localhost:${port}/graphql`)
});
