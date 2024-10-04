import { Tweet } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interface";

interface CreateTweetPayload {
  content: string;
  imageUrl?: string;
}

const queries = {
  getAllTweets: async (parent: any, args: any, ctx: GraphqlContext) => {
    if (!ctx.user?.id) throw Error("You are  not authenticated");

    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });

    return tweets;
  },
};

const mutations = {
  createTweet: async (
    parent: any,
    { payLoad }: { payLoad: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");

    const tweetCreated = await prismaClient.tweet.create({
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
    author: async (parent: Tweet) => {
      return await prismaClient.user.findUnique({
        where: { id: parent.authorId },
      });
    },
  },
};

const resolvers = { mutations, userRelationResolver, queries };

export default resolvers;
