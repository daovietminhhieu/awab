const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load biến môi trường

const SUPABASE_URL = process.env.SUPABASE_URL;   // https://xxxx.supabase.co
const SUPABASE_KEY = process.env.SUPABASE_KEY;   // anon hoặc service_role key

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase environment variables!");
    console.error("SUPABASE_URL:", SUPABASE_URL);
    console.error("SUPABASE_KEY exists:", !!SUPABASE_KEY);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  // 👇 Thêm dòng này để export cho controller sử dụng
  module.exports = { supabase };

