import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { Card } from '../components/ui/Card'
import { Loading } from '../components/ui/Loading'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react'

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [productsData, setProductsData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [stockMovementData, setStockMovementData] = useState([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    totalMovements: 0,
    avgPrice: 0
  })

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#EC4899', '#14B8A6']

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      // Fetch products with categories (shared data model - no user_id filter)
      const { data: products } = await supabase
        .from('products')
        .select('*, categories(name, color)')
      
      // Fetch stock movements for last 30 days (shared data model - no user_id filter)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data: movements } = await supabase
        .from('stock_movements')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (products) {
        // Calculate stats
        const totalProducts = products.length
        const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.selling_price), 0)
        const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0
        
        setStats({
          totalProducts,
          totalValue,
          totalMovements: movements?.length || 0,
          avgPrice
        })

        // Top 10 products by value
        const topProducts = [...products]
          .sort((a, b) => (b.quantity * b.selling_price) - (a.quantity * a.selling_price))
          .slice(0, 10)
          .map(p => ({
            name: p.name,
            value: p.quantity * p.selling_price,
            quantity: p.quantity
          }))
        setProductsData(topProducts)

        // Group by category
        const categoryMap = {}
        products.forEach(product => {
          const categoryName = product.categories?.name || 'Uncategorized'
          if (!categoryMap[categoryName]) {
            categoryMap[categoryName] = { 
              name: categoryName, 
              value: 0,
              count: 0 
            }
          }
          categoryMap[categoryName].value += product.quantity * product.selling_price
          categoryMap[categoryName].count += 1
        })
        setCategoryData(Object.values(categoryMap))
      }

      // Process stock movements by day
      if (movements) {
        const movementsByDay = {}
        movements.forEach(movement => {
          const date = new Date(movement.created_at).toLocaleDateString()
          if (!movementsByDay[date]) {
            movementsByDay[date] = { date, in: 0, out: 0 }
          }
          if (movement.type === 'in') {
            movementsByDay[date].in += movement.quantity
          } else if (movement.type === 'out') {
            movementsByDay[date].out += movement.quantity
          }
        })
        setStockMovementData(Object.values(movementsByDay))
      }

    } catch (error) {
      console.error('Error fetching reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading size="lg" />

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black uppercase">Reports & Analytics</h1>

      {/* Summary Stats */}
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
              <p className="text-4xl font-black mt-2">${stats.totalValue.toFixed(0)}</p>
            </div>
            <div className="p-4 bg-green-500 border-2 border-black">
              <DollarSign size={32} color="white" />
            </div>
          </div>
        </Card>

        <Card className="bg-purple-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gray-700">Avg Value/Product</p>
              <p className="text-4xl font-black mt-2">${stats.avgPrice.toFixed(0)}</p>
            </div>
            <div className="p-4 bg-purple-500 border-2 border-black">
              <TrendingUp size={32} color="white" />
            </div>
          </div>
        </Card>

        <Card className="bg-orange-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-gray-700">Movements (30d)</p>
              <p className="text-4xl font-black mt-2">{stats.totalMovements}</p>
            </div>
            <div className="p-4 bg-orange-500 border-2 border-black">
              <TrendingDown size={32} color="white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Value */}
        <Card className="bg-yellow-100">
          <h2 className="text-2xl font-bold uppercase mb-4">Top Products by Value</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={productsData}>
              <CartesianGrid strokeWidth={2} stroke="#000" />
              <XAxis dataKey="name" stroke="#000" strokeWidth={2} angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#000" strokeWidth={2} />
              <Tooltip 
                contentStyle={{ 
                  border: '2px solid black', 
                  backgroundColor: 'white',
                  fontWeight: 'bold' 
                }} 
              />
              <Bar dataKey="value" fill="#3B82F6" stroke="#000" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-pink-100">
          <h2 className="text-2xl font-bold uppercase mb-4">Value by Category</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                stroke="#000"
                strokeWidth={2}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  border: '2px solid black', 
                  backgroundColor: 'white',
                  fontWeight: 'bold' 
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Stock Movement Trend */}
        <Card className="bg-green-100 lg:col-span-2">
          <h2 className="text-2xl font-bold uppercase mb-4">Stock Movement Trend (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stockMovementData}>
              <CartesianGrid strokeWidth={2} stroke="#000" />
              <XAxis dataKey="date" stroke="#000" strokeWidth={2} />
              <YAxis stroke="#000" strokeWidth={2} />
              <Tooltip 
                contentStyle={{ 
                  border: '2px solid black', 
                  backgroundColor: 'white',
                  fontWeight: 'bold' 
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="in" 
                stroke="#10B981" 
                strokeWidth={3} 
                name="Stock In"
                dot={{ stroke: '#000', strokeWidth: 2, fill: '#10B981' }}
              />
              <Line 
                type="monotone" 
                dataKey="out" 
                stroke="#EF4444" 
                strokeWidth={3} 
                name="Stock Out"
                dot={{ stroke: '#000', strokeWidth: 2, fill: '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category Details Table */}
      <Card className="bg-white">
        <h2 className="text-2xl font-bold uppercase mb-4">Category Breakdown</h2>
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Category</th>
              <th>Product Count</th>
              <th>Total Value</th>
              <th>Avg Value</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((category, index) => (
              <tr key={index}>
                <td className="font-bold">{category.name}</td>
                <td>{category.count}</td>
                <td className="font-mono">${category.value.toFixed(2)}</td>
                <td className="font-mono">${(category.value / category.count).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
