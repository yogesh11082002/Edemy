

export type Course = {
  id: string;
  title: string;
  description: string;
  summary: string;
  instructor?: Instructor;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  imageHint: string;
  language: string;
  duration: string;
  lessons?: Lesson[];
  curriculum?: Section[];
  enrolledStudents?: number;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = { 
  title: string; 
  duration?: string, 
  videoUrl: string 
};

export type Section = {
  title: string;
  lessons: Lesson[];
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

export type EnrolledCourse = {
    id: string;
    courseId: string;
    enrolledAt: string;
    progress: number;
    completed: boolean;
    rated?: number;
}
