'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Search, Store } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Agent {
  id: string
  name: string
  address: string
  phone: string
  city: string
  region: string
  country: string
  type: string
}

const agents: Agent[] = [
  // Canada - British Columbia
  { id: '1', name: 'Nature\'s Way Health Foods', address: '123 Main Street, Vancouver, BC', phone: '604-555-0101', city: 'Vancouver', region: 'BC', country: 'Canada', type: 'Health Food Store' },
  { id: '2', name: 'Wellness Plus Vitamins', address: '456 Oak Avenue, Burnaby, BC', phone: '604-555-0102', city: 'Burnaby', region: 'BC', country: 'Canada', type: 'Vitamin Shop' },
  { id: '3', name: 'Richmond Natural Health', address: '789 Garden City Road, Richmond, BC', phone: '604-555-0103', city: 'Richmond', region: 'BC', country: 'Canada', type: 'Health Center' },
  { id: '4', name: 'Surrey Nutrition Center', address: '321 Scott Road, Surrey, BC', phone: '604-555-0104', city: 'Surrey', region: 'BC', country: 'Canada', type: 'Nutrition Center' },
  
  // Canada - Alberta
  { id: '5', name: 'Calgary Wellness Hub', address: '654 17th Avenue SW, Calgary, AB', phone: '403-555-0105', city: 'Calgary', region: 'AB', country: 'Canada', type: 'Wellness Center' },
  { id: '6', name: 'Edmonton Health Store', address: '987 Whyte Avenue, Edmonton, AB', phone: '780-555-0106', city: 'Edmonton', region: 'AB', country: 'Canada', type: 'Health Store' },
  { id: '7', name: 'Natural Choice Supplements', address: '147 Kensington Road, Calgary, AB', phone: '403-555-0107', city: 'Calgary', region: 'AB', country: 'Canada', type: 'Supplement Store' },
  
  // Canada - Ontario
  { id: '8', name: 'Toronto Vitamin Depot', address: '258 Yonge Street, Toronto, ON', phone: '416-555-0108', city: 'Toronto', region: 'ON', country: 'Canada', type: 'Vitamin Shop' },
  { id: '9', name: 'Markham Natural Health', address: '369 Highway 7, Markham, ON', phone: '905-555-0109', city: 'Markham', region: 'ON', country: 'Canada', type: 'Health Store' },
  { id: '10', name: 'Ottawa Wellness Store', address: '741 Bank Street, Ottawa, ON', phone: '613-555-0110', city: 'Ottawa', region: 'ON', country: 'Canada', type: 'Wellness Store' },
  
  // Canada - Saskatchewan
  { id: '11', name: 'Saskatoon Health Plus', address: '852 Broadway Avenue, Saskatoon, SK', phone: '306-555-0111', city: 'Saskatoon', region: 'SK', country: 'Canada', type: 'Health Store' },
  
  // USA
  { id: '12', name: 'New York Nutrition Center', address: '963 5th Avenue, New York, NY', phone: '212-555-0112', city: 'New York', region: 'NY', country: 'USA', type: 'Nutrition Center' },
  
  // International
  { id: '13', name: 'Miracle Essence', address: '159 Collins Street, Melbourne, VIC', phone: '+61-3-555-0113', city: 'Melbourne', region: 'VIC', country: 'Australia', type: 'Wellness Center' },
  { id: '14', name: 'Beautyology', address: '357 Des Voeux Road, Central, Hong Kong', phone: '+852-555-0114', city: 'Hong Kong', region: 'HK', country: 'Hong Kong', type: 'Beauty & Health' },
  { id: '15', name: 'Wellness Taiwan', address: '753 Zhongshan Road, Taipei', phone: '+886-2-555-0115', city: 'Taipei', region: 'Taiwan', country: 'Taiwan', type: 'Health Store' },
]

export default function AuthorizedAgents() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === 'all' || agent.country === selectedCountry
    return matchesSearch && matchesCountry
  })

  const countries = Array.from(new Set(agents.map(agent => agent.country)))

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Authorized Agents</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find La Belle Vie authorized agents and retailers near you. Shop our premium fiber supplements at trusted locations worldwide.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by store name, city, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing {filteredAgents.length} of {agents.length} authorized agents
            </p>
          </div>

          {/* Agent Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <Store className="h-5 w-5 mr-2" />
                    {agent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">{agent.address}</p>
                      <p className="text-sm text-gray-500">
                        {agent.city}, {agent.region} • {agent.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <p className="text-sm text-gray-900">{agent.phone}</p>
                  </div>
                  
                  <div className="pt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {agent.type}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or selecting a different country.
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-600">Interested in Becoming an Agent?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Join our network of authorized agents and bring premium fiber supplements to your community.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Contact:</strong> admin@lbve.ca
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> 1-888-661-9886
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}