


import Post from "../models/postModel.js";


// ✅ Create a post
export const createPost = async (req, res) => {
//   if (!req.body) {
//     return res.status(400).json({ message: "Missing request body" });
//   }

// console.log("🟢 Raw req.body:", req.body);
  const { title, subject, body } = req.body;

  try {

    // console.log("📥 Incoming post data:", { title, subject, body });
    // console.log("🔐 Authenticated user:", req.user);


    if (!title || !subject || !body) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = await Post.create({
      title,
      subject,
      body,
      userId: req.user.id
    });

    console.log("✅ Post created:", post.toJSON());

    res.status(201).json({
      message: "Post created successfully",
      post
    });
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({
      message: "Failed to create post",
      error: err.message
    });
  }
};



// ✅ Get posts for the logged-in user
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: err.message
    });
  }
};


// ✅ Delete a post (only if it belongs to the user)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    await post.destroy();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete post",
      error: err.message
    });
  }
};



// update a post
// ✅ Update a post (only if it belongs to the user)
export const updatePost = async (req, res) => {
  const { title, subject, body } = req.body;

  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    post.title = title || post.title;
    post.subject = subject || post.subject;
    post.body = body || post.body;

    await post.save();

    res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update post",
      error: err.message,
    });
  }
};



// ✅ Get a single post (only if it belongs to the user)
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post", error: err.message });
  }
};





