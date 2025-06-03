export interface Testimonial {
  id: number
  name: string
  jobTitle: string
  company: string
  image: string
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    jobTitle: "Tech Lead",
    company: "TechCrunch India",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote: "Sajid is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are remarkable."
  },
  {
    id: 2,
    name: "Rahul Verma",
    jobTitle: "Senior Developer",
    company: "Infosys",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote: "Working with Sajid was a pleasure. His technical expertise and ability to communicate complex ideas clearly make him a valuable team member."
  },
  {
    id: 3,
    name: "Anita Desai",
    jobTitle: "Product Manager",
    company: "Flipkart",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    quote: "Sajid's innovative approach to problem-solving and dedication to quality have significantly contributed to our project's success."
  },
  {
    id: 4,
    name: "Karthik Iyer",
    jobTitle: "Full Stack Developer",
    company: "Zoho",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    quote: "I've been impressed by Sajid's ability to quickly adapt to new technologies and his commitment to writing clean, maintainable code."
  },
  {
    id: 5,
    name: "Neha Kapoor",
    jobTitle: "UI/UX Designer",
    company: "Paytm",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    quote: "Sajid's understanding of both design and development makes him an excellent collaborator. His work always exceeds expectations."
  },
  {
    id: 6,
    name: "Arjun Reddy",
    jobTitle: "Engineering Manager",
    company: "TCS",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    quote: "Sajid's technical leadership and mentorship skills have been invaluable to our team. He consistently delivers exceptional results."
  }
] 