
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FaqSection } from '@/components/FaqSection';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lightbulb, Heart, Shield, Zap } from 'lucide-react';

export function Faq() {
  const generalFaqData = [
    {
      question: "What makes Total Essential different from other fiber supplements?",
      answer: "Total Essential stands apart with its scientifically formulated blend of both soluble and insoluble fiber from 100% natural sources. Unlike synthetic fiber supplements, our formula includes premium oat bran, sustainably sourced palm tree trunk fiber, and 12 varieties of fruits and vegetables. The addition of oligosaccharides provides prebiotic support, nourishing your existing beneficial gut bacteria naturally. This comprehensive approach delivers superior digestive health benefits while supporting cardiovascular wellness, blood sugar regulation, and healthy weight management."
    },
    {
      question: "How quickly will I see results with Total Essential?",
      answer: "Most customers begin experiencing improved digestive regularity within 3-5 days of consistent use. Complete wellness benefits, including enhanced energy levels, better appetite control, and improved overall well-being, typically develop over the full 15-day program. Individual results may vary based on current fiber intake, diet, and overall health status. For optimal results, maintain consistency with daily usage and adequate water intake throughout the program."
    },
    {
      question: "Is Total Essential safe for long-term use?",
      answer: "Yes, Total Essential is formulated with 100% natural, food-grade ingredients and is safe for regular use. Our gentle fiber blend is well-tolerated by most individuals and contains no artificial preservatives, synthetic additives, or harmful chemicals. The product is certified non-GMO and gluten-free. However, as with any nutritional supplement, we recommend consulting with your healthcare practitioner before beginning any new wellness program, especially if you have existing health conditions or take medications."
    },
    {
      question: "Can I take Total Essential with my current medications or supplements?",
      answer: "Total Essential is a natural fiber supplement made from food-grade ingredients. However, fiber can affect the absorption timing of certain medications. We recommend taking Total Essential at least 2 hours before or after any medications to ensure optimal absorption. Always consult with your healthcare provider or pharmacist about potential interactions with your specific medications or supplements before starting any new wellness program."
    },
    {
      question: "What's the difference between Total Essential and Total Essential Plus?",
      answer: "Total Essential provides comprehensive digestive wellness with 12 varieties of fruits and vegetables in a premium fiber blend. Total Essential Plus enhances this formula with four additional superfruits: Açaí Berry, Strawberry, Cranberry, and Raspberry. These superfruits provide powerful antioxidant protection, promote radiant skin health, and offer enhanced beauty benefits while maintaining all the digestive and metabolic advantages of the original formula. Plus also features a delicious berry flavor profile."
    }
  ];

  const healthBenefitsFaqData = [
    {
      question: "How does fiber support heart health and cardiovascular wellness?",
      answer: "Soluble fiber, like that found in Total Essential, has been extensively studied for its cardiovascular benefits. It works by binding to cholesterol in the digestive system, helping to reduce LDL (bad) cholesterol levels and supporting healthy blood pressure. Research shows that individuals consuming adequate fiber have up to 40% lower risk of heart disease. The beta-glucan oat bran in our formula is particularly effective for cardiovascular support, while the natural fruit and vegetable extracts provide additional antioxidant protection for heart health."
    },
    {
      question: "Can Total Essential help with weight management and appetite control?",
      answer: "Yes, fiber is one of the most effective natural tools for healthy weight management. Total Essential's dual-fiber formula creates feelings of fullness and satiety, naturally reducing overeating and snacking between meals. Soluble fiber slows digestion and stabilizes blood sugar levels, preventing energy crashes that lead to cravings. Insoluble fiber supports efficient metabolism and waste elimination. Clinical studies show that adequate fiber intake is associated with lower body weight, reduced belly fat, and better long-term weight maintenance."
    },
    {
      question: "How does Total Essential support blood sugar regulation and diabetes management?",
      answer: "The soluble fiber in Total Essential forms a gel-like substance in the digestive tract that slows the absorption of sugars and carbohydrates. This helps prevent blood sugar spikes and promotes more stable glucose levels throughout the day. The oligosaccharides also support beneficial gut bacteria that play a role in glucose metabolism. While Total Essential can be a valuable addition to a diabetes management plan, individuals with diabetes should consult their healthcare provider before starting any new supplement regimen."
    },
    {
      question: "What are prebiotics and how do they differ from probiotics?",
      answer: "Prebiotics are specialized plant fibers that feed and nourish the beneficial bacteria already living in your gut, while probiotics are live bacteria that you add to your digestive system. Total Essential contains oligosaccharides, which are prebiotics that act as food for your existing beneficial gut bacteria. This approach supports your natural microbiome balance without introducing foreign bacteria that may not colonize effectively. Prebiotics are generally more stable, don't require refrigeration, and work synergistically with your body's existing bacterial ecosystem."
    },
    {
      question: "How does improved gut health affect overall immunity and wellness?",
      answer: "Your gut houses approximately 70% of your immune system, making digestive health crucial for overall wellness. Total Essential's prebiotic fiber supports beneficial bacteria that produce short-chain fatty acids, which strengthen the gut barrier and enhance immune function. A healthy gut microbiome also influences mood regulation through the gut-brain axis, supports better nutrient absorption, reduces inflammation throughout the body, and may even affect skin health and mental clarity."
    }
  ];

  const usageFaqData = [
    {
      question: "What's the best time of day to take Total Essential?",
      answer: "Total Essential can be taken at any time that fits your routine, but many customers prefer taking it before bedtime or first thing in the morning on an empty stomach. Evening consumption allows the fiber to work overnight, promoting natural morning regularity. Morning intake can help control appetite throughout the day and provide sustained energy. The key is consistency - choose a time you can maintain daily throughout the 15-day program."
    },
    {
      question: "How much water should I drink with Total Essential?",
      answer: "Always mix Total Essential with at least 350ml (12 oz) of water and drink immediately. It's also important to maintain adequate hydration throughout the day when increasing fiber intake. We recommend drinking an additional 2-3 glasses of water daily during your Total Essential program. Proper hydration ensures the fiber can work effectively and prevents any digestive discomfort."
    },
    {
      question: "Can I mix Total Essential with other beverages besides water?",
      answer: "While water is recommended for optimal dissolution and effectiveness, Total Essential can be mixed with other beverages like herbal tea, coconut water, or fresh juice. Avoid mixing with caffeinated beverages, alcohol, or very hot liquids as these may affect the fiber's beneficial properties. Cold or room temperature beverages work best. Always ensure you're consuming adequate total fluid intake regardless of your beverage choice."
    },
    {
      question: "What should I expect during my first few days of using Total Essential?",
      answer: "By days 3-5, most people notice improved regularity and increased energy. Some customers report better sleep quality and reduced cravings within the first week. If you experience any persistent discomfort, try reducing to half a sachet for a few days before returning to the full dose."
    },
    {
      question: "Can I continue taking Total Essential after the 15-day program?",
      answer: "Total Essential is designed as a comprehensive 15-day wellness program that can be repeated monthly or seasonally based on your health goals. Many customers incorporate this program into their regular wellness routine every 4-6 weeks for ongoing digestive maintenance and detoxification support. For continuous daily fiber supplementation, consult with your healthcare provider to determine the best long-term approach for your individual needs."
    }
  ];

  const safetyFaqData = [
    {
      question: "Are there any side effects or contraindications with Total Essential?",
      answer: "Total Essential is made from natural, food-grade ingredients and is generally well-tolerated. Individuals with severe digestive conditions, food allergies, or those taking multiple medications should consult their healthcare provider before starting. Pregnant or nursing women should seek medical advice before use."
    },
    {
      question: "Is Total Essential suitable for people with dietary restrictions?",
      answer: "Total Essential is certified gluten-free, non-GMO, and made exclusively with natural plant-based ingredients. It contains no artificial preservatives, colors, synthetic additives, dairy, soy, or nuts. However, if you have specific food allergies or sensitivities, please review our complete ingredient list. The product is suitable for vegetarians and vegans. Those following specialized diets (keto, low-FODMAP, etc.) should consult with a nutritionist or healthcare provider."
    },
    {
      question: "Can children or elderly individuals use Total Essential?",
      answer: "Total Essential is formulated for adult use. For children under 18 or adults over 65, we strongly recommend consulting with a healthcare provider before starting any new supplement regimen. Elderly individuals or those with compromised digestive systems may need modified dosing or special considerations. Children's fiber needs differ significantly from adults, and their supplements should be specifically formulated for their age group."
    },
    {
      question: "How should Total Essential be stored for maximum potency?",
      answer: "Store Total Essential in a cool, dry place away from direct sunlight and heat. The individual sachets help maintain freshness and potency. Avoid storing in humid environments like bathrooms or near stoves. Once opened, individual sachets should be used immediately and not stored for later use. Proper storage ensures the natural ingredients maintain their nutritional value and effectiveness throughout the product's shelf life."
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Everything you need to know about Total Essential fiber supplements, 
                digestive health, and your wellness journey.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Heart Health</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium">Energy & Vitality</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Shield className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">Digestive Wellness</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Lightbulb className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Weight Management</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-8 bg-white border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#general" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                General Questions
              </a>
              <a href="#health" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                Health Benefits
              </a>
              <a href="#usage" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                Usage & Instructions
              </a>
              <a href="#safety" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                Safety & Storage
              </a>
            </div>
          </div>
        </section>

        {/* General FAQ Section */}
        <div id="general">
          <FaqSection
            title="General Questions About Total Essential"
            description="Learn about our premium fiber supplements and what makes them unique in the wellness industry."
            faqs={generalFaqData}
          />
        </div>

        {/* Health Benefits FAQ Section */}
        <div id="health">
          <FaqSection
            title="Health Benefits & Scientific Research"
            description="Discover how fiber supplements support overall health, from heart wellness to weight management."
            faqs={healthBenefitsFaqData}
          />
        </div>

        {/* Usage FAQ Section */}
        <div id="usage">
          <FaqSection
            title="Usage Instructions & Best Practices"
            description="Get the most out of your Total Essential program with proper usage guidelines and tips."
            faqs={usageFaqData}
          />
        </div>

        {/* Safety FAQ Section */}
        <div id="safety">
          <FaqSection
            title="Safety, Storage & Dietary Considerations"
            description="Important safety information and storage guidelines for optimal product effectiveness."
            faqs={safetyFaqData}
          />
        </div>

        {/* Educational Content Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 md:px-6">
            <Heading
              title="Understanding Fiber: The Foundation of Wellness"
              description="Educational insights into why fiber is essential for optimal health and longevity"
              centered
              className="mb-12"
            />
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-6">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">The Fiber Deficiency Crisis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Modern diets provide only 10-15g of fiber daily, while health experts recommend 25-35g. 
                  This widespread deficiency contributes to rising rates of heart disease, diabetes, obesity, 
                  and digestive disorders. Total Essential helps bridge this critical nutritional gap.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Gut Health Revolution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your gut microbiome influences everything from immunity to mood regulation. 
                  Prebiotic fiber feeds beneficial bacteria, supporting the production of short-chain 
                  fatty acids that strengthen gut barrier function and reduce systemic inflammation.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-6">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Metabolic Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fiber regulates blood sugar levels, supports healthy cholesterol ratios, and promotes 
                  sustainable weight management. Studies show high-fiber diets are associated with lower 
                  BMI, reduced belly fat, and improved metabolic markers.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="py-16 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Our wellness experts are here to help you make the best choice for your health journey. 
                Get personalized guidance and start your transformation today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/products/total-essential">
                  <Button variant="premium" size="lg">
                    Shop Total Essential
                  </Button>
                </Link>
                <Link href="/products/total-essential-plus">
                  <Button variant="premium2" size="lg">
                    Shop Total Essential Plus
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Our Team
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 leading-relaxed">
                  <strong>Medical Disclaimer:</strong> The information provided on this page is for educational purposes only and is not intended as medical advice. 
                  Total Essential is a dietary supplement and has not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. 
                  Always consult with a qualified healthcare practitioner before starting any new supplement regimen, especially if you have existing health conditions or take medications.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Faq;
