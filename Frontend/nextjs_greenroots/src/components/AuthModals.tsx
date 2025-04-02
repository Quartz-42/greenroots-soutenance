'use client'

import { useState } from 'react'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import { Button } from '@/components/ui/button'

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  
  const handleSwitchToLogin = () => {
    setShowSignup(false)
    setTimeout(() => setShowLogin(true), 100) // Petit délai pour éviter les conflits entre les modales
  }
  
  const handleSwitchToSignup = () => {
    setShowLogin(false)
    setTimeout(() => setShowSignup(true), 100) // Petit délai pour éviter les conflits entre les modales
  }
  
  return (
    <>
      <Button 
        variant="link" 
        className="text-sm font-medium"
        onClick={() => setShowLogin(true)}
      >
        Se connecter
      </Button>
      
      <LoginModal 
        open={showLogin} 
        onOpenChange={setShowLogin}
        onSwitchToSignup={handleSwitchToSignup}
      />
      
      <SignupModal 
        open={showSignup} 
        onOpenChange={setShowSignup}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
} 