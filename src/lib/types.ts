export type Course = {
  id: string;
  title: string;
  description: string;
  summary: string;
  instructor: Instructor;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  imageHint: string;
  language: string;
  duration: string;
  lessons: { title: string; duration: string }[];
  enrolledStudents?: number;
};

export type Instructor = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  rating: number;
  studentCount: number;
  courseCount: number;
};

export type Student = {
  id: string;
  name: string;
  avatar: string;
};

export type Review = {
  id: string;
  student: Student;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  name:string;
  role: string;
  avatar: string;
  quote: string;
}
