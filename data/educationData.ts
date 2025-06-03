export interface Education {
  id: number
  institution: string
  degree: string
  duration: string
  grade: string
  description: string
  image: string
}

export const education: Education[] = [
  {
    id: 1,
    institution: "Srinivasa Ramanujan Institute of Technology, Anantapur",
    degree: "Bachelor of Technology - BTech, Electrical and Electronics Engineering",
    duration: "Aug 2019 – May 2023",
    grade: "7.12 CGPA",
    description: "Completed 8 semesters, developed technical and problem-solving skills in EEE.",
    image: "https://th.bing.com/th/id/OIP.EZIradY4B_wPzEs48Sn_WQAAAA?pid=ImgDet&w=208&h=208&c=7&dpr=1.3"
  },
  {
    id: 2,

    institution: "Narayana Junior College, Anantapur",
    degree: "Class 12, Science Stream (MPC)",
    duration: "Apr 2017 – Apr 2019",
    grade: "88.2%",
    description: "Completed Intermediate with a focus on Mathematics, Physics, and Chemistry.",
    image: "https://th.bing.com/th/id/OIP.n1BW9_hvbwvrchPqaetmiwAAAA?w=160&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
  },
  {
    id: 3,
    institution: "Keshava Reddy School, Anantapur",
    degree: "Class 10",
    duration: "Apr 2015 – Apr 2017",
    grade: "92.3%",
    description: "Completed high school with distinction in all subjects.",
    image: "https://seeklogo.com/images/K/keshava-reddy-school-logo-9242B0E50D-seeklogo.com.png"
  }
] 