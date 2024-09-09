import mongoose from "mongoose";

class AggregationPipeline {
  constructor() {}

  static getSingleBlogDetails(postId) {
    return [
      {
        $match: { _id: postId },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
    ];
  }

  static getUserPublishedBlog(userId) {
    return [
      {
        $match: { author: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "blog_post",
          as: "likes",
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          image: 1,
          createdAt: 1,
          slug: 1,
          totalLikes: { $size: "$likes" },
        },
      },
    ];
  }
}

export default AggregationPipeline;
