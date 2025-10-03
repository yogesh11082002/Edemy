import type { Course, Instructor, Review, Student, Testimonial } from './types';

export const instructors: Instructor[] = [
  {
    id: 'inst-1',
    name: 'John Doe',
    avatar: 'https://picsum.photos/seed/inst1/100/100',
    bio: 'Software Engineer with 10+ years of experience in web development. Passionate about teaching and building scalable applications.',
    rating: 4.8,
    studentCount: 12500,
    courseCount: 5
  },
  {
    id: 'inst-2',
    name: 'Jane Smith',
    avatar: 'https://picsum.photos/seed/inst2/100/100',
    bio: 'Award-winning UX/UI designer focused on creating beautiful and intuitive user experiences. Loves to share design principles with students.',
    rating: 4.9,
    studentCount: 25000,
    courseCount: 8
  }
];

export const students: Student[] = [
  { id: 'stu-1', name: 'Alice', avatar: 'https://picsum.photos/seed/stu1/100/100' },
  { id: 'stu-2', name: 'Bob', avatar: 'https://picsum.photos/seed/stu2/100/100' },
  { id: 'stu-3', name: 'Charlie', avatar: 'https://picsum.photos/seed/stu3/100/100' },
];

export const courses: Course[] = [
  {
    id: '1',
    title: 'The Complete 2024 Web Development Bootcamp',
    description: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!',
    summary: 'A comprehensive guide to modern web development.',
    instructor: instructors[0],
    category: 'Programming',
    level: 'All Levels',
    price: 84.99,
    rating: 4.7,
    reviewCount: 1258,
    imageUrl: 'https://picsum.photos/seed/course1/600/400',
    imageHint: 'programming code',
    language: 'English',
    duration: '62 hours',
    enrolledStudents: 2500,
    lessons: [
      { title: 'Introduction to HTML', duration: '30m' },
      { title: 'Advanced CSS and Sass', duration: '1h 15m' },
      { title: 'JavaScript for Beginners', duration: '2h' }
    ]
  },
  {
    id: '2',
    title: 'UI/UX Design Essentials: From Wireframe to Prototype',
    description: 'Learn to design beautiful and user-friendly interfaces. Master Figma and Adobe XD. No prior experience required.',
    summary: 'Master UI/UX design principles and tools.',
    instructor: instructors[1],
    category: 'Design',
    level: 'Beginner',
    price: 49.99,
    rating: 4.9,
    reviewCount: 3201,
    imageUrl: 'https://picsum.photos/seed/course2/600/400',
    imageHint: 'design desk',
    language: 'English',
    duration: '35.5 hours',
    lessons: [
      { title: 'The Design Thinking Process', duration: '45m' },
      { title: 'Wireframing in Figma', duration: '1h 30m' },
      { title: 'Creating High-Fidelity Prototypes', duration: '2h 15m' }
    ]
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass - 23 Courses in 1',
    description: 'Grow your business with our masterclass on digital marketing. Covers SEO, social media marketing, email marketing, and more.',
    summary: 'An all-in-one guide to digital marketing.',
    instructor: instructors[0],
    category: 'Business',
    level: 'Intermediate',
    price: 129.99,
    rating: 4.6,
    reviewCount: 890,
    imageUrl: 'https://picsum.photos/seed/course3/600/400',
    imageHint: 'business meeting',
    language: 'English',
    duration: '40.5 hours',
    lessons: [
        { title: 'SEO Fundamentals', duration: '1h' },
        { title: 'Social Media Strategy', duration: '1h 45m' },
        { title: 'Content Marketing', duration: '2h' }
    ]
  },
  {
    id: '4',
    title: 'Mindfulness and Meditation for a Stress-Free Life',
    description: 'Learn techniques to reduce stress, improve focus, and find inner peace through guided meditations and mindfulness exercises.',
    summary: 'Reduce stress with mindfulness techniques.',
    instructor: instructors[1],
    category: 'Personal Development',
    level: 'Beginner',
    price: 29.99,
    rating: 4.8,
    reviewCount: 1543,
    imageUrl: 'https://picsum.photos/seed/course4/600/400',
    imageHint: 'meditation nature',
    language: 'English',
    duration: '10 hours',
    lessons: [
        { title: 'Introduction to Mindfulness', duration: '20m' },
        { title: 'Guided Body Scan Meditation', duration: '30m' },
        { title: 'Mindful Breathing Techniques', duration: '25m' }
    ]
  },
  {
    id: '5',
    title: 'Photography Masterclass: A Complete Guide to Photography',
    description: 'Learn how to take stunning photos with any camera. Understand composition, lighting, and editing.',
    summary: 'Become a master photographer.',
    instructor: instructors[0],
    category: 'Photography',
    level: 'All Levels',
    price: 99.99,
    rating: 4.8,
    reviewCount: 2200,
    imageUrl: 'https://picsum.photos/seed/course5/600/400',
    imageHint: 'camera tripod',
    language: 'English',
    duration: '22 hours',
    lessons: [
        { title: 'Understanding Your Camera', duration: '1h' },
        { title: 'Composition Rules', duration: '1h 30m' },
        { title: 'Introduction to Lightroom', duration: '2h' }
    ]
  },
  {
    id: '6',
    title: 'The Ultimate Guide to Playing Guitar',
    description: 'Learn guitar from scratch. Covers chords, scales, and your favorite songs.',
    summary: 'Learn to play the guitar like a pro.',
    instructor: instructors[1],
    category: 'Music',
    level: 'Beginner',
    price: 79.99,
    rating: 4.7,
    reviewCount: 1800,
    imageUrl: 'https://picsum.photos/seed/course6/600/400',
    imageHint: 'playing guitar',
    language: 'English',
    duration: '30 hours',
    lessons: [
        { title: 'Your First Chords', duration: '45m' },
        { title: 'Strumming Patterns', duration: '1h' },
        { title: 'Playing Your First Song', duration: '1h 15m' }
    ]
  },
];

export const reviews: Review[] = [
  { id: 'rev-1', student: students[0], rating: 5, comment: 'This course was amazing! The instructor explained everything clearly and the projects were very helpful.', createdAt: '2 weeks ago' },
  { id: 'rev-2', student: students[1], rating: 5, comment: 'I learned so much about design principles. Highly recommend this to anyone starting in UI/UX.', createdAt: '1 month ago' },
  { id: 'rev-3', student: students[2], rating: 4, comment: 'Good course, but some parts were a bit fast. Overall, a great learning experience.', createdAt: '3 days ago' }
];

export const testimonials: Testimonial[] = [
  { id: 'test-1', name: 'Sarah Lee', role: 'Web Developer', avatar: 'https://picsum.photos/seed/user1/100/100', quote: 'LearnVerse has been a game-changer for my career. The courses are top-notch and the instructors are industry experts. I was able to land a better job after completing the Web Development Bootcamp.'},
  { id: 'test-2', name: 'David Chen', role: 'UX Designer', avatar: 'https://picsum.photos/seed/user2/100/100', quote: 'The flexibility to learn at my own pace was exactly what I needed. The community forums are also a great place to get help and connect with other learners. Highly recommended!'},
  { id: 'test-3', name: 'Emily Rodriguez', role: 'Marketing Manager', avatar: 'https://picsum.photos/seed/user3/100/100', quote: 'I\'ve taken several business courses on LearnVerse and they\'ve all exceeded my expectations. The content is practical, relevant, and has helped me grow my business significantly.'}
]

export const categories = [...new Set(courses.map(course => course.category))];
export const levels = [...new Set(courses.map(course => course.level))];
export const languages = [...new Set(courses.map(course => course.language))];
