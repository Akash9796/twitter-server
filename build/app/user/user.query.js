"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
exports.Query = `#graphql
verifyGoogleToken(token:String!):String
getCurrentUser: User
getUserById(id: ID!):User
`;
