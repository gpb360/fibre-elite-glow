import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, Heart, Globe, Users, Mail, Phone, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/seo/StructuredData'
import { generateOrganizationSchema } from '@/lib/seo'

export default function About() {
  const organizationSchema = generateOrganizationSchema()

  return (
    <>
      <StructuredData data={organizationSchema} />
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About La Belle Vie</h1>
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-medium text-green-600 mb-4 italic">
                "We are the nature and the nature is us"
              </blockquote>
              <p className="text-xl text-gray-600">
                Our philosophy guides everything we do - creating natural, holistic wellness solutions that honor the connection between humanity and nature.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600 text-2xl">
                  <Heart className="h-7 w-7 mr-3" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-gray-700">
                  La Belle Vie focuses on creating all-natural food formulas to promote colon health and cleansing. 
                  We believe that true wellness begins with supporting your body's natural processes.
                </p>
                <p className="text-gray-700">
                  Our goal is to help people feel and look more youthful by providing products that are:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <Leaf className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    All natural and non-medicated
                  </li>
                  <li className="flex items-center">
                    <Leaf className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Sourced from Mother Nature
                  </li>
                  <li className="flex items-center">
                    <Leaf className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Enhanced by universal energy healing force
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600 text-2xl">
                  <Globe className="h-7 w-7 mr-3" />
                  Our Perspective
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-gray-700">
                  We recognize that people are constantly exposed to toxins and pollutants in daily life. 
                  These environmental challenges require natural solutions that work with your body, not against it.
                </p>
                <p className="text-gray-700">
                  Our Research & Development Team in Malaysia has developed natural formulas to address these health concerns, 
                  believing that colon cleansing is the first step to a healthy, balanced life.
                </p>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium text-center italic">
                    "C'est la belle vie!" - This is the beautiful life!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Natural Purity</h3>
                <p className="text-gray-700">
                  We source only the finest natural ingredients, free from artificial additives and harmful chemicals.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Holistic Wellness</h3>
                <p className="text-gray-700">
                  We believe in treating the whole person, addressing root causes rather than just symptoms.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Care</h3>
                <p className="text-gray-700">
                  Your health journey is our priority. We're committed to providing exceptional products and support.
                </p>
              </div>
            </div>
          </div>

          {/* Research & Development */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600 text-2xl">
                <Globe className="h-7 w-7 mr-3" />
                Research & Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-gray-700">
                Our dedicated Research & Development Team in Malaysia combines traditional wisdom with modern nutritional science 
                to create effective, natural health solutions.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Our Approach:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Extensive research on natural ingredients</li>
                    <li>• Traditional healing wisdom integration</li>
                    <li>• Modern nutritional science application</li>
                    <li>• Rigorous quality testing protocols</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Product Standards:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• HACCP certified facilities</li>
                    <li>• GMP manufacturing standards</li>
                    <li>• Halal certification</li>
                    <li>• Non-GMO and Gluten-Free formulations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600 text-2xl">
                <Mail className="h-7 w-7 mr-3" />
                Connect With Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <MapPin className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Visit Us</h4>
                  <p className="text-gray-700 text-sm">
                    Unit #160B – 2471 Simpson Road<br />
                    Richmond, BC V6X 2R2<br />
                    Canada
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Phone className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
                  <p className="text-gray-700 text-sm">
                    Toll Free: 1-888-661-9886<br />
                    Local: 604-961-6231
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Mail className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
                  <p className="text-gray-700 text-sm">
                    admin@lbve.ca
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-700 italic">
                  Join us on the journey to natural wellness. Experience the beautiful life - C'est la belle vie!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}