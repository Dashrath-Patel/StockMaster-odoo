import { Link } from 'react-router-dom'
import { Package, TrendingUp, Users, Shield, BarChart3, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import dashboardPreview from '../assets/Dashboard Preview.jpeg'

export default function Landing() {
  const features = [
    {
      icon: <Package size={32} />,
      title: 'Inventory Management',
      description: 'Track products, quantities, and stock levels in real-time with an intuitive interface.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Stock Movements',
      description: 'Monitor all stock in/out transactions with detailed movement history and analytics.'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Analytics & Reports',
      description: 'Gain insights with comprehensive reports, charts, and data visualizations.'
    },
    {
      icon: <Users size={32} />,
      title: 'Multi-User Collaboration',
      description: 'Work together seamlessly with shared data access for your entire team.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure & Reliable',
      description: 'Built with Supabase for enterprise-grade security and data protection.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-Time Updates',
      description: 'Instant synchronization across all devices for up-to-date inventory data.'
    }
  ]

  const benefits = [
    'No credit card required',
    'Free forever plan available',
    'Easy setup in minutes',
    'Mobile responsive design',
    'Collaborative workspace',
    'Export data anytime'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-black flex items-center justify-center">
                <Package size={24} color="white" strokeWidth={3} />
              </div>
              <span className="text-3xl font-black uppercase tracking-tight">StockMaster</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <button className="font-bold uppercase px-6 py-2 bg-white hover:bg-gray-50 text-gray-900 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="font-bold uppercase px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase mb-6 leading-none">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Inventory Made
            </span>
            <br />
            <span className="text-gray-900">Simple & Powerful</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium">
            Modern inventory management system with real-time tracking, analytics, and collaboration. 
            Perfect for small businesses and growing teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto font-bold uppercase text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto font-bold uppercase text-lg px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 transition-all">
                View Demo
              </button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                <span className="font-semibold">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image/Screenshot */}
        <div className="mt-16 relative">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl"></div>
            <div className="relative border-8 border-black bg-white p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <img 
                src={dashboardPreview} 
                alt="StockMaster Dashboard Preview" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black uppercase mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Powerful features designed for modern inventory management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 border-4 border-black bg-gradient-to-br from-white to-gray-50 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-black uppercase mb-3">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '<100ms', label: 'Response Time' },
              { value: '24/7', label: 'Availability' }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 border-4 border-black bg-gradient-to-br from-yellow-300 to-orange-300"
              >
                <div className="text-5xl md:text-6xl font-black mb-2">{stat.value}</div>
                <div className="text-xl font-bold uppercase text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 border-y-4 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black uppercase mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white mb-8 font-medium">
            Join hundreds of businesses managing their inventory with StockMaster
          </p>
          <Link to="/signup">
            <button className="font-bold uppercase text-lg px-12 py-4 bg-white text-purple-600 hover:bg-gray-100 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto">
              Create Free Account
              <ArrowRight size={20} />
            </button>
          </Link>
          <p className="mt-6 text-white text-sm font-medium">
            No credit card required • Free forever plan • Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 border-3 border-black flex items-center justify-center">
                <Package size={20} color="white" strokeWidth={3} />
              </div>
              <span className="text-2xl font-black uppercase">StockMaster</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 font-semibold">
                © 2025 StockMaster. Built with ❤️ for better inventory management.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
