
import React from 'react';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';

export function HealthSection() {
  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <SplitSection
        title="Transform Your Health with Natural Fiber"
        description="Our premium vegetable and fruit fiber drink is designed to support your digestive health, boost your immunity, and help you maintain optimal wellness."
        image="public/lovable-uploads/d98185ae-142e-45e8-9804-7b3e5aee3680.png"
        imageAlt="Bottle with fruits and vegetables"
      >
        <ul className="mt-6 space-y-2 text-gray-600">
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Supports healthy digestion</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Boosts immunity naturally</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Helps with weight management</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Provides essential nutrients</span>
          </li>
        </ul>
        
        <div className="mt-8">
          <Button variant="premium">
            Explore Products
          </Button>
        </div>
      </SplitSection>
      
      <SplitSection
        reverse
        title="Perfect for the Whole Family"
        description="From children to adults, our delicious fiber drink is suitable for everyone. Easy to prepare and enjoy daily for ongoing health benefits."
        image="public/lovable-uploads/6903ac0b-0e52-4260-bda8-07f24ce86b9a.png"
        imageAlt="Child drinking healthy juice"
        className="mt-20"
      >
        <ul className="mt-6 space-y-2 text-gray-600">
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Kid-friendly taste</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>No artificial additives</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Quick and easy preparation</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Healthy daily routine</span>
          </li>
        </ul>
        
        <div className="mt-8">
          <Button variant="premium">
            View Testimonials
          </Button>
        </div>
      </SplitSection>
      
      <SplitSection
        title="Your Wellness Journey Starts Here"
        description="Integrate our premium fiber supplement into your wellness routine for long-term health benefits. Just one serving daily makes a remarkable difference."
        image="public/lovable-uploads/a9768c7e-625a-4016-8baa-79cea10189ac.png"
        imageAlt="Woman in yoga pose with product"
        className="mt-20"
      >
        <ul className="mt-6 space-y-2 text-gray-600">
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Complements active lifestyles</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Enhances physical wellbeing</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Sustainable health benefits</span>
          </li>
          <li className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Feel the difference in days</span>
          </li>
        </ul>
        
        <div className="mt-8">
          <Button variant="premium">
            Start Your Journey
          </Button>
        </div>
      </SplitSection>
    </div>
  );
}

export default HealthSection;
