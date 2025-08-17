export const mockApplicationStats = [
  {
    type: "stats" as const,
    title: "예정",
    value: 2,
    icon: "🕒",
    color: "text-blue-600"
  },
  {
    type: "stats" as const,
    title: "진행중",
    value: 3,
    icon: "⚡",
    color: "text-yellow-600"
  },
  {
    type: "stats" as const,
    title: "합격",
    value: 1,
    icon: "✅",
    color: "text-green-600"
  },
  {
    type: "stats" as const,
    title: "불합격",
    value: 1,
    icon: "❌",
    color: "text-red-600"
  }
];