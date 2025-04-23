'use client'

import { use, useState } from 'react'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')

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
    toast.success(`Bienvenue ${user.name} !`)
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