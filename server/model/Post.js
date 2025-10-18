const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['success_story', 'career_tip', 'upcoming_event'],
      required: true,
    },

    // chung cho success_story, career_tip, upcoming_event
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    thumbnail_url: {
      type: String,
    },
    content: {
      type: String, // HTML cho success_story và career_tip
    },

    // riêng upcoming_event
    location: {
      type: String,
    },
    event_date: {
      type: Date,
    },
    author: {
      type: String, // hoặc ObjectId ref User nếu cần
      default: "admin",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Tự động tạo slug
PostSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.models.Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
