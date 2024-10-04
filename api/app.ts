import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { User } from "../src/app/user";
import cors from "cors";
import { GraphqlContext } from "../src/interface";
import JWTService from "../src/services/jwt";
import { Tweet } from "../src/app/tweet";

export async function initServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `

    ${User.types}
    ${Tweet.types}

    type Query{
      ${User.Query}
      ${Tweet.Query}
    }
    type Mutation{
      ${Tweet.mutations}
    }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
      },
      ...Tweet.resolvers.userRelationResolver,
      ...User.resolvers.tweetRelationsResolver,
    },
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: async ({ req }) => {
        return {
          user: req.headers.authorization
            ? await JWTService.decodeToken(
                req.headers.authorization.split(" ")[1]
              )
            : undefined,
        };
      },
    })
  );

  return app;
}
