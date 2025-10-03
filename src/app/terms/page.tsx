export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </header>
      <div className="prose prose-lg max-w-none text-muted-foreground">
        <p>
          Welcome to Edemy! These Terms of Service ("Terms") govern your use of our website, courses, and services. By accessing or using Edemy, you agree to be bound by these Terms.
        </p>

        <h2 className="text-foreground font-bold">1. Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>

        <h2 className="text-foreground font-bold">2. Courses</h2>
        <p>
          We grant you a limited, non-exclusive, non-transferable license to access and view the courses and associated content for which you have paid all required fees, solely for your personal, non-commercial, educational purposes through the Service, in accordance with these Terms and any conditions or restrictions associated with a particular courses or feature of our Service.
        </p>
        
        <h2 className="text-foreground font-bold">3. Content</h2>
        <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
        </p>

        <h2 className="text-foreground font-bold">4. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2 className="text-foreground font-bold">5. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the land, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-foreground font-bold">6. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h2 className="text-foreground font-bold">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us.
        </p>
      </div>
    </div>
  );
}
