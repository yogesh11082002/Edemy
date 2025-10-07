import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Edemy?",
    answer: "Edemy is an online learning platform offering a wide range of courses on various subjects, taught by industry experts.",
  },
  {
    question: "How do I enroll in a course?",
    answer: "You can enroll in a course by navigating to the course page and clicking the 'Enroll Now' or 'Add to Cart' button. You will then be prompted to create an account or log in to complete your purchase.",
  },
  {
    question: "Can I get a refund?",
    answer: "Yes, we offer a 30-day money-back guarantee on all our courses. If you're not satisfied, you can request a full refund within 30 days of purchase.",
  },
  {
    question: "Are there any prerequisites for the courses?",
    answer: "Most of our beginner-level courses have no prerequisites. For intermediate and advanced courses, the required prior knowledge is listed in the course description.",
  },
  {
    question: "Do I get a certificate upon completion?",
    answer: "Yes, upon successful completion of a course, you will receive a verifiable certificate that you can share on your resume or social media.",
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find answers to common questions about Edemy.
        </p>
      </header>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
