'use client'

import { use, useState } from 'react'
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

  const handleLoginSuccess = () => {
    setShowLogin(false)
  }

    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
  

  return (
    <>
      <Button 
        variant="link" 
        className="text-sm font-medium"
        onClick={() => setShowLogin(true)}
      >
        {parsedUser && parsedUser.name ? (
          <span>Bonjour, {parsedUser.name}</span>
        ) : (
          <span>Se connecter</span>
        )}
      </Button>
      
      <LoginModal 
        open={showLogin} 
        onOpenChange={setShowLogin}
        onSwitchToSignup={handleSwitchToSignup}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <SignupModal 
        open={showSignup} 
        onOpenChange={setShowSignup}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
} 