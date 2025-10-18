const BASE_URL = "http://localhost:3000/alowork/user";
const DB_URL = "http://localhost:3000/alowork/db";
const LOGIN_URL = `${DB_URL}/login`;

// 👤 Credential test
const credential = {
  admin: { email: "admin@example.com", password: "123456" },
};

// ====================== HELPERS ======================
async function getToken(role) {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential[role]),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  const data = await res.json();
  return data.token;
}

async function createPost(token, postData) {
  console.log(`📝 Creating new post of type: ${postData.type}...`);
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create post");
  }

  console.log("✅ Post created:", data.data.title);
  return data.data;
}

async function getAllPosts() {
  console.log("📜 Fetching all posts...");
  const res = await fetch(`${BASE_URL}/posts`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
}

async function getPostsByType(type) {
  console.log(`🔍 Fetching posts by type: ${type}`);
  const res = await fetch(`${BASE_URL}/post?type=${type}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch posts of type: ${type}`);
  }

  if (!Array.isArray(data.data)) {
    console.log("❌ Unexpected data format:", data);
    throw new Error(`Unexpected response format for type '${type}'`);
  }

  console.log(`✅ Found ${data.data.length} posts of type '${type}'`);
  return data; // return nguyên object để dùng .data bên ngoài
}

// === MỚI: Hàm xóa toàn bộ posts ===
async function deleteAllPosts(token) {
  console.log("🗑️ Deleting all posts...");
  const res = await fetch(`${BASE_URL}/posts/delete-all`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete all posts");
  }

  console.log("✅ All posts deleted");
}

// =============================
// 🧪 TEST FLOW
// =============================
async function runTests() {
  try {
    console.log("🚀 Running Post API Tests with fetch...\n");

    const token = await getToken("admin");

    await deleteAllPosts(token);
    await getAllPosts();
    // // 1. Success Story post
    // await createPost(token, {
    //   type: "success_story",
    //   title: "Câu chuyện thành công tự động",
    //   thumbnail_url: "https://placehold.co/600x400",
    //   content: "<p>Đây là nội dung câu chuyện thành công.</p>",
    //   status: "published",
    //   author: "Test Script",
    // });

    // // 2. Career Tip post
    // await createPost(token, {
    //   type: "career_tip",
    //   title: "Mẹo nghề nghiệp tự động",
    //   thumbnail_url: "https://placehold.co/600x400",
    //   content: "<p>Đây là nội dung mẹo nghề nghiệp.</p>",
    //   status: "published",
    //   author: "Test Script",
    // });

    // // 3. Upcoming Event post
    // await createPost(token, {
    //   type: "upcoming_event",
    //   title: "Sự kiện sắp tới tự động",
    //   thumbnail_url: "https://placehold.co/600x400",
    //   location: "Hà Nội",
    //   eventDate: "2025-12-01",
    //   status: "published",
    //   author: "Test Script",
    // });

    // // Lấy tất cả posts
    // const allPosts = await getAllPosts();
    // console.log(`📊 Total posts: ${allPosts.length}`);
    // console.log("Posts list: ", allPosts);

    // // Lấy theo type
    // const types = ["success_story", "career_tip", "upcoming_event"];
    // for (const type of types) {
    //   const result = await getPostsByType(type);
    //   const posts = result.data;

    //   if (!Array.isArray(posts) || posts.length === 0) {
    //     throw new Error(`Post not found for type: ${type}`);
    //   }

    //   console.log(`✅ Confirmed ${posts.length} posts for type: ${type}`);
    // }

    // console.log("\n✅ All Post API tests completed successfully!");

  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

runTests();
