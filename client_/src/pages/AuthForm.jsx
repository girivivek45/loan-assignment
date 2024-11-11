import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function AuthForm() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [role,setRole] = useState('')
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role:''
  })
  
  const [errors, setErrors] = useState({
    login: {},
    signup: {}
  })

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password) => password.length >= 6

  const validateSignupForm = () => {
    const newErrors = {}
    
    if (!signupForm.name.trim()) newErrors.fullName = 'Full name is required'
    if (!validateEmail(signupForm.email)) newErrors.email = 'Invalid email address'
    if (!validatePassword(signupForm.password)) newErrors.password = 'Password must be at least 8 characters'
    if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    setErrors({ ...errors, signup: newErrors })
    return Object.keys(newErrors).length === 0
  }

  const validateLoginForm = () => {
    const newErrors = {}
    
    if (!validateEmail(loginForm.email)) newErrors.email = 'Invalid email address'
    if (!loginForm.password) newErrors.password = 'Password is required'

    setErrors({ ...errors, login: newErrors })
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLoginForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      const userRole = data.user.role
      const routes = { admin: '/admin', verifier: '/verifier', user: '/loans' }
      navigate(routes[userRole] || '/application')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateSignupForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm )
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Signup failed')
      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' })
      setIsLoginForm(true) 
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <Card className="w-full max-w-md shadow-lg border border-gray-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center text-blue-700">
            Welcome to Credit App
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            {isLoginForm ? "Log in to continue" : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoginForm ? (
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="Enter your email" 
                    type="email" 
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className={`border-gray-300 focus:border-blue-500 ${errors.login.email ? "border-red-500" : ""}`}
                  />
                  {errors.login.email && (
                    <p className="text-sm text-red-500">{errors.login.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className={`border-gray-300 focus:border-blue-500 ${errors.login.password ? "border-red-500" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                    </Button>
                  </div>
                  {errors.login.password && (
                    <p className="text-sm text-red-500">{errors.login.password}</p>
                  )}
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Log In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input 
                  id="signup-name" 
                  placeholder="Enter your full name" 
                  required
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  className={errors.signup.name ? "border-red-500" : ""}
                />
                {errors.signup.name && (
                  <p className="text-sm text-red-500">{errors.signup.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input 
                  id="signup-email" 
                  placeholder="Enter your email" 
                  type="email" 
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className={errors.signup.email ? "border-red-500" : ""}
                />
                {errors.signup.email && (
                  <p className="text-sm text-red-500">{errors.signup.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  className={errors.signup.password ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  placeholder="Confirm your password"
                  type="password"
                  required
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  className={errors.signup.confirmPassword ? "border-red-500" : ""}
                />
                {errors.signup.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.signup.confirmPassword}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-role">Role</Label>
                <select
                  id="signup-role"
                  required
                  value={signupForm.role}
                  onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                  className="border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="">Select a role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="verifier">Verifier</option>
                </select>
              </div>
              
              {signupForm.role === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="admin-key">Admin Key</Label>
                  <Input
                    id="admin-key"
                    placeholder="Enter admin key"
                    type="password"
                    required
                    value={signupForm.adminKey || ''}
                    onChange={(e) => setSignupForm({ ...signupForm, adminKey: e.target.value })}
                    className="border-gray-300 rounded-md w-full"
                  />
                </div>
              )}
              
              {signupForm.role === 'verifier' && (
                <div className="space-y-2">
                  <Label htmlFor="verifier-key">Verifier Key</Label>
                  <Input
                    id="verifier-key"
                    placeholder="Enter verifier key"
                    type="password"
                    required
                    value={signupForm.verifierKey || ''}
                    onChange={(e) => setSignupForm({ ...signupForm, verifierKey: e.target.value })}
                    className="border-gray-300 rounded-md w-full"
                  />
                </div>
              )}
            </div>
          
            <Button 
              className="w-full mt-6 bg-blue-600 hover:bg-green-700 text-white py-2 rounded-lg transition-all"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
          
          )}
          <div className="text-center mt-4 text-gray-500">
            {isLoginForm ? (
              <p>Not a user? <Button variant="link" className="text-blue-500 hover:text-blue-700" onClick={() => setIsLoginForm(false)}>Sign Up</Button></p>
            ) : (
              <p>Already have an account? <Button variant="link" className="text-blue-500 hover:text-blue-700" onClick={() => setIsLoginForm(true)}>Log In</Button></p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="underline text-blue-500 hover:text-blue-600 ml-1">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="underline text-blue-500 hover:text-blue-600 ml-1">Privacy Policy</a>.
        </CardFooter>
      </Card>
    </div>
  )
}
