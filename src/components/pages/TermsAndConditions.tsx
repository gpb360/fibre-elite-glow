import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsAndConditions() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <p className="text-lg text-gray-600">
              Please read these terms carefully before placing your order
            </p>
          </div>

          <div className="space-y-6">
            {/* Order & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="text-2xl mr-2">📦</span>
                  Order & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <ul className="space-y-2 text-gray-700">
                    <li>All orders are shipped via Canada Post or company-chosen courier</li>
                    <li>Orders are placed through our secure online shopping basket</li>
                    <li>For inquiries, contact: <a href="mailto:admin@lbve.ca" className="text-green-600 hover:underline">admin@lbve.ca</a></li>
                    <li>No minimum order requirement</li>
                    <li>Back-orders will only ship when complete</li>
                    <li>Separate shipping charges apply for partial shipments</li>
                    <li>We currently accept PayPal payments and major credit cards</li>
                    <li>Payment confirmation will be emailed upon order receipt</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Order Processing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="text-2xl mr-2">⚙️</span>
                  Order Processing and Cancellation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <ul className="space-y-2 text-gray-700">
                    <li>Orders are processed within 24 hours of payment confirmation</li>
                    <li>10% cancellation fee applies to cancelled orders</li>
                    <li>Shipped orders are treated as returns (see return policy below)</li>
                    <li>Shipping costs and duties will be deducted from refunds</li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Return Requirements:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Must be in original packaging</li>
                      <li>• Must be unused and unworn</li>
                      <li>• Must be shipped pre-paid by customer</li>
                      <li>• Must be marked "RETURN TO VENDOR"</li>
                      <li>• Returns must be authorized within 2 weeks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="text-2xl mr-2">🚚</span>
                  Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <ul className="space-y-2 text-gray-700">
                    <li>Shipping charges are added to each order</li>
                    <li>Delivery time: 5-7 working days</li>
                    <li>In-stock items shipped within 2 business days</li>
                    <li>Shipping cost calculated by order weight</li>
                    <li>Tracking numbers provided for all shipments</li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">International Shipping:</h4>
                    <p className="text-gray-700">
                      International customers will be contacted for the most efficient shipping method. 
                      For shipping quotes, contact: <a href="mailto:admin@lbve.ca" className="text-green-600 hover:underline">admin@lbve.ca</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sales Tax & Customs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="text-2xl mr-2">💰</span>
                  Sales Tax & Customs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sales Tax:</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• No sales tax for USA/International orders</li>
                        <li>• Canadian provincial sales tax applied for domestic shipments</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Customs/Duties:</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Additional charges determined by recipient country</li>
                        <li>• Not controlled by La Belle Vie Enterprises Ltd.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rush Delivery & Special Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="text-2xl mr-2">🏃</span>
                  Rush Delivery & Special Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Rush Delivery:</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Available upon request</li>
                        <li>• Courier charges quoted before shipping</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Delivery Address:</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Provide confirmed address with recipient name</li>
                        <li>• Include contact telephone number</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="text-2xl mr-2">⚖️</span>
                  Liability Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700">
                    La Belle Vie Enterprises Ltd. is not liable for shipping delays caused by:
                  </p>
                  <ul className="space-y-1 text-gray-700 mt-2">
                    <li>• Courier service issues</li>
                    <li>• Postal system problems</li>
                    <li>• War or conflict</li>
                    <li>• Terrorist attacks</li>
                    <li>• Natural disasters</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="text-2xl mr-2">📞</span>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">LA BELLE VIE ENTERPRISES LTD.</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <MapPin className="h-6 w-6 text-green-600 mb-2" />
                      <p className="text-sm text-gray-700">
                        Unit #160B – 2471 Simpson Road<br />
                        Richmond, BC V6X 2R2<br />
                        Canada
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <Phone className="h-6 w-6 text-green-600 mb-2" />
                      <p className="text-sm text-gray-700">
                        Toll Free: 1-888-661-9886<br />
                        Local: 604-961-6231
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <Mail className="h-6 w-6 text-green-600 mb-2" />
                      <p className="text-sm text-gray-700">
                        Email: admin@lbve.ca
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />
          
          <div className="text-center text-sm text-gray-500">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">These terms and conditions are effective immediately and were last updated on the date shown above.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}