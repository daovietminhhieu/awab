const title = [
    "Web Development Internship",
    "AI Research Assistant",
    "Business Analyst Program",
    "Data Science Bootcamp",
    "Mechanical Engineering Training"
];

const company = [
    "TechCorp",
    "AI Innovations",
    "BizSolutions",
    "DataMinds",
    "MechaWorks"
];

const logoLink = [
    "https://example.com/logo1.png",
    "https://example.com/logo2.png",
    "https://example.com/logo3.png",
    "https://example.com/logo4.png",
    "https://example.com/logo5.png"
];

const type = ["Internship", "Full-time", "Part-time", "Contract"];
const degrees = ["Bachelor", "Master", "PhD"];
const duration = ["3 months", "6 months", "12 months", "24 months"];
const land = ["Vietnam", "Japan", "USA", "Germany", "Singapore"];
const fee = ["Free", "1000 USD", "2000 USD", "3000 USD"];
const expected_salary = [
    "1000 USD",
    "1500 USD",
    "2000 USD",
    "2500 USD",
    "3000 USD"
];

const deadline = [
    "2025-12-01",
    "2025-12-15",
    "2025-12-31",
    "2026-01-15"
];

const vacancies = ["5", "10", "20", "50"];
const details = [
{
    overview: "This program provides hands-on experience in web technologies.",
    other: "Includes workshops and mentorship."
},
{
    overview: "Research-focused program in AI and machine learning.",
    other: "Suitable for graduates with coding background."
}
];

const requirement = [
    { age: "Under 30", health: "Good", education: "Bachelor", certificate: "English B2" },
    { age: "Under 35", health: "Excellent", education: "Master", certificate: "JLPT N2" },
    { age: "Under 40", health: "Normal", education: "PhD", certificate: "TOEFL 90+" }
];

const benefit = [
    "Accommodation support and travel allowance",
    "Health insurance and annual leave",
    "Career mentorship and job placement support"
];

const review = [
    "Great program, learned a lot!",
    "Challenging but rewarding experience",
    "Helped me land my dream job"
];

const qa = [
    "Q: Do I need prior experience? A: Basic knowledge is enough.",
    "Q: Is accommodation provided? A: Yes, partially supported."
];

const videos = [
    "https://example.com/video1.mp4",
    "https://example.com/video2.mp4"
];

const number_of_comments = ["0", "5", "10", "20"];
const completed = ["true", "false"];
const public_day = ["2025-01-01", "2025-06-01", "2025-09-01"];
const type_category = ["job", "studium"];
// 🔨 Hàm tạo 1 object Programm mock từ tham số programm
function makeProgramm() {
    return {
      title: randomFromArray(title),
      company: randomFromArray(company),
      logoL: randomFromArray(logoLink),
      type: randomFromArray(type),
      degrees: randomFromArray(degrees),
      duration: randomFromArray(duration),
      land: randomFromArray(land),
      fee: randomFromArray(fee),
      expected_salary: randomFromArray(expected_salary),
      deadline: randomFromArray(deadline),
      vacancies: randomFromArray(vacancies),
      details: randomFromArray(details),
      requirement: randomFromArray(requirement),
      benefit: randomFromArray(benefit),
      review: randomFromArray(review),
      qa: randomFromArray(qa),
      videos: randomFromArray(videos),
      number_of_comments: randomFromArray(number_of_comments),
      completed: randomFromArray(completed),
      public_day: randomFromArray(public_day),
      type_category: randomFromArray(type_category),
    };
  }
  
  function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  

  function makeProgrammList(len = 5) {
    const list = [];
    for (let i = 0; i < len; i++) {
      list.push(makeProgramm());
    }
    console.log(list);
    return list;
  }

  module.exports = { makeProgrammList, makeProgramm };