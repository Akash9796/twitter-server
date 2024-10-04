"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const user_types_1 = require("./user.types");
const user_query_1 = require("./user.query");
const user_resolver_1 = require("./user.resolver");
// import { mutations } from "./user.mutation";
exports.User = { types: user_types_1.types, Query: user_query_1.Query, resolvers: user_resolver_1.resolvers };
