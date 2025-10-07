import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Building, Target, Users } from 'lucide-react';

const teamMembers = [
  { name: 'John Doe', role: 'CEO & Founder', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80' },
  { name: 'Jane Smith', role: 'Head of Instruction', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { name: 'Peter Jones', role: 'Lead Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">About Edemy</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We are on a mission to make quality education accessible to everyone, everywhere. Learn, grow, and achieve your goals with our expert-led courses.
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-headline">Our Mission</h2>
                <p className="mt-2 text-muted-foreground">
                  To provide flexible, effective, and affordable online learning that empowers individuals to unlock their full potential and achieve their personal and professional goals.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-headline">Our Vision</h2>
                <p className="mt-2 text-muted-foreground">
                  To create a global community of lifelong learners, where knowledge is not just consumed, but created, shared, and applied to make a positive impact on the world.
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
             <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team working together"
                fill
                className="object-cover"
                data-ai-hint="team collaboration"
              />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Edemy, dedicated to your success.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold font-headline">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}