import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Shield, Leaf, Award, CheckCircle } from 'lucide-react'

export interface ProductCertification {
  id: string
  name: string
  description: string
  icon?: React.ReactNode
}

interface ProductCertificationsProps {
  className?: string
}

const certifications: ProductCertification[] = [
  {
    id: 'haccp',
    name: 'HACCP',
    description: 'Hazard Analysis Critical Control Points certified for food safety',
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: 'gmp',
    name: 'GMP',
    description: 'Good Manufacturing Practice standards compliance',
    icon: <Award className="h-4 w-4" />
  },
  {
    id: 'halal',
    name: 'HALAL',
    description: 'Certified Halal for dietary compliance',
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    id: 'non-gmo',
    name: 'Non-GMO',
    description: 'Made without genetically modified organisms',
    icon: <Leaf className="h-4 w-4" />
  },
  {
    id: 'gluten-free',
    name: 'Gluten Free',
    description: 'Suitable for gluten-sensitive individuals',
    icon: <CheckCircle className="h-4 w-4" />
  }
]

export function ProductCertifications({ className = '' }: ProductCertificationsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">Quality Certifications</h3>
      <div className="flex flex-wrap gap-2">
        {certifications.map((cert) => (
          <Badge
            key={cert.id}
            variant="secondary"
            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200"
            title={cert.description}
          >
            {cert.icon}
            <span>{cert.name}</span>
          </Badge>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        All our products meet the highest quality and safety standards through rigorous certification processes.
      </p>
    </div>
  )
}

export default ProductCertifications