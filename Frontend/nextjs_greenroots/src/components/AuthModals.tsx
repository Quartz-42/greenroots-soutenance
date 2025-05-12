'use client'

import { useState, useEffect } from 'react'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import UserProfileModal from './UserProfileModal'
import { User } from 'lucide-react'

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { user, logout, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient || isLoading) {
    return <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>;
  }

  return (
    <div className="flex items-center">
      {user ? (
        <Button 
          variant="ghost"
          size="icon"
          className="text-sm font-medium rounded-full"
          onClick={() => setIsProfileModalOpen(true)}
          aria-label="Mon profil"
        >
           <User className="h-5 w-5" />
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

      {user && (
         <UserProfileModal 
           open={isProfileModalOpen}
           onOpenChange={setIsProfileModalOpen}
         />
      )}
    </div>
  )
} 