const BASE_URL = "http://localhost:3000/alowork/user";
const DB_URL = "http://localhost:3000/alowork/db";
const LOGIN_URL = `${DB_URL}/login`;

// 👤 Credential test
const credential = {
  admin: { email: "admin@example.com", password: "123456" },
  recruiter: { email: "test@example.com", password: "123456" } 
};

// ====================== HELPERS ======================
async function getToken(role) {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential[role]),
  });

  if (!res.ok) throw new Error(`Login failed: ${res.status}`);

  const data = await res.json();
  return data.token;
}

// -------------------- COSTS CRUD --------------------
async function addProgrammCost(token, programmId, costData) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/costs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(costData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add cost");
  console.log("✅ Cost added:", data);
  return data;
}

async function getProgrammCosts(token, programmId) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/costs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch costs");
  return Array.isArray(data.data) ? data.data : data;
}

async function updateProgrammCost(token, programmId, costId, costData) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/costs/${costId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(costData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update cost");
  console.log("✅ Cost updated:", data);
  return data;
}

async function deleteProgrammCost(token, programmId, costId) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/costs/${costId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete cost");
  console.log("✅ Cost deleted:", costId);
  return data;
}

// -------------------- DOCUMENTS CRUD --------------------
async function addProgrammDocument(token, programmId, docData) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(docData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add document");
  console.log("✅ Document added:", data);
  return data;
}

async function getProgrammDocuments(token, programmId) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch documents");
  return Array.isArray(data.data) ? data.data : data;
}

async function updateProgrammDocument(token, programmId, docId, docData) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/documents/${docId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(docData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update document");
  console.log("✅ Document updated:", data);
  return data;
}

async function deleteProgrammDocument(token, programmId, docId) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/documents/${docId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete document");
  console.log("✅ Document deleted:", docId);
  return data;
}

// === CRUD STEPS ===
async function addStep(token, programmId, stepData) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/steps`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(stepData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add step");
  return data;
}

async function getSteps(programmId) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/steps`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to get steps");
  return data;
}

