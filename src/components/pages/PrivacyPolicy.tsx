import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, Eye, Lock, Users, Mail, Phone } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>

          <div className="space-y-6">
            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Eye className="h-6 w-6 mr-2" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information:</h4>
                  <ul className="space-y-1 text-gray-700 mb-4">
                    <li>• Name and contact information (email, phone, address)</li>
                    <li>• Billing and shipping addresses</li>
                    <li>• Payment information (processed securely through our payment providers)</li>
                    <li>• Order history and preferences</li>
                    <li>• Communication preferences</li>
                  </ul>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">Automatically Collected Information:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• IP address and browser information</li>
                    <li>• Website usage data and analytics</li>
                    <li>• Device information and operating system</li>
                    <li>• Cookies and tracking technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Users className="h-6 w-6 mr-2" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Order Processing:</strong> To process and fulfill your orders, including shipping and customer service</li>
                    <li><strong>Communication:</strong> To send order confirmations, shipping updates, and respond to inquiries</li>
                    <li><strong>Marketing:</strong> To send promotional emails and updates (with your consent)</li>
                    <li><strong>Website Improvement:</strong> To analyze usage patterns and improve our website and services</li>
                    <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                    <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent transactions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Shield className="h-6 w-6 mr-2" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 mb-3">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                  
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Service Providers:</strong> With trusted third parties who help us operate our business (shipping, payment processing, analytics)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> All service providers are contractually obligated to maintain the confidentiality and security of your information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Lock className="h-6 w-6 mr-2" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 mb-3">We implement industry-standard security measures to protect your personal information:</p>
                  
                  <ul className="space-y-2 text-gray-700">
                    <li>• SSL encryption for all data transmission</li>
                    <li>• Secure payment processing through trusted providers</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Limited access to personal information on a need-to-know basis</li>
                    <li>• Secure data storage with backup and recovery procedures</li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      While we use reasonable efforts to protect your information, no method of transmission over the Internet or electronic storage is 100% secure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Users className="h-6 w-6 mr-2" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 mb-3">You have the following rights regarding your personal information:</p>
                  
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong>Object:</strong> Object to certain processing of your personal information</li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      To exercise these rights, please contact us using the information provided below. We will respond to your request within 30 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Eye className="h-6 w-6 mr-2" />
                  Cookies and Tracking Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 mb-3">We use cookies and similar technologies to:</p>
                  
                  <ul className="space-y-2 text-gray-700">
                    <li>• Remember your preferences and settings</li>
                    <li>• Analyze website traffic and usage patterns</li>
                    <li>• Provide personalized content and advertisements</li>
                    <li>• Enable social media features</li>
                    <li>• Improve website functionality and user experience</li>
                  </ul>
                  
                  <p className="text-gray-700 mt-3">
                    You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Shield className="h-6 w-6 mr-2" />
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700">
                    Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. 
                    If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can delete such information.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* International Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Users className="h-6 w-6 mr-2" />
                  International Users
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700">
                    Our website is operated from Canada. If you are accessing our website from outside Canada, please be aware that your information may be 
                    transferred to, stored, and processed in Canada where our servers are located and our central database is operated. 
                    By using our services, you consent to this transfer.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Mail className="h-6 w-6 mr-2" />
                  Contact Us About Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email:</h4>
                      <p className="text-gray-700">admin@lbve.ca</p>
                    </div>
                
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mail:</h4>
                    <p className="text-gray-700">
                      La Belle Vie Enterprises Ltd.<br />
                      Unit #160B – 2471 Simpson Road<br />
                      Richmond, BC V6X 2R2<br />
                      Canada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />
          
          <div className="text-center text-sm text-gray-500">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}