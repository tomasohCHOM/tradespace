import { MessageCircle, ShoppingBag, Users } from 'lucide-react';
import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Marketplace',
      desc: 'Browse and list products in dedicated tradespaces. Set prices, negotiate offers, and complete trades seamlessly.',
      icon: <ShoppingBag />,
    },
    {
      title: 'Forums',
      desc: 'Engage in discussions, share tips, and connect with community members who share your interests.',
      icon: <MessageCircle />,
    },
    {
      title: 'Community',
      desc: 'Join topic-specific communities where you can collaborate, learn, and grow your network.',
      icon: <Users />,
    },
  ];
  return (
    <div className="text-center grid gap-12">
      <h2 className="text-2xl md:text-3xl font-bold">
        <span className="block">Join Online Communities.</span>
        <span className="block">Buy, Sell, and Trade!</span>
      </h2>
      <div className="grid justify-center md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="max-w-[400px] min-h-[220px] flex flex-col lg:gap-8"
          >
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-10 h-10 bg-accent-blue/70 text-white rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  {feature.title}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>{feature.desc}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
