import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { Card } from '../components/ui/Card'
import { Loading } from '../components/ui/Loading'
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryData, setCategoryData] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('user_id', user.id)
      
      if (productsError) throw productsError

      // Calculate stats
      const totalProducts = products?.length || 0
      const lowStock = products?.filter(p => p.quantity <= p.min_stock_level && p.quantity > 0).length || 0
      const outOfStock = products?.filter(p => p.quantity === 0).length || 0
      const totalValue = products?.reduce((sum, p) => sum + (p.quantity * p.unit_price), 0) || 0

      setStats({ totalProducts, lowStock, outOfStock, totalValue })
      
      // Get recent products
      const recent = products?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5) || []
      setRecentProducts(recent)

      // Group by category for chart
      const categoryMap = {}
      products?.forEach(product => {
        const categoryName = product.categories?.name || 'Uncategorized'
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = { name: categoryName, count: 0, value: 0 }
        }
        categoryMap[categoryName].count += 1
        categoryMap[categoryName].value += product.quantity * product.unit_price
      })
      setCategoryData(Object.values(categoryMap))
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading size="lg" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gray-700">Total Products</p>
              <p className="text-4xl font-black mt-2">{stats.totalProducts}</p>
            </div>
            <div className="p-4 bg-blue-500 border-2 border-black">
              <Package size={32} color="white" />
            </div>
          </div>
        </Card>

        <Card className="bg-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gray-700">Total Value</p>
              <p className="text-4xl font-black mt-2">${stats.totalValue.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-500 border-2 border-black">
              <ShoppingCart size={32} color="white" />
            </div>
          </div>
        </Card>

        <Card className="bg-orange-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gray-700">Low Stock</p>
              <p className="text-4xl font-black mt-2">{stats.lowStock}</p>
            </div>
            <div className="p-4 bg-orange-500 border-2 border-black">
              <AlertTriangle size={32} color="white" />
            </div>
          </div>
        </Card>

        <Card className="bg-red-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gray-700">Out of Stock</p>
              <p className="text-4xl font-black mt-2">{stats.outOfStock}</p>
            </div>
            <div className="p-4 bg-red-500 border-2 border-black">
              <TrendingUp size={32} color="white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-yellow-100">
          <h2 className="text-2xl font-bold uppercase mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeWidth={2} stroke="#000" />
              <XAxis dataKey="name" stroke="#000" strokeWidth={2} />
              <YAxis stroke="#000" strokeWidth={2} />
              <Tooltip 
                contentStyle={{ 
                  border: '2px solid black', 
                  backgroundColor: 'white',
                  fontWeight: 'bold' 
                }} 
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" stroke="#000" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-pink-100">
          <h2 className="text-2xl font-bold uppercase mb-4">Recent Products</h2>
          <div className="space-y-3">
            {recentProducts.length === 0 ? (
              <p className="text-center font-bold text-gray-500 py-8">No products yet</p>
            ) : (
              recentProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-white border-2 border-black"
                >
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Qty: {product.quantity}</p>
                    <p className="text-sm text-gray-600">${product.unit_price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
