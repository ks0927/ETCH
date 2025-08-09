export type ProjectStackEnum =
  | "HTML"
  | "CSS"
  | "JavaScript"
  | "TypeScript"
  | "React"
  | "Vue.js"
  | "Angular"
  | "jQuery"
  | "Bootstrap"
  | "Redux"
  | "Java"
  | "SpringBoot"
  | "Spring"
  | "Node.js"
  | "Python"
  | "Django"
  | "Flask"
  | "AWS"
  | "Docker"
  | "Kubernetes"
  | "MySQL"
  | "PostgreSQL"
  | "OracleDB"
  | "MSSQL"
  | "MongoDB"
  | "Redis"
  | "MariaDB"
  | "SQLite"
  | "SQL"
  | "NoSQL";

export interface ProejctStackData {
  stack: ProjectStackEnum;
  text: string;
}

export const ProejctWriteStackData: ProejctStackData[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Angular",
  "jQuery",
  "Bootstrap",
  "Redux",
  "Java",
  "SpringBoot",
  "Spring",
  "Node.js",
  "Python",
  "Django",
  "Flask",
  "AWS",
  "Docker",
  "Kubernetes",
  "MySQL",
  "PostgreSQL",
  "OracleDB",
  "MSSQL",
  "MongoDB",
  "Redis",
  "MariaDB",
  "SQLite",
  "SQL",
  "NoSQL",
].map((item) => ({
  stack: item as ProjectStackEnum,
  text: item,
}));
