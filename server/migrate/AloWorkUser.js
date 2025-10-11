// Fake data pools
const names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
const birth_days = ["1990-01-01", "1995-05-20", "2000-12-15", "1988-07-30"];
const sex = ["Male", "Female", "Other"];
const marital_status = ["Single", "Married", "Divorced"];
const emails = [
  "alice@example.com",
  "bob@example.com",
  "charlie@example.com",
  "diana@example.com",
];
const roles = ["Student", "Employee", "Manager", "Admin"];
const passwords = ["123456", "password", "qwerty", "letmein"];
const banks = ["ABC Bank", "XYZ Bank", "Global Bank", "City Bank"];
const balances = [1000, 5000, 10000, 20000];
const avatarImages = [
  "https://example.com/avatar1.png",
  "https://example.com/avatar2.png",
  "https://example.com/avatar3.png",
];
const my_programm = [
  "Web Development Internship",
  "AI Research Assistant",
  "Business Analyst Program",
];

// 🔨 Hàm tạo 1 object User mock
function makeUser() {
  return {
    name: randomFromArray(names),
    birth_day: randomFromArray(birth_days),
    sex: randomFromArray(sex),
    marital_status: randomFromArray(marital_status),
    email: randomFromArray(emails),
    role: randomFromArray(roles),
    password: randomFromArray(passwords),
    bank: randomFromArray(banks),
    balance: randomFromArray(balances),
    avatarImages: randomFromArray(avatarImages),
    my_programm: randomFromArray(my_programm),
  };
}

// 🔄 random helper
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 🔨 Hàm tạo list user mock
function makeUserList(len = 5) {
  const list = [];
  for (let i = 0; i < len; i++) {
    list.push(makeUser());
  }
  console.log(list);
  return list;
}

module.exports = { makeUserList };
