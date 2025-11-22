import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  User,
  AlertTriangle
} from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [userName, setUserName] = useState('')
  const notificationRef = useRef(null)
  const { signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Fetch user's name from profile
  useEffect(() => {
    fetchUserName()
  }, [user])

  const fetchUserName = async () => {
    if (!user) return
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      
      if (data?.full_name) {
        setUserName(data.full_name)
      } else {
        // Fallback to email username
        setUserName(user.email?.split('@')[0] || 'User')
      }
    } catch (error) {
      console.error('Error fetching user name:', error)
      setUserName(user.email?.split('@')[0] || 'User')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  // Fetch notifications (low stock alerts)
  useEffect(() => {
    fetchNotifications()
    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const fetchNotifications = async () => {
    try {
      // Fetch all products first
      const { data: products } = await supabase
        .from('products')
        .select('id, name, sku, quantity, reorder_level')
        .order('quantity', { ascending: true })

      if (products) {
        // Filter products where quantity <= reorder_level
        const lowStockProducts = products.filter(p => p.quantity <= p.reorder_level)
        
        const alerts = lowStockProducts.map(product => ({
          id: product.id,
          type: product.quantity === 0 ? 'critical' : 'warning',
          title: product.quantity === 0 ? 'Out of Stock' : 'Low Stock Alert',
          message: `${product.name} (${product.sku}) - Current: ${product.quantity}, Reorder: ${product.reorder_level}`,
          product: product
        }))
        setNotifications(alerts)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/dashboard/products', icon: Package },
    { name: 'Categories', path: '/dashboard/categories', icon: ShoppingCart },
    { name: 'Suppliers', path: '/dashboard/suppliers', icon: Users },
    { name: 'Stock Movement', path: '/dashboard/stock-movement', icon: TrendingUp },
    { name: 'Reports', path: '/dashboard/reports', icon: TrendingUp },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 border-2 border-black hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 border-2 border-black">
                <Package size={24} color="white" />
              </div>
              <h1 className="text-2xl font-black uppercase">StockMaster</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 border-2 border-black hover:bg-gray-100 transition-colors relative"
              >
                <Bell size={24} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
                  <div className="p-4 border-b-2 border-black bg-gray-50">
                    <h3 className="font-black uppercase text-lg">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-2 opacity-30" />
                        <p className="font-bold">No notifications</p>
                        <p className="text-sm">All stock levels are good!</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          to="/dashboard/products"
                          onClick={() => setShowNotifications(false)}
                          className="block p-4 border-b-2 border-black hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 border-2 border-black ${
                              notification.type === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                            }`}>
                              <AlertTriangle size={20} color="white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm mb-1">{notification.title}</p>
                              <p className="text-sm text-gray-600">{notification.message}</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t-2 border-black bg-gray-50">
                      <Link
                        to="/dashboard/products"
                        onClick={() => setShowNotifications(false)}
                        className="text-sm font-bold text-blue-600 hover:underline"
                      >
                        View All Products →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white">
              <User size={20} />
              <span className="font-bold">{userName || 'User'}</span>
            </div>
            
            <Button variant="danger" onClick={handleSignOut}>
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white border-r-4 border-black transition-all duration-300 overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 border-2 border-black font-bold transition-all ${
                    active
                      ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
