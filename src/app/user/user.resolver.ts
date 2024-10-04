import axios from "axios";
import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interface";
import { User } from "@prisma/client";

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const googleOAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleOAuthUrl.searchParams.set("id_token", token);

    // Fetching user info from Google
    const { data } = await axios.get(googleOAuthUrl.toString(), {
      responseType: "json",
    });

    let userInDb = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!userInDb) {
      userInDb = await prismaClient.user.create({
        data: {
          email: data.email,
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ")[1] || null, // Handle cases where last name might be missing
          profileImageUrl: data.picture || null, // Handle missing profile image
        },
      });
    }

    const userToken = await JWTService.generateTokenForUser(userInDb);

    console.log(userToken, "userToken");

    return userToken;
  },

  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    console.log(ctx, "context");
    if (!ctx.user) return null;
    return prismaClient.user.findUnique({ where: { id: ctx.user.id } });
  },

  getUserById: async (
    parent: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => {
    return prismaClient.user.findUnique({ where: { id } });
  },
};

const tweetRelationsResolver = {
  User: {
    tweets: (parent: User) =>
      prismaClient.tweet.findMany({ where: { authorId: parent.id } }),

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

export const resolvers = { queries, tweetRelationsResolver };
