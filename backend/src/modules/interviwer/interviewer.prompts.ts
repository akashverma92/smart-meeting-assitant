// Rule-based prompts for the interviewer module
export const WARMUP_QUESTIONS = [
  "Hi! Before we begin, can you briefly introduce yourself?",
  "Can you tell me a bit about your background and what you enjoy working on?",
  "What made you interested in this role?",
];

export const HR_QUESTIONS = [
  "What is your greatest strength and how do you use it in your work?",
  "Describe a time you had a conflict with a team member. How did you handle it?",
  "Where do you see yourself in 3-5 years?",
  "Why should we hire you over other candidates?",
];

export const TECHNICAL_QUESTION_BANK: Record<string, string[]> = {
  javascript: [
    "Explain the difference between 'var', 'let', and 'const'.",
    "What is the event loop in JavaScript and how does it work?",
    "Explain the concept of closures with an example.",
    "What are Promises and how do they differ from callbacks?",
  ],
  typescript: [
    "What is the difference between 'interface' and 'type' in TypeScript?",
    "Explain the concept of Generics in TypeScript.",
    "What are the benefits of using TypeScript over JavaScript?",
  ],
  react: [
    "What is the Virtual DOM and how does it improve performance?",
    "Explain the checkout process of `useEffect` and its dependency array.",
    "What is the difference between state and props?",
    "Explain the concept of Context API vs Redux.",
  ],
  node: [
    "How does Node.js handle concurrency?",
    "Explain the difference between 'require' and 'import'.",
    "What is middleware in Express.js?",
    "How does the cluster module work in Node.js?",
  ],
  java: [
    "What are the four pillars of Object-Oriented Programming?",
    "Explain the difference between an Interface and an Abstract Class.",
    "How does Garbage Collection work in Java?",
    "What makes Java platform-independent?",
  ],
  python: [
    "What are decorators in Python?",
    "Explain the difference between list and tuple.",
    "How is memory managed in Python?",
    "What is the Global Interpreter Lock (GIL)?",
  ],
  sql: [
    "What is the difference between inner join and outer join?",
    "Explain ACID properties in databases.",
    "What is indexing and how does it improve query performance?",
  ],
  mongodb: [
    "What is the difference between SQL and NoSQL databases?",
    "Explain the concept of Aggregation Pipeline in MongoDB.",
    "How does indexing work in MongoDB?",
  ],
  html: [
    "What are semantic tags in HTML5?",
    "Explain the difference between localStorage, sessionStorage, and cookies.",
  ],
  css: [
    "What is the Box Model in CSS?",
    "Explain the difference between Flexbox and Grid.",
    "What is the 'z-index' property and how does it work?",
  ],
  git: [
    "What is the difference between git merge and git rebase?",
    "Explain the git flow workflow.",
  ],
  default: [
    "Can you describe your development workflow?",
    "How do you keep yourself updated with the latest technologies?",
    "Describe a challenging bug you fixed recently.",
  ]
};
