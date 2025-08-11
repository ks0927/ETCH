export type ProjectTechEnum =
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

export interface ProejctTechData {
  stack: ProjectTechEnum;
  text: string;
}

export const ProejctWriteTechData: ProejctTechData[] = [
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
  stack: item as ProjectTechEnum,
  text: item,
}));
