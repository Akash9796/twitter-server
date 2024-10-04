"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../client/db");
const queries = {
    getAllTweets: async (parent, args, ctx) => {
        if (!ctx.user?.id)
            throw Error("You are  not authenticated");
        const tweets = await db_1.prismaClient.tweet.findMany({
            orderBy: { createdAt: "desc" },
        });
        return tweets;
    },
};
const mutations = {
    createTweet: async (parent, { payLoad }, ctx) => {
        if (!ctx.user)
            throw new Error("You are not authenticated");
        const tweetCreated = await db_1.prismaClient.tweet.create({
            data: {
                content: payLoad.content,
                imageUrl: payLoad.imageUrl || "",
                author: { connect: { id: ctx.user.id } },
            },
        });
        return tweetCreated;
    },
};
const userRelationResolver = {
    Tweet: {
        author: async (parent) => {
            return await db_1.prismaClient.user.findUnique({
                where: { id: parent.authorId },
            });
        },
    },
};
const resolvers = { mutations, userRelationResolver, queries };
exports.default = resolvers;
