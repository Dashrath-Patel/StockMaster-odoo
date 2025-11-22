import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Package, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { sendPasswordResetOTP } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      await sendPasswordResetOTP(email)
      // Navigate with timestamp for 60-second OTP expiry tracking
      navigate('/reset-password', { 
        state: { 
          email,
          otpSentTime: Date.now() 
        } 
      })
    } catch (error) {
      // Suppress rate limit errors and navigate anyway
      const errorMsg = error.message || ''
      if (errorMsg.includes('security purposes') || errorMsg.includes('30 seconds')) {
        // Navigate anyway, user might still have valid OTP
        navigate('/reset-password', { 
          state: { 
            email,
            otpSentTime: Date.now() 
          } 
        })
      } else {
        setError(errorMsg || 'Failed to send OTP. Please check your email and try again.')
      }
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex items-center justify-center p-4">
      <div className="card-brutal max-w-md w-full bg-cyan-300">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-black">
              <Package size={40} color="white" />
            </div>
            <h1 className="text-4xl font-black uppercase">StockMaster</h1>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 uppercase text-center">Forgot Password</h2>
        <p className="text-center font-bold mb-6">
          Enter your email and we'll send you an OTP code
        </p>
        
        {error && (
          <Alert variant="danger" onClose={() => setError('')} className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mb-4"
          >
            {loading ? 'Sending OTP...' : 'Send OTP Code'}
          </Button>
          
          <Link to="/login">
            <Button variant="default" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft size={20} />
              <span>Back to Login</span>
            </Button>
          </Link>
        </form>
      </div>
    </div>
  )
}
