"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
const tweet_types_1 = require("./tweet.types");
const tweet_mutation_js_1 = require("./tweet.mutation.js");
const tweet_query_1 = require("./tweet.query");
const tweet_resolver_js_1 = __importDefault(require("./tweet.resolver.js"));
exports.Tweet = { types: tweet_types_1.types, mutations: tweet_mutation_js_1.mutations, resolvers: tweet_resolver_js_1.default, Query: tweet_query_1.Query };
