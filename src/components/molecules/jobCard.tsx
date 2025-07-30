import type { JobCard } from "../atoms/card";

export default function JobCard({ id, title }: JobCard) {
  return (
    <div>
      {id}와 {title}
    </div>
  );
}
