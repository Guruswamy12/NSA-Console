export interface Category {
  _id: string;
  name: string;
  parentId: { _id: string; name: string } | null;
  createdAt: string;
}

export interface BlogSection {
  title: string;
  content: string;
  cta: boolean;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface Blog {
  _id: string;
  title: string;
  h2: string;
  excerpt: string;
  initialContent: string;
  image: string | null;
  altTag: string;
  categoryId: { _id: string; name: string } | null;
  status: string;
  authorName: string;
  keywords: string;
  votes: number;
  createdAt: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

export interface Permission {
  _id: string;
  name: string;
  description: string;
  module: string;
  createdAt: string;
}

export const MOCK_USER = {
  id: "u1",
  name: "Admin User",
  email: "admin@northstar.com",
  role: "Admin",
};

export const MOCK_TOKEN = "mock-token-123";

export const MOCK_STATS = {
  totalUsers: 12,
  totalBlogs: 48,
  activeBlogs: 35,
  categoriesCount: 8,
  trends: {
    newBlogsLast30Days: 6,
    newUsersLast30Days: 2,
  },
};

export const MOCK_CATEGORIES: Category[] = [
  {
    _id: "c1",
    name: "Technology",
    parentId: null,
    createdAt: "2024-11-01T10:00:00Z",
  },
  {
    _id: "c2",
    name: "Education",
    parentId: null,
    createdAt: "2024-11-05T10:00:00Z",
  },
  {
    _id: "c3",
    name: "Career Tips",
    parentId: null,
    createdAt: "2024-11-10T10:00:00Z",
  },
  {
    _id: "c4",
    name: "Web Dev",
    parentId: { _id: "c1", name: "Technology" },
    createdAt: "2024-12-01T10:00:00Z",
  },
  {
    _id: "c5",
    name: "Online Learning",
    parentId: { _id: "c2", name: "Education" },
    createdAt: "2024-12-10T10:00:00Z",
  },
  {
    _id: "c6",
    name: "AI & ML",
    parentId: { _id: "c1", name: "Technology" },
    createdAt: "2025-01-05T10:00:00Z",
  },
  {
    _id: "c7",
    name: "Resume Writing",
    parentId: { _id: "c3", name: "Career Tips" },
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    _id: "c8",
    name: "Interview Prep",
    parentId: { _id: "c3", name: "Career Tips" },
    createdAt: "2025-02-01T10:00:00Z",
  },
];

const today = new Date();
const daysAgo = (n: number): string =>
  new Date(today.getTime() - n * 86400000).toISOString();

export const MOCK_BLOGS: Blog[] = [
  {
    _id: "b1",
    title: "Getting Started with React 19",
    h2: "Everything you need to know about the latest React release",
    excerpt:
      "React 19 brings exciting new features including the compiler, server components, and more.",
    initialContent:
      "React 19 is a major release that introduces several groundbreaking features...",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    altTag: "React logo on a dark background",
    categoryId: { _id: "c1", name: "Technology" },
    status: "APPROVED",
    authorName: "NorthStar Academy",
    keywords: "react, javascript, frontend",
    votes: 142,
    createdAt: daysAgo(1),
    sections: [
      {
        title: "What's New",
        content:
          "React 19 introduces the React Compiler, which automatically optimizes your components.",
        cta: false,
      },
      {
        title: "Server Components",
        content:
          "Server Components allow you to render components on the server, reducing bundle size.",
        cta: true,
      },
    ],
    faqs: [
      {
        question: "Is React 19 backward compatible?",
        answer:
          "Yes, React 19 maintains backward compatibility with most React 18 code.",
      },
      {
        question: "When should I upgrade?",
        answer: "You can upgrade when your dependencies support React 19.",
      },
    ],
  },
  {
    _id: "b2",
    title: "Top 10 Career Tips for Software Engineers in 2025",
    h2: "Advance your career with these proven strategies",
    excerpt:
      "From networking to continuous learning, here are the top tips to grow your software engineering career.",
    initialContent:
      "The software engineering landscape is constantly evolving...",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    altTag: "Team of engineers collaborating",
    categoryId: { _id: "c3", name: "Career Tips" },
    status: "APPROVED",
    authorName: "NorthStar Academy",
    keywords: "career, software engineer, tips",
    votes: 98,
    createdAt: daysAgo(2),
    sections: [],
    faqs: [],
  },
  {
    _id: "b3",
    title: "Introduction to Machine Learning with Python",
    h2: "A beginner's guide to ML concepts",
    excerpt:
      "Learn the fundamentals of machine learning using Python and popular libraries.",
    initialContent: "Machine learning is transforming every industry...",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    altTag: "Python code on a screen",
    categoryId: { _id: "c6", name: "AI & ML" },
    status: "DRAFT",
    authorName: "NorthStar Academy",
    keywords: "machine learning, python, AI",
    votes: 0,
    createdAt: daysAgo(3),
    sections: [],
    faqs: [],
  },
  {
    _id: "b4",
    title: "How to Ace Your Technical Interview",
    h2: "Preparation strategies that actually work",
    excerpt:
      "Practical advice on data structures, algorithms, and behavioral questions.",
    initialContent:
      "Technical interviews can be daunting, but with the right preparation...",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    altTag: "Person in a job interview",
    categoryId: { _id: "c8", name: "Interview Prep" },
    status: "APPROVED",
    authorName: "NorthStar Academy",
    keywords: "interview, coding, algorithms",
    votes: 211,
    createdAt: daysAgo(4),
    sections: [],
    faqs: [],
  },
  {
    _id: "b5",
    title: "Building Your First Full-Stack App with Next.js",
    h2: "From zero to deployed in one weekend",
    excerpt:
      "Step-by-step guide to building and deploying a full-stack application.",
    initialContent:
      "Next.js has become the go-to framework for full-stack React applications...",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
    altTag: "Code editor with Next.js project",
    categoryId: { _id: "c4", name: "Web Dev" },
    status: "APPROVED",
    authorName: "NorthStar Academy",
    keywords: "nextjs, fullstack, deployment",
    votes: 175,
    createdAt: daysAgo(5),
    sections: [],
    faqs: [],
  },
  {
    _id: "b6",
    title: "Writing a Resume That Gets Noticed",
    h2: "Stand out from hundreds of applicants",
    excerpt: "Tips and templates for crafting a resume that lands interviews.",
    initialContent: "Your resume is your first impression...",
    image: null,
    altTag: "",
    categoryId: { _id: "c7", name: "Resume Writing" },
    status: "DRAFT",
    authorName: "NorthStar Academy",
    keywords: "resume, job search, career",
    votes: 0,
    createdAt: daysAgo(6),
    sections: [],
    faqs: [],
  },
  {
    _id: "b7",
    title: "The Future of Online Learning Platforms",
    h2: "How EdTech is reshaping education",
    excerpt: "An in-depth look at trends shaping online education in 2025.",
    initialContent: "Online learning has exploded in popularity...",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop",
    altTag: "Student learning online",
    categoryId: { _id: "c5", name: "Online Learning" },
    status: "APPROVED",
    authorName: "NorthStar Academy",
    keywords: "edtech, online learning, education",
    votes: 63,
    createdAt: daysAgo(10),
    sections: [],
    faqs: [],
  },
];

export const MOCK_USERS: User[] = [
  {
    _id: "u1",
    name: "Admin User",
    email: "admin@northstar.com",
    role: "Admin",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "u2",
    name: "Sarah Johnson",
    email: "sarah@northstar.com",
    role: "Super Admin",
    createdAt: "2024-09-05T10:00:00Z",
  },
  {
    _id: "u3",
    name: "James Lee",
    email: "james@northstar.com",
    role: "Team Member",
    createdAt: "2024-10-12T10:00:00Z",
  },
  {
    _id: "u4",
    name: "Priya Sharma",
    email: "priya@northstar.com",
    role: "Team Member",
    createdAt: "2024-11-20T10:00:00Z",
  },
  {
    _id: "u5",
    name: "Carlos Rivera",
    email: "carlos@northstar.com",
    role: "Team Member",
    createdAt: "2025-01-08T10:00:00Z",
  },
  {
    _id: "u6",
    name: "Emily Chen",
    email: "emily@northstar.com",
    role: "Team Member",
    createdAt: "2025-02-14T10:00:00Z",
  },
];

export const MOCK_ROLES: Role[] = [
  {
    _id: "r1",
    name: "Super Admin",
    description: "Full access to all features and settings",
    permissions: [
      "manage_users",
      "manage_roles",
      "manage_blogs",
      "manage_categories",
      "view_analytics",
    ],
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "r2",
    name: "Admin",
    description: "Can manage content and team members",
    permissions: ["manage_blogs", "manage_categories", "view_users"],
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "r3",
    name: "Team Member",
    description: "Can create and edit own blog posts",
    permissions: ["create_blog", "edit_own_blog"],
    createdAt: "2024-09-01T10:00:00Z",
  },
];

export const MOCK_PERMISSIONS: Permission[] = [
  {
    _id: "p1",
    name: "manage_users",
    description: "Create, edit, and delete users",
    module: "Team",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "p2",
    name: "manage_roles",
    description: "Create and assign roles",
    module: "Team",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "p3",
    name: "manage_blogs",
    description: "Full control over all blog posts",
    module: "Content",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "p4",
    name: "manage_categories",
    description: "Create, edit, and delete categories",
    module: "Content",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "p5",
    name: "create_blog",
    description: "Create new blog posts",
    module: "Content",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "p6",
    name: "edit_own_blog",
    description: "Edit own blog posts only",
    module: "Content",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "p7",
    name: "view_users",
    description: "View team member list",
    module: "Team",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    _id: "p8",
    name: "view_analytics",
    description: "Access dashboard analytics",
    module: "Analytics",
    createdAt: "2024-09-01T10:00:00Z",
  },
];
