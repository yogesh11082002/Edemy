export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </header>
      <div className="prose prose-lg max-w-none text-muted-foreground">
        <p>
          Your privacy is important to us. It is Edemy's policy to respect your privacy regarding any information we may collect from you across our website.
        </p>

        <h2 className="text-foreground font-bold">1. Information We Collect</h2>
        <p>
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
        </p>

        <h2 className="text-foreground font-bold">2. How We Use Your Information</h2>
        <p>
          We may use the information we collect in various ways, including to:
        </p>
        <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
        </ul>

        <h2 className="text-foreground font-bold">3. Cookies</h2>
        <p>
            Like any other website, Edemy uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h2 className="text-foreground font-bold">4. Security</h2>
        <p>
          The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>

        <h2 className="text-foreground font-bold">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  );
}
