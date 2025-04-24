'use client'

import { useState, useEffect } from 'react'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const { user, logout, isLoading } = useAuth();

  const handleSwitchToLogin = () => {
    setShowSignup(false)
    setShowLogin(true)
  }
  
  const handleSwitchToSignup = () => {
    setShowLogin(false)
    setShowSignup(true)
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
  }

  if (isLoading) {
    return null;
  }

  return (
    <div>
      {user ? (
        <Button 
          variant="link" 
          className="text-sm font-medium"
          onClick={logout}
        >
          <span>Se déconnecter</span>
        </Button>
      ) : (
        <Button 
          variant="link" 
          className="text-sm font-medium"
          onClick={() => setShowLogin(true)}
        >
          <span>Se connecter</span>
        </Button>
      )}
      
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
    </div>
  )
} 