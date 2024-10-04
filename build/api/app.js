"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = initServer;
const server_1 = require("@apollo/server");
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = require("../src/app/user");
const cors_1 = __importDefault(require("cors"));
const jwt_1 = __importDefault(require("../src/services/jwt"));
const tweet_1 = require("../src/app/tweet");
async function initServer() {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.use((0, cors_1.default)());
    const graphqlServer = new server_1.ApolloServer({
        typeDefs: `

    ${user_1.User.types}
    ${tweet_1.Tweet.types}

    type Query{
      ${user_1.User.Query}
      ${tweet_1.Tweet.Query}
    }
    type Mutation{
      ${tweet_1.Tweet.mutations}
    }
    `,
        resolvers: {
            Query: {
                ...user_1.User.resolvers.queries,
                ...tweet_1.Tweet.resolvers.queries,
            },
            Mutation: {
                ...tweet_1.Tweet.resolvers.mutations,
            },
            ...tweet_1.Tweet.resolvers.userRelationResolver,
            ...user_1.User.resolvers.tweetRelationsResolver,
        },
    });
    await graphqlServer.start();
    app.use("/graphql", (0, express4_1.expressMiddleware)(graphqlServer, {
        context: async ({ req }) => {
            return {
                user: req.headers.authorization
                    ? await jwt_1.default.decodeToken(req.headers.authorization.split(" ")[1])
                    : undefined,
            };
        },
    }));
    return app;
}
