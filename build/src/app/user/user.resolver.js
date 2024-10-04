"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../../client/db");
const jwt_1 = __importDefault(require("../../services/jwt"));
const queries = {
    verifyGoogleToken: async (parent, { token }) => {
        const googleOAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOAuthUrl.searchParams.set("id_token", token);
        // Fetching user info from Google
        const { data } = await axios_1.default.get(googleOAuthUrl.toString(), {
            responseType: "json",
        });
        let userInDb = await db_1.prismaClient.user.findUnique({
            where: { email: data.email },
        });
        if (!userInDb) {
            userInDb = await db_1.prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.name.split(" ")[0],
                    lastName: data.name.split(" ")[1] || null, // Handle cases where last name might be missing
                    profileImageUrl: data.picture || null, // Handle missing profile image
                },
            });
        }
        const userToken = await jwt_1.default.generateTokenForUser(userInDb);
        console.log(userToken, "userToken");
        return userToken;
    },
    getCurrentUser: async (parent, args, ctx) => {
        console.log(ctx, "context");
        if (!ctx.user)
            return null;
        return db_1.prismaClient.user.findUnique({ where: { id: ctx.user.id } });
    },
    getUserById: async (parent, { id }, ctx) => {
        return db_1.prismaClient.user.findUnique({ where: { id } });
    },
};
const tweetRelationsResolver = {
    User: {
        tweets: (parent) => db_1.prismaClient.tweet.findMany({ where: { authorId: parent.id } }),
        // followers: async (parent: User) => {
        //   const result = await prismaClient.follows.findMany({
        //     where: { following: { id: parent.id } },
        //     include: {
        //       follower: true,
        //     },
        //   });
        //   return result.map((el) => el.follower);
        // },
        // following: async (parent: User) => {
        //   const result = await prismaClient.follows.findMany({
        //     where: { follower: { id: parent.id } },
        //     include: {
        //       following: true,
        //     },
        //   });
        //   return result.map((el) => el.following);
        // },
    },
};
exports.resolvers = { queries, tweetRelationsResolver };