async function updateStep(token, programmId, stepId, stepData) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/steps/${stepId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(stepData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update step");
  return data;
}

async function deleteStep(token, programmId, stepId) {
  const res = await fetch(`${BASE_URL}/programm/${programmId}/steps/${stepId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete step");
  return data;
}

// -------------------- GET REFERRAL BY SLUG --------------------
async function getReferralBySlug(token, slug) {
  const res = await fetch(`${BASE_URL}/referrals/${slug}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch referral");
  return data.referral;
}

// -------------------- POSTS CRUD --------------------
async function getAllPosts(token) {
  const res = await fetch(`${BASE_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch posts");
  return data.data || data;
}

async function getPostsByType(token, type) {
  const res = await fetch(`${BASE_URL}/post?type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch posts by type");
  return data.data || data;
}

async function getPostById(token, id) {
  const res = await fetch(`${BASE_URL}/post/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch post by ID");
  return data.data || data;
}

async function getPostBySlug(token, slug) {
  const res = await fetch(`${BASE_URL}/post/slug/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch post by slug");
  return data.data || data;
}

async function createPost(token, postData) {
  const res = await fetch(`${BASE_URL}/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create post");
  console.log("✅ Post created:", data);
  return data;
}

async function updatePost(token, postId, postData) {
  const res = await fetch(`${BASE_URL}/post/update/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update post");
  console.log("✅ Post updated:", data);
  return data;
}

async function addSlugForPost(token, postId) {
  const res = await fetch(`${BASE_URL}/post/${postId}/add-slug`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add slug for post");
  console.log("✅ Slug added for post:", data);
  return data;
}

async function deletePost(token, postId) {
  const res = await fetch(`${BASE_URL}/post/remove/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete post");
  console.log("✅ Post deleted:", postId);
  return data;
}

async function deleteAllPosts(token) {
  const res = await fetch(`${BASE_URL}/posts/delete-all`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete all posts");
  console.log("✅ All posts deleted");
  return data;
}

//=======================
async function cleanUpSharedTable(token) {

  const res = await fetch(`${BASE_URL}/referrals/delete-empty-candidate`, {
    method:"DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data.message || "Failed to cleanUpSharedTable");
  console.log("Shared table cleaned");
  return data
}
// ====================== RUN Referrals TESTS ======================
async function runReferralTest() {
  try {
    const token = await getToken("recruiter"); // hoặc "admin"
    const slug = "fachinformatiker-system-integration"; // thử với slug thực tế

    console.log(`🚀 Fetching referral by slug: ${slug}`);
    const referral = await getReferralBySlug(token, slug);

    console.log("✅ Referral fetched successfully:");
    console.log(JSON.stringify(referral, null, 2));
  } catch (err) {
    console.error("❌ Referral test failed:", err.message);
  }
}

// ====================== RUN POSTS TEST ======================
async function runPostsTest() {
  try {
    const token = await getToken("admin");
    
    console.log("\n📝 ========== POSTS TEST ==========");

    // 1. Lấy tất cả posts để xem có posts nào không
    console.log("\n1. 📋 Getting all posts...");
    const allPosts = await getAllPosts(token);
    console.log(`✅ Found ${allPosts.length} posts`);

    // Hiển thị thông tin posts
    if (allPosts.length > 0) {
      console.log('📄 Existing posts:');
      allPosts.forEach((post, i) => {
        console.log(`  ${i + 1}. ${post.title} (ID: ${post._id}, Slug: ${post.slug || 'N/A'}, progId: ${post.progId || 'N/A'})`);
      });
    }

    // 2. Tạo post mới KHÔNG CẦN progId
    console.log("\n2. 📝 Creating new post WITHOUT progId...");
    const newPost = await createPost(token, {
      type: "success_story",
      title: "Bài viết test độc lập - " + new Date().toISOString(),
      thumbnail_url: "https://picsum.photos/400/300",
      content: "Nội dung bài viết test được tạo tự động không cần programm...",
      // KHÔNG có progId - post độc lập
      status: "published",
      tags: ["test", "independent", "slug"],
      excerpt: "Đây là bài viết test độc lập tự động tạo ra"
    });
    console.log("✅ New post created:", newPost.data?.title);
    console.log("📝 Post slug:", newPost.data?.slug);

    // 3. Lấy post bằng slug
    if (newPost.data?.slug) {
      console.log(`\n3. 🔗 Getting post by slug: ${newPost.data.slug}`);
      const postBySlug = await getPostBySlug(token, newPost.data.slug);
      console.log("✅ Post by slug:", postBySlug.title);
    }

    // 4. Lấy posts theo type
    console.log("\n4. 🏷️ Getting posts by type: blog");
    const blogPosts = await getPostsByType(token, "success_story");
    console.log(`✅ Found ${blogPosts.length} blog posts`);

    // 5. Test add slug cho post cũ (nếu có post không có slug)
    console.log("\n5. 🏷️ Checking and adding slugs for existing posts...");
    const postsWithoutSlug = allPosts.filter(post => !post.slug);
    if (postsWithoutSlug.length > 0) {
      console.log(`ℹ️ Found ${postsWithoutSlug.length} posts without slug`);
      for (let i = 0; i < Math.min(postsWithoutSlug.length, 2); i++) {
        const post = postsWithoutSlug[i];
        console.log(`  Adding slug for: ${post.title}`);
        await addSlugForPost(token, post._id);
      }
    } else {
      console.log("✅ All posts already have slugs");
    }

    // 6. Cập nhật post vừa tạo
    console.log("\n6. ✏️ Updating the test post...");
    if (newPost.data?._id) {
      const updatedPost = await updatePost(token, newPost.data._id, {
        title: "Bài viết test đã được cập nhật - " + new Date().toISOString(),
        content: "Nội dung đã được cập nhật vào lúc: " + new Date().toLocaleString(),
        tags: ["test", "updated", "independent"],
        featured: true
      });
      console.log("✅ Post updated:", updatedPost.data?.title);
    }

    // 7. Kiểm tra lại danh sách posts sau khi thay đổi
    console.log("\n7. 📋 Getting updated posts list...");
    const updatedPosts = await getAllPosts(token);
    console.log(`✅ Now have ${updatedPosts.length} posts total`);

    // 8. Xóa post test (tùy chọn - comment nếu muốn giữ post test)
    console.log("\n8. 🗑️ Cleaning up test post...");
    if (newPost.data?._id) {
      await deletePost(token, newPost.data._id);
      console.log("✅ Test post deleted");
    }

    console.log("\n🎉 All posts tests completed successfully!");

  } catch (err) {
    console.error("❌ Posts test failed:", err.message);
  }
}

// ====================== MAIN TEST RUNNER ======================
async function runAllTests() {
  console.log("🚀 Starting all tests...\n");

  // Chạy test referral
  // await runReferralTest();

  // Chạy test posts
  // await runPostsTest();

  const admin = await getToken("admin");
  console.log("✅ Token retrieved:", admin);
  const res = await cleanUpSharedTable(admin);
  console.log(res);

  console.log("\n🎉 All tests completed!");
}

// Chạy tất cả tests
runAllTests().catch(console.error);

// Hoặc chạy riêng lẻ nếu muốn
// runReferralTest();
// runPostsTest();