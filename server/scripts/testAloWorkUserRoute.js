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

async function resetPotentials(token, role) {
  console.log(`♻️ Testing resetPotentials as ${role}...`);
  const res = await fetch(`${BASE_URL}/reset-potentials`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `❌ ${role} failed to reset potentials: ${res.status} ${data.message}`
    );
  }

  if (!data.success) {
    throw new Error(`❌ ${role} response invalid: ${JSON.stringify(data)}`);
  }

  console.log(
    `✅ ${role} reset potentials successfully: ${data.message || "OK"}`
  );
  return data;
}

async function deleteReferralsWithNullCandidate(token) {
  console.log("🗑️ Deleting referrals with null candidate...");
  const res = await fetch(`${BASE_URL}/referrals/delete-empty-candidate`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete referrals with null candidate");
  }
  console.log("✅ Deleted referrals with null candidate:", data.message);
  return data;
}

async function getReferrals(token) {
  console.log("🔍 Fetching referrals...");
  try {
    const res = await fetch(`${BASE_URL}/my-referrals`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error(`Unauthorized (status ${res.status}) - invalid token or permissions`);
    }

    // try to parse JSON safely
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      throw new Error(`Failed to parse JSON response: ${parseErr.message}`);
    }

    if (!res.ok) {
      // If server returned an error object, include its message
      const serverMsg = data && data.message ? data.message : JSON.stringify(data);
      throw new Error(`Failed to fetch referrals: ${serverMsg}`);
    }

    // If the API returns data.data as an array, return that; otherwise return whole payload
    if (data && Array.isArray(data.data)) {
      console.log(`✅ Fetched ${data.data.length} referrals`);
      return data.data;
    }

    console.log("✅ Fetched referrals (non-array payload)");
    return data;
  } catch (err) {
    console.error("getReferrals error:", err.message || err);
    throw err;
  }
}

// Reset referral list
async function resetReferrals(token) {
  console.log("♻️ Resetting all referrals...");
  const res = await fetch(`${BASE_URL}/reset-referrals`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to reset referrals");
  }

  console.log("✅ Referrals reset successfully:", data.message);
  return data;
}


// =============================
// 🧪 TEST FLOW
// =============================
async function runTests() {
  try {
    console.log("🚀 Running Reset Potentials API tests...\n");

    // --- ADMIN TEST ---
    const adminToken = await getToken("admin");
    // await resetPotentials(adminToken, "admin");

    // --- RECRUITER TEST ---
    const recruiterToken = await getToken("recruiter");
    // await resetPotentials(recruiterToken, "recruiter");
    const data = await getReferrals(adminToken);
    // console.log("Referrals data:", data);
    // console.log("\n✅ All resetPotentials tests passed successfully!");
    await deleteReferralsWithNullCandidate(adminToken);

  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

runTests();
