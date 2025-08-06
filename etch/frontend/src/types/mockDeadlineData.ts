import type { DeadlineItemProps } from "../components/atoms/listItem";

export const mockDeadlines: DeadlineItemProps[] = [
  {
    id: 'deadline1',
    company: '네이버',
    position: '프론트엔드 개발자',
    dueDate: '2024-02-15',
    daysLeft: 2,
    urgency: 'urgent'
  },
  {
    id: 'deadline2',
    company: '라인',
    position: 'React 개발자',
    dueDate: '2024-02-20',
    daysLeft: 7,
    urgency: 'warning'
  }
];