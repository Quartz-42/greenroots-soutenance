'use client'

import { useState, useEffect } from 'react'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
import { Button } from '@/components/ui/button'

// Définition du type pour l'utilisateur
interface User {
  name?: string;
  [key: string]: any;
}

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [parsedUser, setParsedUser] = useState<User | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        setParsedUser(JSON.parse(user));
        setUser(JSON.parse(user));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
    }
  }, []);

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
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setParsedUser(userData);
        setUser(userData);
      } else {
        setParsedUser(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur après connexion:", error);
      setParsedUser(null);
      setUser(null);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    setParsedUser(null);
    setUser(null);
  };

  return (
    <div>
      {user && user.name ? (
        <Button 
          variant="link" 
          className="text-sm font-medium"
          onClick={handleLogout}
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