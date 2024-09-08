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
}

export default AggregationPipeline;
