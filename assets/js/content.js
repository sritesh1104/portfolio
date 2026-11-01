/*
  ALL SITE CONTENT LIVES HERE.
  Both versions (Explore + Classic) read from this one file.
  Edit text here; you never need to touch the layout code.
  Anything marked TBC still needs details from Sritesh.
*/
window.SITE = {
  name: "Sritesh Naidu",
  first: "Sritesh",
  last: "Naidu",
  monogram: "SN",
  location: "Kuala Lumpur, MY",
  timezone: "Asia/Kuala_Lumpur",

  // DRAFT intro. We will rewrite this together.
  intro: {
    kicker: "Hello, I'm",
    line: "Builder at heart. I blend data, creativity and AI into tools people actually use."
  },

  pillars: [
    {
      title: "Builder",
      script: "mindset",
      text: "I start from a blank page and ship working tools. Map the problem, weigh impact against effort, then build.",
      tags: ["From scratch", "End to end", "Shipped, not slides"]
    },
    {
      title: "Data",
      script: "roots",
      text: "Trained as an actuary. Reserving, valuation and analytics taught me to trust numbers only when I can defend them.",
      tags: ["Actuarial", "Analytics", "Insurance & Takaful"]
    },
    {
      title: "Creative + AI",
      script: "blend",
      text: "I use AI as a thinking partner and turn complex ideas into simple things people understand and use.",
      tags: ["LLM tooling", "Automation", "Clear communication"]
    }
  ],

  // Heading copy for the Work History section
  workIntro: {
    lead: "Same habit throughout: understand the problem properly, then build a solution.",
    edge: "What sets me apart is the mix:",
    formula: ["Actuarial & analytical thinking", "Builder & problem solver mindset", "AI expertise"]
  },

  work: [
    {
      role: "AI Lead (Solutions & Education)",
      org: "Lemon Sky Edge & Lemon Sky AI Academy",
      period: "Jul 2026 to now",
      points: [
        "Leading the company's internal and external AI adoption, and educating business professionals on using AI in their work.",
        "Certified HRD Corp Trainer.",
        "Trained 100+ business professionals on how to use AI effectively."
      ]
    },
    {
      role: "Actuarial Consultant",
      org: "Actuarial Partners Consulting",
      period: "Oct 2024 to Jul 2026",
      points: [
        "Specialised in the general insurance, reinsurance, takaful and retakaful industries, with claim exposure of RM100+ million.",
        "Reserving and valuation, plus business strategy work."
      ]
    },
    {
      role: "Data Analyst",
      org: "Primabumi Sdn Bhd",
      period: "Aug to Oct 2024",
      points: ["Three month digitalisation programme, finishing with a Board level presentation."]
    }
  ],

  projects: [
    {
      title: "Invoice Automation Bot",
      tagline: "Two days of manual work, now one.",
      text: "An AI automation bot that took over a finance team's heaviest manual job.",
      impact: "Cut the heaviest manual job from 2 days a week to 1",
      stat: { value: "50%", label: "less time on the heaviest manual job" },
      tags: ["AI automation", "Finance"],
      link: null
    },
    {
      title: "Triage AI",
      tagline: "Support tickets, sorted in seconds.",
      text: "Reads incoming support tickets and returns priority, category, sentiment, escalation risk, team routing and a draft first reply.",
      impact: "Triage time from 15 to 25 minutes down to under 3 seconds",
      stat: { value: "<3s", label: "per ticket, down from 15 to 25 minutes" },
      tags: ["Claude", "AI & LLM", "GitHub"],
      link: "https://sritesh1104.github.io/triageai/"
    },
    {
      title: "Onboarding AI",
      tagline: "New hire in, checklist out.",
      text: "Generates a role specific onboarding checklist the moment a new hire is added and assigns every task to the right owner with a deadline.",
      impact: "An 8 to 10 hour HR process turned into one click",
      stat: { value: "8-10h", label: "of HR work saved per new hire" },
      tags: ["Workflow automation", "System design", "HTML"],
      link: "https://sritesh1104.github.io/onboarding/"
    },
    {
      title: "AI Note Taker",
      tagline: "Talk. It files itself.",
      text: "Records voice on iPhone, transcribes it, summarises it with AI and files it into Notion automatically.",
      impact: "Productivity up 50%, zero manual transcription",
      stat: { value: "+50%", label: "productivity, zero manual transcription" },
      tags: ["iPhone", "ChatGPT", "Notion", "API"],
      link: null
    },
    {
      title: "ScrollSmart",
      tagline: "A feed that respects your time.",
      text: "An AI curated social feed that filters for high quality content to fight doom scrolling. Defined the quality framework, user flows and PRD, then prototyped it.",
      impact: "Around 80 to 90% less non educational content",
      stat: { value: "80-90%", label: "less non educational content" },
      tags: ["Lovable", "UI/UX", "PRD"],
      link: "https://scroll-smart-sn.lovable.app/"
    },
    {
      title: "AI Agent",
      tagline: "Ask it anything in the dataset.",
      text: "An AI agent trained on structured data that interprets questions and maps them to the right content, integrated into a web interface.",
      impact: "Instant, automated answers to user questions",
      stat: null, // TBC: need a number from Sritesh
      tags: ["Jotform AI", "Prompt engineering"],
      link: null
    },
    {
      title: "Customer Traffic Analysis",
      tagline: "Staff where the crowd is.",
      text: "Analysed 150+ operating days of traffic at a gaming centre to find peak hours and plan staffing, with documentation for long term use.",
      impact: "More efficient staff allocation at peak times",
      stat: { value: "150+", label: "operating days analysed to plan peak staffing" }, // scale, not outcome: swap if a result number exists
      tags: ["Data analysis", "Operations"],
      link: null
    },
    {
      title: "Financial Projection Model",
      tagline: "Every scenario, one model.",
      text: "Revenue, expense and cash flow forecasting across growth scenarios for a personal care product business, built from stakeholder requirements.",
      impact: "Multi scenario visibility for business planning",
      stat: null, // TBC: need a number from Sritesh
      tags: ["Excel", "Google Sheets", "Scenario modelling"],
      link: null
    },
    {
      title: "Budgeting Dashboard",
      tagline: "Budgets you can trust.",
      text: "A personal budgeting tool with interactive dashboards and built in validation checks.",
      impact: "Clearer budgeting and more reliable data",
      stat: null, // TBC: need a number from Sritesh
      tags: ["Dashboards", "Data validation"],
      link: null
    }
  ],

  // Newest first. Add a "period" (e.g. "2021 to 2024") to any school to show its years.
  education: [
    {
      school: "Sunway University",
      period: "2021 to 2024",
      qualification: "BSc (Hons) Actuarial Studies",
      honours: "First Class Honours",
      highlights: ["Passed 6 Institute and Faculty of Actuaries (IFoA) exams: CB1, CB2, CM1, CM2, CS1, CS2"],
      link: { href: "https://actuaries.org.uk/qualify/curriculum/", label: "Explore the IFoA curriculum" }
    },
    {
      school: "Sunway College",
      period: "2020 to 2021",
      qualification: "Foundation", // confirm programme name
      honours: "Perfect 4.00 CGPA",
      highlights: []
    },
    {
      school: "SMK Seri Ampang",
      period: "2015 to 2019",
      qualification: "Secondary school",
      honours: "Straight A's",
      note: "(Science Stream)",
      highlights: []
    },
    {
      school: "SJK(C) Chung Hwa (P)",
      period: "2010 to 2014",
      qualification: "Primary school",
      honours: "Distinction",
      highlights: []
    }
  ],

  // Any order: the site sorts these by year, latest first
  awards: [
    { title: "Valedictorian", org: "SMK Seri Ampang", year: "2019" },
    { title: "Most Outstanding SPM Results", org: "SMK Seri Ampang", year: "2019" },
    { title: "Academic & Exemption Excellence Award", org: "Sunway University", year: "2024" },
    { title: "Commitment to Service Award", org: "Sunway University", year: "2023" },
    { title: "Outstanding Leadership Award", org: "Sunway University", year: "2023" },
    { title: "Vice Chancellor's Subject Award (FIA September 2020 Intake)", org: "Sunway College", year: "2021" },
    { title: "Malaysian Astronomy Olympiad (MyAO) (Silver Award)", org: "Malaysian Astronomy Olympiad (MyAO)", year: "2019" },
    { title: "School's Best Sportsman of The Year & Co-curricular Award", org: "SMK Seri Ampang", year: "2019" },
    { title: "School's Top Student Award (Form 1, 2, 3, 4 & 5)", org: "SMK Seri Ampang", year: "2015 to 2019" },
    { title: "STAR Education Fund Scholarship", org: "Star Media Group", year: "2021 to 2024" }
  ],

  // Newest first
  extracurriculars: [
    { role: "Leader of GoT - SMS Community Homes", org: "School of Mathematical Sciences, Sunway University", period: "2021 to 2024" },
    { role: "Student Relations Director", org: "Sunway University Student Council", period: "2022 to 2023", text: "Elected student voice to management on welfare, facilities, safety, food and IT." },
    { role: "Vice President", org: "Sunway Indian Cultural Society", period: "2022 to 2023", text: "Set strategic goals, led the team and represented the society to other universities." },
    { role: "Corporate Relations Officer", org: "MASA Hackathon 2022", period: "2022", text: "Wrote the sponsorship proposal and secured sponsors, industry experts and judges." },
    { role: "Executive", org: "SUSC Student Relations", period: "2021 to 2022", text: "Ran welfare meetings and council events." },
    { role: "Vice President", org: "Sunway Foundation Programme Student Council (SFPSC)", period: "2020" },
    { role: "Head Prefect & School Captain", org: "SMK Seri Ampang", period: "2019" }
  ],

  community: [
    {
      title: "Head Basketball Coach",
      org: "SMK Seri Ampang",
      text: "Coaching taught me that a correct answer is worth nothing until the people acting on it understand it.",
      note: "Team first"
    },
    {
      title: "Gift of Tomorrow",
      org: "Community Homes, Pangsapuri Angsana USJ 1",
      text: "Led a volunteer programme teaching Maths to Standard 1 to 6 pupils. Built the yearly schedule, lesson plans and volunteer team.",
      note: "Team leader"
    },
    {
      title: "Mocktails for Good",
      org: "Community service with classmates",
      text: "Raised funds selling mocktails on campus for two children's homes, then spent the day teaching handcrafts and talking through study pathways.",
      note: "2 homes supported"
    }
  ],

  // On Stage: hosting, emcee and panel speaking. Add events here (any order, sorted latest first).
  // Example event:
  // { event: "Annual Dinner 2024", organiser: "Sunway University", role: "Emcee & Hosting", date: "Nov 2024",
  //   audience: "500+", photo: "assets/img/stage/annual-dinner.jpg", link: "https://..." }
  // role must be one of: "Emcee & Hosting", "Panel", "Business Events"
  stage: {
    intro: "I love being on stage. Hosting sharpens how I communicate: reading the room, engaging diverse audiences and getting ideas across clearly.",
    stats: [], // e.g. [{ value: "20+", label: "events hosted" }, { value: "3,000+", label: "audience reached" }]
    events: [],
    // Photo wall. Currently linked from my Wix site; swap for local files in assets/img/stage/ later.
    gallery: [
      "https://static.wixstatic.com/media/625046_77699028fa864901b66bc8b1f2f2b03c~mv2.jpg/v1/crop/x_54,y_40,w_390,h_389/fill/w_640,h_640,al_c,q_80,enc_auto/625046_77699028fa864901b66bc8b1f2f2b03c~mv2.jpg",
      "https://static.wixstatic.com/media/625046_9f9f698200884becb232e93969b6f149~mv2.jpg/v1/crop/x_102,y_114,w_596,h_596/fill/w_640,h_640,al_c,q_80,enc_auto/625046_9f9f698200884becb232e93969b6f149~mv2.jpg",
      "https://static.wixstatic.com/media/625046_4ff3ed5d41dd4645a62289ec3c05589f~mv2.jpg/v1/fill/w_640,h_640,al_c,q_80,enc_auto/625046_4ff3ed5d41dd4645a62289ec3c05589f~mv2.jpg",
      "https://static.wixstatic.com/media/625046_0ace900ff81b4227a2ec4203188585a1~mv2.jpg/v1/fill/w_640,h_640,al_c,q_80,enc_auto/625046_0ace900ff81b4227a2ec4203188585a1~mv2.jpg",
      "https://static.wixstatic.com/media/625046_07496723d8754e5d99137951eb98655c~mv2.jpeg/v1/crop/x_0,y_279,w_960,h_959/fill/w_640,h_640,al_c,q_80,enc_auto/625046_07496723d8754e5d99137951eb98655c~mv2.jpeg",
      "https://static.wixstatic.com/media/625046_5b12d1ba30754fa0a6a2daa2c3725a18~mv2.jpg/v1/crop/x_0,y_512,w_1053,h_1052/fill/w_640,h_640,al_c,q_80,enc_auto/625046_5b12d1ba30754fa0a6a2daa2c3725a18~mv2.jpg",
      "https://static.wixstatic.com/media/625046_8616352d38694347a4d7831a85eb1aa5~mv2.jpg/v1/crop/x_0,y_244,w_608,h_603/fill/w_640,h_640,al_c,q_80,enc_auto/625046_8616352d38694347a4d7831a85eb1aa5~mv2.jpg",
      "https://static.wixstatic.com/media/625046_436305808dce47bf821ec90923b3a7b1~mv2.jpg/v1/crop/x_0,y_141,w_828,h_821/fill/w_640,h_640,al_c,q_80,enc_auto/625046_436305808dce47bf821ec90923b3a7b1~mv2.jpg",
      "https://static.wixstatic.com/media/625046_ea36db96c66f4c7996e860c485f8e05d~mv2.jpg/v1/crop/x_0,y_87,w_828,h_821/fill/w_640,h_640,al_c,q_80,enc_auto/625046_ea36db96c66f4c7996e860c485f8e05d~mv2.jpg",
      "https://static.wixstatic.com/media/625046_22400da2ab6a47f8aed0b916e0dcf768~mv2.jpg/v1/fill/w_640,h_640,al_c,q_80,enc_auto/625046_22400da2ab6a47f8aed0b916e0dcf768~mv2.jpg"
    ]
  },

  // TBC: Sritesh to fill in each group. Example item:
  // { sport: "Basketball", event: "MSSD Selangor", result: "Gold", year: "2018" }
  sports: {
    intro: "Medals, trophies and the games behind them.",
    groups: [
      { name: "Open", items: [] },
      { name: "High School", items: [] },
      { name: "Secondary School", items: [] },
      { name: "Primary School", items: [] }
    ]
  },

  // Classic page only (paper explainer style).
  // Inside "record": ==text== gets the yellow highlighter, {{text}} gets the red marker circle.
  vox: {
    label: "Explained",
    headline: ["How One Actuary", "Ended Up Building"],
    headlineMark: "AI Tools",
    recordTitle: "Sritesh Naidu, in Short",
    record: [
      "I'm currently an ==AI Lead== and a ==HRD Corp Certified trainer==, where I build AI and automation solutions for businesses and teach professionals how to use AI in their daily work.",
      "Before this, I spent ==2 years== as an Actuarial Consultant across General Insurance and Takaful, breaking down business problems for insurers and turning complex data into decisions. Making judgement and decisions on portfolios with claim exposure of {{RM100+ million}}.",
      "What I enjoy most is ==finding where work gets stuck== 🔍 and fixing it, whether that means refining a workflow or building the solution from scratch."
    ],
    chapters: {
      numbers: { title: "The Numbers", sub: "About" },
      journey: { title: "The Journey", sub: "Work history" },
      build: { title: "The Build", sub: "Projects" },
      foundation: { title: "The Foundation", sub: "Education and awards" },
      people: { title: "Beyond the Desk", sub: "Community, stage and sports" },
      contact: { title: "Let's Get in Touch", sub: "Contact" }
    }
  },

  // Shown in the footer. Update this whenever you change the site.
  lastUpdated: "1 Nov 2026",

  // Classic shows these groups; Explore shows them as one flat list (see the end of this file)
  toolGroups: [
    { name: "AI Assistants", items: ["Claude", "ChatGPT", "Gemini"] },
    { name: "Build & Automate", items: ["Google Apps Script", "VBA", "GitHub", "Lovable"] },
    { name: "Data & Analysis", items: ["Excel", "SQL", "R"] },
    { name: "Communicate & Design", items: ["Word", "PowerPoint", "Notion", "Figma", "Miro"] }
  ],
  languages: ["English", "Mandarin", "Bahasa Malaysia", "Tamil"],

  contact: {
    email: "psritesh11@gmail.com",
    phone: "+60 11 2327 7130",
    phoneRaw: "+601123277130",
    linkedin: "https://www.linkedin.com/in/sritesh-naidu-punniya-seelan/",
    github: "https://github.com/sritesh1104"
  }
};
window.SITE.tools = window.SITE.toolGroups.flatMap((g) => g.items);
