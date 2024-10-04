import { types } from "./tweet.types";
import { mutations } from "./tweet.mutation.js";
import { Query } from "./tweet.query";
import resolvers from "./tweet.resolver.js";

export const Tweet = { types, mutations, resolvers, Query };
