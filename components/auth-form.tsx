'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator'
import { useLanguage } from '@/lib/i18n/language-context'
import { useAuth } from '@/lib/auth/auth-context'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, Phone } from 'lucide-react'

export function AuthForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const { login, register } = useAuth()
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  
  // Register state
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Phone number validation for Uzbekistan (+998)
  const validateUzbekPhone = (phone: string): boolean => {
    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '')
    // Must start with +998 and have 12 digits total (+998 XX XXX XX XX)
    const uzbekPhoneRegex = /^\+998[0-9]{9}$/
    return uzbekPhoneRegex.test(cleanPhone)
  }

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters except +
    let digits = value.replace(/[^\d+]/g, '')
    
    // Ensure it starts with +998
    if (!digits.startsWith('+')) {
      digits = '+' + digits
    }
    if (!digits.startsWith('+998') && digits.length > 1) {
      digits = '+998' + digits.replace(/^\+/, '')
    }
    
    // Limit to 13 characters (+998 + 9 digits)
    digits = digits.slice(0, 13)
    
    // Format as +998 XX XXX XX XX
    if (digits.length > 4) {
      const parts = [digits.slice(0, 4)]
      if (digits.length > 4) parts.push(digits.slice(4, 6))
      if (digits.length > 6) parts.push(digits.slice(6, 9))
      if (digits.length > 9) parts.push(digits.slice(9, 11))
      if (digits.length > 11) parts.push(digits.slice(11, 13))
      return parts.join(' ')
    }
    return digits
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    
    const result = await login(loginEmail, loginPassword)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setLoginError(result.error || t('loginError'))
    }
    setLoginLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')
    
    // Validate name
    if (!registerName.trim()) {
      setRegisterError(t('nameRequired'))
      return
    }
    
    // Validate phone number (Uzbekistan only)
    if (!validateUzbekPhone(registerPhone)) {
      setRegisterError(t('phoneInvalid'))
      return
    }
    
    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      setRegisterError(t('passwordsDoNotMatch'))
      return
    }
    
    setRegisterLoading(true)
    
    const result = await register(registerName, registerEmail, registerPassword)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setRegisterError(result.error || t('registerError'))
    }
    setRegisterLoading(false)
  }

  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">{t('login')}</TabsTrigger>
        <TabsTrigger value="register">{t('register')}</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{t('welcomeBack')}</CardTitle>
            <CardDescription>{t('enterCredentials')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="login-email">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loading')}
                  </>
                ) : (
                  t('login')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="register">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{t('createYourAccount')}</CardTitle>
            <CardDescription>{t('joinCommunity')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {registerError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{registerError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="register-name">{t('fullName')} *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder={t('fullNamePlaceholder')}
                    className="pl-10"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">{t('email')} *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-phone">{t('phoneNumber')} *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="+998 XX XXX XX XX"
                    className="pl-10"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(formatPhoneNumber(e.target.value))}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('phoneUzbekOnly')}</p>
                {registerPhone && !validateUzbekPhone(registerPhone) && registerPhone.length > 4 && (
                  <p className="text-xs text-destructive">{t('phoneInvalid')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">{t('password')} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
                <PasswordStrengthIndicator password={registerPassword} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('confirmPassword')} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
                {confirmPassword && registerPassword !== confirmPassword && (
                  <p className="text-xs text-destructive">{t('passwordsDoNotMatch')}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={registerLoading}>
                {registerLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loading')}
                  </>
                ) : (
                  t('createAccount')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
