const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['success_story', 'career_tip', 'upcoming_event'],
      required: true,
    },

    // Dùng chung
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
    thumbnail_url: String,
    content: String,
    progId: String,

    // Riêng cho upcoming_event
    location: String,

    eventDate: {
      date: { type: String },       // YYYY-MM-DD
      startTime: { type: String },  // HH:mm
      endTime: { type: String },    // HH:mm
    },

    author: {
      type: String,
      default: "admin",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: Date,
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
