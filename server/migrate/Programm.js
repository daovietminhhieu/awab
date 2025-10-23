// ============================
// 🎯 Mock Data Sources (Expanded)
// ============================
const title = [
    "Full-Stack Web Development Internship",
    "AI Research & Development Assistant",
    "Global Business Analysis Program",
    "Advanced Data Science Bootcamp",
    "Mechanical Systems Engineering Training",
    "Cybersecurity & Ethical Hacking Internship",
    "Digital Marketing Accelerator Program",
    "Software Quality Assurance Training",
  ];
  
  const company = [
    "TechCorp Solutions",
    "AI Innovations Lab",
    "BizSolutions Group",
    "DataMinds Analytics",
    "MechaWorks Ltd.",
    "CyberNet Global",
    "NextGen Systems",
  ];
  
  const logoLink = [
    "https://example.com/logo1.png",
    "https://example.com/logo2.png",
    "https://example.com/logo3.png",
    "https://example.com/logo4.png",
    "https://example.com/logo5.png",
  ];
  
  const type = ["Internship", "Full-time", "Part-time", "Contract", "Remote"];
  const degrees = ["Bachelor", "Master", "PhD"];
  const duration = ["3 months", "6 months", "12 months", "24 months"];
  const land = ["Vietnam", "Japan", "USA", "Germany", "Singapore", "Canada", "South Korea"];
  const fee = ["Free", "1000 USD", "1500 USD", "2000 USD", "3000 USD"];
  const expected_salary = ["1000 USD", "1500 USD", "2000 USD", "2500 USD", "3000 USD"];
  const deadline = ["2025-12-01", "2025-12-15", "2025-12-31", "2026-01-15"];
  const vacancies = ["5", "10", "20", "50"];
  const hired = ["2", "5", "10", "15"];
  const bonus = ["100 USD", "200 USD", "500 USD"];
  const is_active = ["true", "false"];
  const completed = ["true", "false"];
  const public_day = ["2025-01-01", "2025-06-01", "2025-09-01"];
  const type_category = ["job", "studium"];
  const number_of_comments = ["0", "5", "10", "20", "50"];
  
  // ============================
  // 🧾 Rich Text Details
  // ============================
  const details = [
    {
      overview: "An immersive internship offering real-world projects with guidance from senior developers. Participants will build scalable web applications using React, Node.js, and MongoDB.",
      other: "Weekly tech talks, mentorship sessions, and certificate upon completion.",
    },
    {
      overview: "An intensive AI research assistant program focusing on NLP, computer vision, and data modeling with Python and TensorFlow.",
      other: "Includes collaboration with PhD researchers and opportunities to publish academic papers.",
    },
    {
      overview: "A business-focused program covering financial modeling, data-driven decision making, and strategy consulting fundamentals.",
      other: "Guest lectures by industry experts and case studies from Fortune 500 companies.",
    },
    {
      overview: "A hands-on training bootcamp in data science. Students will master Python, pandas, SQL, and build predictive models on real datasets.",
      other: "Final project presentation to partner companies for potential job placement.",
    },
    {
      overview: "Comprehensive engineering program covering mechanical design, simulation, and robotics automation using AutoCAD and SolidWorks.",
      other: "Includes plant visits, safety training, and real-time machinery diagnostics practice.",
    },
  ];
  
  const requirement = [
    { age: "Under 30", health: "Good", education: "Bachelor", certificate: "English B2 or equivalent" },
    { age: "Under 35", health: "Excellent", education: "Master", certificate: "JLPT N2 or IELTS 6.5" },
    { age: "Under 40", health: "Normal", education: "PhD", certificate: "TOEFL iBT 90+" },
    { age: "18-28", health: "Good", education: "Bachelor", certificate: "No specific requirement" },
  ];
  
  const benefit = [
    "Free accommodation and monthly travel allowance",
    "Comprehensive health insurance and 15 days of paid leave",
    "Mentorship from senior professionals in the field",
    "Access to exclusive workshops and networking events",
    "Opportunity for full-time job offer upon completion",
  ];
  
  const reviewText = [
    "Amazing opportunity! I learned so much about teamwork and real-world development practices.",
    "Great mentors and well-structured training — totally worth it!",
    "It was challenging at first, but the experience boosted my confidence immensely.",
    "The company culture was fantastic, and I made friends for life.",
    "One of the best learning experiences I’ve had. Would definitely recommend!",
  ];
  
  const qa = [
    "Q: Do I need prior experience? A: Basic knowledge is enough, we provide full guidance.",
    "Q: Is accommodation provided? A: Yes, it’s either free or partially subsidized.",
    "Q: What are the working hours? A: Usually 8 hours per day, 5 days a week.",
    "Q: Can I get a full-time offer? A: Yes, top performers often receive job offers.",
    "Q: Is remote participation allowed? A: Depends on the program type and region.",
  ];
  
  const videos = [
    "https://example.com/video1.mp4",
    "https://example.com/video2.mp4",
    "https://example.com/video3.mp4",
  ];
  
  // ============================
  // 🧩 Utility Functions
  // ============================
  const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  // ============================
  // 🏗️ Object Generators
  // ============================
  
  // 🎯 Steps mock
  function makeSteps() {
    const stepNames = ["Application Submitted", "Interview", "Offer Received", "Training Completed"];
    return stepNames.map((name, i) => ({
      step: i + 1,
      name,
      bonus: randomInt(50, 300),
      status: randomFromArray(["pending", "in_review", "completed", "rejected"]),
      requestedBy: null,
      approvedBy: null,
      updatedAt: new Date(),
    }));
  }
  
  // 🎯 Review mock (tạo mảng review)
  function makeReview() {
    const numReviews = randomInt(1, 3); // mỗi chương trình có 1-3 review
    const reviews = [];
    for (let i = 0; i < numReviews; i++) {
      reviews.push({
        user: null,
        rate: randomInt(3, 5),
        content: randomFromArray(reviewText),
        createdAt: new Date(),
      });
    }
    return reviews;
  }
  
  // 🎯 Main Programm mock
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
      bonus: randomFromArray(bonus),
      vacancies: randomFromArray(vacancies),
      hired: randomFromArray(hired),
      details: randomFromArray(details),
      requirement: randomFromArray(requirement),
      benefit: randomFromArray(benefit),
      reviews: makeReview(),
      qa: randomFromArray(qa),
      videos: randomFromArray(videos),
      number_of_comments: randomFromArray(number_of_comments),
      is_active: randomFromArray(is_active),
      completed: randomFromArray(completed),
      public_day: randomFromArray(public_day),
      type_category: randomFromArray(type_category),
      steps: makeSteps(),
      partner: null,
      referrals: null,
    };
  }
  
  // 🎯 Create list
  function makeProgrammList(len = 10) {
    return Array.from({ length: len }, makeProgramm);
  }
  
  // ============================
  // 📦 Exports
  // ============================
  module.exports = {
    makeProgramm,
    makeProgrammList,
  };
  