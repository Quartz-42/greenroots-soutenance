'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormulaireProps {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  errors: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    zipCode?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => void;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function Formulaire({
  firstName,
  lastName,
  address,
  city,
  zipCode,
  errors,
  handleInputChange,
  setFirstName,
  setLastName,
  setAddress,
  setCity,
  setZipCode
}: FormulaireProps) {
  return (
    <div>
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Adresse</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom*</Label>
              <Input 
                id="firstName" 
                placeholder="Entrez votre prénom" 
                value={firstName} 
                onChange={(e) => handleInputChange(e, setFirstName)}
                className={errors.firstName ? "border-red-500" : ""}
                maxLength={50}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom*</Label>
              <Input 
                id="lastName" 
                placeholder="Entrez votre nom" 
                value={lastName} 
                onChange={(e) => handleInputChange(e, setLastName)}
                className={errors.lastName ? "border-red-500" : ""}
                maxLength={50}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <Label htmlFor="address">Adresse*</Label>
            <Input 
              id="address" 
              placeholder="Entrez votre adresse" 
              value={address} 
              onChange={(e) => handleInputChange(e, setAddress)}
              className={errors.address ? "border-red-500" : ""}
              maxLength={120}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville*</Label>
              <Input 
                id="city" 
                placeholder="Entrez votre ville" 
                value={city} 
                onChange={(e) => handleInputChange(e, setCity)}
                className={errors.city ? "border-red-500" : ""}
                maxLength={50}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Code postal*</Label>
              <Input 
                id="zipCode" 
                placeholder="Entrez votre code postal" 
                value={zipCode} 
                onChange={(e) => handleInputChange(e, setZipCode)}
                className={errors.zipCode ? "border-red-500" : ""}
                maxLength={5}
              />
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
