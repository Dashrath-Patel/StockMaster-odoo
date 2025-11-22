import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Package, CheckCircle, Eye, EyeOff, Clock } from 'lucide-react'

export default function ResetPassword() {
  const location = useLocation()
  const emailFromState = location.state?.email || ''
  const otpSentTime = location.state?.otpSentTime || Date.now()
  
  const [email, setEmail] = useState(emailFromState)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(60) // Start with 60 seconds
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(60) // OTP expires in 60 seconds
  const { verifyOtpAndResetPassword, sendPasswordResetOTP } = useAuth()
  const navigate = useNavigate()

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Countdown timer for OTP expiry (60 seconds from when it was sent)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const elapsed = Math.floor((Date.now() - otpSentTime) / 1000)
      const timeLeft = Math.max(0, 60 - elapsed)
      setOtpExpiryTimer(timeLeft)
      
      if (timeLeft === 0) {
        setError('OTP has expired. Please request a new one.')
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Then update every second
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [otpSentTime])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      return setError('Please enter your email address')
    }
    
    if (!otp || otp.trim().length === 0) {
      return setError('Please enter the reset code from your email')
    }
    
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match')
    }
    
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    
    try {
      setError('')
      setLoading(true)
      
      await verifyOtpAndResetPassword(email, otp, newPassword)
      setSuccess(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error) {
      // Handle specific error messages
      let errorMessage = 'Failed to reset password. Please try again.'
      
      if (error.message) {
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          errorMessage = 'OTP has expired or is invalid. Please request a new one.'
          setOtp('')
        } else if (error.message.includes('otp_expired')) {
          errorMessage = 'OTP has expired. Please click "Resend OTP" to get a new one.'
          setOtp('')
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!email) {
      return setError('Please enter your email address first')
    }
    
    try {
      setError('')
      setLoading(true)
      await sendPasswordResetOTP(email)
      
      // Reset both timers and update OTP sent time
      setResendTimer(60)
      setOtpExpiryTimer(60)
      
      // Update the OTP sent time in location state
      navigate('/reset-password', { 
        state: { email, otpSentTime: Date.now() },
        replace: true 
      })
      
      // Show success message
      alert('OTP resent successfully! Check your email. You have 60 seconds to use it.')
    } catch (error) {
      const errorMsg = error.message || ''
      // Suppress rate limit errors
      if (errorMsg.includes('security purposes') || errorMsg.includes('30 seconds')) {
        // Show friendly message instead
        alert('Please wait a moment before requesting another OTP.')
        setResendTimer(30) // Set a shorter timer
      } else {
        setError(errorMsg || 'Failed to resend OTP')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 flex items-center justify-center p-4">
        <div className="card-brutal max-w-md w-full bg-green-300">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-black">
                <Package size={40} color="white" />
              </div>
              <h1 className="text-4xl font-black uppercase">StockMaster</h1>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-black uppercase mb-2">Success!</h2>
            <p className="font-bold">Your password has been reset successfully.</p>
            <p className="font-bold mt-2">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
      <div className="card-brutal max-w-md w-full bg-purple-300">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-black">
              <Package size={40} color="white" />
            </div>
            <h1 className="text-4xl font-black uppercase">StockMaster</h1>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 uppercase text-center">Reset Password</h2>
        <p className="text-center font-bold mb-6">
          Enter the OTP sent to your email and your new password
        </p>
        
        {error && (
          <Alert variant="danger" onClose={() => setError('')} className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!emailFromState}
          />
          
          <div>
            <Input
              type="text"
              label="Reset Code"
              placeholder="Enter code from email"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              required
            />
            <div className="mt-2 flex items-center justify-end">
              {resendTimer > 0 ? (
                <p className="text-sm font-bold flex items-center gap-1 text-gray-600">
                  <Clock size={14} />
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
          
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[38px] p-2 hover:opacity-70 transition-opacity"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] p-2 hover:opacity-70 transition-opacity"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
