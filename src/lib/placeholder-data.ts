import type { Course, Instructor, Review, Student, Testimonial } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (image) {
        return { imageUrl: image.imageUrl, imageHint: image.imageHint };
    }
    // Fallback to a generic placeholder if ID is not found
    return { imageUrl: 'https://picsum.photos/seed/placeholder/600/400', imageHint: 'placeholder' };
}

export const instructors: Instructor[] = [
  {
    id: 'inst-1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
    bio: 'Software Engineer with 10+ years of experience in web development. Passionate about teaching and building scalable applications.',
    rating: 4.8,
    studentCount: 12500,
    courseCount: 5
  },
  {
    id: 'inst-2',
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    bio: 'Award-winning UX/UI designer focused on creating beautiful and intuitive user experiences. Loves to share design principles with students.',
    rating: 4.9,
    studentCount: 25000,
    courseCount: 8
  },
  {
    id: 'inst-3',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80',
    bio: 'Data Scientist and AI enthusiast with a knack for making complex topics easy to understand. Believes in hands-on learning.',
    rating: 4.9,
    studentCount: 18000,
    courseCount: 6
  }
];

export const students: Student[] = [
  { id: 'stu-1', name: 'Alice', avatar: getImage('user-1').imageUrl },
  { id: 'stu-2', name: 'Bob', avatar: getImage('user-2').imageUrl },
  { id: 'stu-3', name: 'Emily Rodriguez', avatar: getImage('user-3').imageUrl },
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
    imageUrl: getImage('course-1').imageUrl,
    imageHint: getImage('course-1').imageHint,
    language: 'English',
    duration: '62 hours',
    enrolledStudents: 2500,
    lessons: [
      { title: 'Introduction to HTML', duration: '30m', videoUrl: 'https://www.youtube.com/embed/gQojMIhELvA' },
      { title: 'Advanced CSS and Sass', duration: '1h 15m', videoUrl: 'https://www.youtube.com/embed/gQojMIhELvA' },
      { title: 'JavaScript for Beginners', duration: '2h', videoUrl: 'https://www.youtube.com/embed/gQojMIhELvA' }
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
    imageUrl: getImage('course-2').imageUrl,
    imageHint: getImage('course-2').imageHint,
    language: 'English',
    duration: '35.5 hours',
     enrolledStudents: 4800,
    lessons: [
      { title: 'The Design Thinking Process', duration: '45m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU' },
      { title: 'Wireframing in Figma', duration: '1h 30m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU' },
      { title: 'Creating High-Fidelity Prototypes', duration: '2h 15m', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU' }
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
    imageUrl: getImage('course-3').imageUrl,
    imageHint: getImage('course-3').imageHint,
    language: 'English',
    duration: '40.5 hours',
     enrolledStudents: 1200,
    lessons: [
        { title: 'SEO Fundamentals', duration: '1h', videoUrl: 'https://www.youtube.com/embed/0QpTO2eC7dM' },
        { title: 'Social Media Strategy', duration: '1h 45m', videoUrl: 'https://www.youtube.com/embed/0QpTO2eC7dM' },
        { title: 'Content Marketing', duration: '2h', videoUrl: 'https://www.youtube.com/embed/0QpTO2eC7dM' }
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
    imageUrl: getImage('course-4').imageUrl,
    imageHint: getImage('course-4').imageHint,
    language: 'English',
    duration: '10 hours',
     enrolledStudents: 3100,
    lessons: [
        { title: 'Introduction to Mindfulness', duration: '20m', videoUrl: 'https://www.youtube.com/embed/o-kMJBWk9E0' },
        { title: 'Guided Body Scan Meditation', duration: '30m', videoUrl: 'https://www.youtube.com/embed/o-kMJBWk9E0' },
        { title: 'Mindful Breathing Techniques', duration: '25m', videoUrl: 'https://www.youtube.com/embed/o-kMJBWk9E0' }
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
    imageUrl: getImage('course-5').imageUrl,
    imageHint: getImage('course-5').imageHint,
    language: 'English',
    duration: '22 hours',
     enrolledStudents: 5500,
    lessons: [
        { title: 'Understanding Your Camera', duration: '1h', videoUrl: 'https://www.youtube.com/embed/L14_n629x2c' },
        { title: 'Composition Rules', duration: '1h 30m', videoUrl: 'https://www.youtube.com/embed/L14_n629x2c' },
        { title: 'Introduction to Lightroom', duration: '2h', videoUrl: 'https://www.youtube.com/embed/L14_n629x2c' }
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
    imageUrl: getImage('course-6').imageUrl,
    imageHint: getImage('course-6').imageHint,
    language: 'English',
    duration: '30 hours',
     enrolledStudents: 4200,
    lessons: [
        { title: 'Your First Chords', duration: '45m', videoUrl: 'https://www.youtube.com/embed/fJef_iI4-yE' },
        { title: 'Strumming Patterns', duration: '1h', videoUrl: 'https://www.youtube.com/embed/fJef_iI4-yE' },
        { title: 'Playing Your First Song', duration: '1h 15m', videoUrl: 'https://www.youtube.com/embed/fJef_iI4-yE' }
    ]
  },
  {
    id: '7',
    title: 'Artificial Intelligence: Reinforcement Learning in Python',
    description: 'Dive deep into the world of AI and learn how to build agents that learn from experience with this hands-on course in Reinforcement Learning.',
    summary: 'Master AI with Python and Reinforcement Learning.',
    instructor: instructors[2],
    category: 'Programming',
    level: 'Advanced',
    price: 149.99,
    rating: 4.9,
    reviewCount: 950,
    imageUrl: getImage('course-7').imageUrl,
    imageHint: getImage('course-7').imageHint,
    language: 'English',
    duration: '50 hours',
     enrolledStudents: 1500,
    lessons: [
        { title: 'Intro to RL Concepts', duration: '1h 30m', videoUrl: 'https://www.youtube.com/embed/JgvyzIkgxF0' },
        { title: 'Q-Learning and Deep Q-Networks', duration: '3h', videoUrl: 'https://www.youtube.com/embed/JgvyzIkgxF0' },
        { title: 'Policy Gradients', duration: '3h', videoUrl: 'https://www.youtube.com/embed/JgvyzIkgxF0' }
    ]
  },
  {
    id: '8',
    title: 'The Complete Guide to Gourmet Cooking',
    description: 'Learn the techniques of world-class chefs. From basic knife skills to advanced plating, this course has it all.',
    summary: 'Become a gourmet chef in your own kitchen.',
    instructor: instructors[0],
    category: 'Lifestyle',
    level: 'All Levels',
    price: 69.99,
    rating: 4.8,
    reviewCount: 1100,
    imageUrl: getImage('course-8').imageUrl,
    imageHint: getImage('course-8').imageHint,
    language: 'English',
    duration: '15 hours',
     enrolledStudents: 2800,
    lessons: [
        { title: 'Mastering Knife Skills', duration: '1h', videoUrl: 'https://www.youtube.com/embed/G-azE5m2-qM' },
        { title: 'The Art of Sauce Making', duration: '2h', videoUrl: 'https://www.youtube.com/embed/G-azE5m2-qM' },
        { title: 'Plating and Presentation', duration: '1h 30m', videoUrl: 'https://www.youtube.com/embed/G-azE5m2-qM' }
    ]
  },
  {
    id: '9',
    title: 'Acrylic Painting for Beginners',
    description: 'Unleash your inner artist. This course will guide you through the basics of acrylic painting, from color theory to your first masterpiece.',
    summary: 'Learn to paint with acrylics.',
    instructor: instructors[1],
    category: 'Art',
    level: 'Beginner',
    price: 39.99,
    rating: 4.7,
    reviewCount: 780,
    imageUrl: getImage('course-9').imageUrl,
    imageHint: getImage('course-9').imageHint,
    language: 'English',
    duration: '12 hours',
     enrolledStudents: 1900,
    lessons: [
        { title: 'Understanding Color Theory', duration: '1h', videoUrl: 'https://www.youtube.com/embed/wI-nMAH22P4' },
        { title: 'Brush Techniques', duration: '1h 30m', videoUrl: 'https://www.youtube.com/embed/wI-nMAH22P4' },
        { title: 'Your First Landscape', duration: '2h', videoUrl: 'https://www.youtube.com/embed/wI-nMAH22P4' }
    ]
  },
  {
    id: '10',
    title: 'Creative Writing: Crafting Compelling Stories',
    description: 'Learn the art of storytelling. This course covers plot development, character creation, and the secrets to writing a page-turner.',
    summary: 'Write stories that captivate your readers.',
    instructor: instructors[2],
    category: 'Writing',
    level: 'Intermediate',
    price: 59.99,
    rating: 4.9,
    reviewCount: 1300,
    imageUrl: getImage('course-10').imageUrl,
    imageHint: getImage('course-10').imageHint,
    language: 'English',
    duration: '25 hours',
     enrolledStudents: 2200,
    lessons: [
        { title: 'The Elements of Plot', duration: '1h', videoUrl: 'https://www.youtube.com/embed/f4-s7g4sA28' },
        { title: 'Creating Memorable Characters', duration: '1h 45m', videoUrl: 'https://www.youtube.com/embed/f4-s7g4sA28' },
        { title: 'Dialogue and Pacing', duration: '2h', videoUrl: 'https://www.youtube.com/embed/f4-s7g4sA28' }
    ]
  },
  {
    id: '11',
    title: 'Yoga for Flexibility and Strength',
    description: 'Improve your physical and mental well-being with this comprehensive yoga course. Suitable for all fitness levels.',
    summary: 'Increase flexibility and strength with yoga.',
    instructor: instructors[1],
    category: 'Health',
    level: 'All Levels',
    price: 49.99,
    rating: 4.8,
    reviewCount: 2100,
    imageUrl: getImage('course-11').imageUrl,
    imageHint: getImage('course-11').imageHint,
    language: 'English',
    duration: '20 hours',
     enrolledStudents: 6000,
    lessons: [
        { title: 'Foundation Poses', duration: '1h', videoUrl: 'https://www.youtube.com/embed/hJ83bZqj3-w' },
        { title: 'Vinyasa Flow Sequences', duration: '1h 30m', videoUrl: 'https://www.youtube.com/embed/hJ83bZqj3-w' },
        { title: 'Restorative Yoga', duration: '1h', videoUrl: 'https://www.youtube.com/embed/hJ83bZqj3-w' }
    ]
  },
  {
    id: '12',
    title: 'Investing for Beginners: The Stock Market',
    description: 'Learn the fundamentals of investing in the stock market. Understand stocks, bonds, and ETFs to build your own portfolio.',
    summary: 'Start your investing journey today.',
    instructor: instructors[0],
    category: 'Finance',
    level: 'Beginner',
    price: 89.99,
    rating: 4.7,
    reviewCount: 1600,
    imageUrl: getImage('course-12').imageUrl,
    imageHint: getImage('course-12').imageHint,
    language: 'English',
    duration: '18 hours',
     enrolledStudents: 3500,
    lessons: [
        { title: 'What is the Stock Market?', duration: '1h', videoUrl: 'https://www.youtube.com/embed/ZCFkWDdmXG8' },
        { title: 'Analyzing a Company', duration: '2h', videoUrl: 'https://www.youtube.com/embed/ZCFkWDdmXG8' },
        { title: 'Building Your First Portfolio', duration: '2h', videoUrl: 'https://www.youtube.com/embed/ZCFkWDdmXG8' }
    ]
  }
];

export const reviews: Review[] = [
  { id: 'rev-1', student: students[0], rating: 5, comment: 'This course was amazing! The instructor explained everything clearly and the projects were very helpful.', createdAt: '2 weeks ago' },
  { id: 'rev-2', student: students[1], rating: 5, comment: 'I learned so much about design principles. Highly recommend this to anyone starting in UI/UX.', createdAt: '1 month ago' },
  { id: 'rev-3', student: students[2], rating: 4, comment: 'Good course, but some parts were a bit fast. Overall, a great learning experience.', createdAt: '3 days ago' }
];

export const testimonials: Testimonial[] = [
  { id: 'test-1', name: 'Sarah Lee', role: 'Web Developer', avatar: getImage('user-1').imageUrl, quote: 'Edemy has been a game-changer for my career. The courses are top-notch and the instructors are industry experts. I was able to land a better job after completing the Web Development Bootcamp.'},
  { id: 'test-2', name: 'David Chen', role: 'UX Designer', avatar: getImage('user-2').imageUrl, quote: 'The flexibility to learn at my own pace was exactly what I needed. The community forums are also a great place to get help and connect with other learners. Highly recommended!'},
  { id: 'test-3', name: 'Emily Rodriguez', role: 'Marketing Manager', avatar: getImage('user-3').imageUrl, quote: 'I\'ve taken several business courses on Edemy and they\'ve all exceeded my expectations. The content is practical, relevant, and has helped me grow my business significantly.'}
]

export const categories = [...new Set(courses.map(course => course.category))];
export const levels = [...new Set(courses.map(course => course.level))];
export const languages = [...new Set(courses.map(course => course.language))];
