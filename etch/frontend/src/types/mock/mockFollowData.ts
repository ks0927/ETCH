export interface UserData {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  isFollowing: boolean;
  canChat: boolean;
}

export const mockFollowers: UserData[] = [
  {
    id: "frontend-master",
    username: "frontend-master",
    displayName: "Frontend Master",
    email: "frontend@developer.com",
    isFollowing: false,
    canChat: false,
  },
  {
    id: "ui-ux-designer",
    username: "ui-ux-designer", 
    displayName: "UI/UX Designer",
    email: "design@creative.com",
    isFollowing: true,
    canChat: true,
  },
  {
    id: "fullstack-ninja",
    username: "fullstack-ninja",
    displayName: "Fullstack Ninja",
    email: "ninja@coding.com",
    isFollowing: true,
    canChat: true,
  },
  {
    id: "backend-guru",
    username: "backend-guru",
    displayName: "Backend Guru",
    email: "guru@server.com",
    isFollowing: true,
    canChat: true,
  },
  {
    id: "mobile-developer",
    username: "mobile-developer",
    displayName: "Mobile Developer",
    email: "mobile@apps.com",
    isFollowing: false,
    canChat: false,
  },
  {
    id: "devops-engineer",
    username: "devops-engineer",
    displayName: "DevOps Engineer", 
    email: "devops@infrastructure.com",
    isFollowing: true,
    canChat: true,
  },
  {
    id: "data-scientist",
    username: "data-scientist",
    displayName: "Data Scientist",
    email: "data@analytics.com",
    isFollowing: false,
    canChat: false,
  },
];

export const mockFollowing: UserData[] = [
  {
    id: "react-dev",
    username: "react-dev",
    displayName: "React Developer",
    email: "react@example.com",
    isFollowing: true,
    canChat: true,
  },
  {
    id: "typescript-pro",
    username: "typescript-pro",
    displayName: "TypeScript Pro",
    email: "ts@example.com",
    isFollowing: true,
    canChat: true,
  },
  {
    id: "nextjs-expert",
    username: "nextjs-expert",
    displayName: "Next.js Expert",
    email: "nextjs@example.com",
    isFollowing: true,
    canChat: true,
  },
];
