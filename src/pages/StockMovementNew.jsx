import { useEffect, useState } from 'react'
import { productsApi, stockMovementsApi } from '../api/client'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Select, TextArea } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { Loading } from '../components/ui/Loading'
import { Alert } from '../components/ui/Alert'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'

export default function StockMovement() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    product_id: '',
    type: 'in',
    quantity: 0,
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch stock movements and products in parallel
      const [movementsData, productsData] = await Promise.all([
        stockMovementsApi.list(),
        productsApi.list(),
      ])
      
      setMovements(movementsData || [])
      setProducts(productsData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message || 'Failed to load stock movements')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      product_id: '',
      type: 'in',
      quantity: 0,
      notes: ''
    })
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      // Create stock movement via backend API
      // Backend will automatically update the product quantity
      const result = await stockMovementsApi.create({
        product_id: formData.product_id,
        type: formData.type,
        quantity: parseFloat(formData.quantity),
        notes: formData.notes || null,
      })
      
      setSuccess(`Stock movement recorded! Product quantity updated to ${result.product.quantity}`)
      handleCloseModal()
      fetchData()
      setTimeout(() => setSuccess(''), 5000)
    } catch (error) {
      console.error('Error recording movement:', error)
      setError(error.message || 'Failed to record stock movement')
    }
  }

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? `${product.name}${product.sku ? ` (${product.sku})` : ''}` : 'Unknown Product'
  }

  const getMovementIcon = (type) => {
    return type === 'in' ? (
      <TrendingUp className="text-green-600" size={20} />
    ) : (
      <TrendingDown className="text-red-600" size={20} />
    )
  }

  const getMovementBadge = (type) => {
    return type === 'in' ? (
      <Badge variant="success">Stock In</Badge>
    ) : (
      <Badge variant="danger">Stock Out</Badge>
    )
  }

  if (loading) return <Loading size="lg" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase">Stock Movements</h1>
        <Button variant="primary" onClick={handleOpenModal}>
          <Plus size={20} className="mr-2" />
          Record Movement
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase mb-2">Total Stock In</p>
              <p className="text-3xl font-black">
                {movements.filter(m => m.type === 'in').reduce((sum, m) => sum + (m.quantity || 0), 0)}
              </p>
            </div>
            <TrendingUp size={40} className="text-green-600" />
          </div>
        </Card>

        <Card className="bg-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase mb-2">Total Stock Out</p>
              <p className="text-3xl font-black">
                {movements.filter(m => m.type === 'out').reduce((sum, m) => sum + (m.quantity || 0), 0)}
              </p>
            </div>
            <TrendingDown size={40} className="text-red-600" />
          </div>
        </Card>

        <Card className="bg-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase mb-2">Total Movements</p>
              <p className="text-3xl font-black">{movements.length}</p>
            </div>
            <div className="text-4xl font-black">📦</div>
          </div>
        </Card>
      </div>

      {/* Movements Table */}
      <Card className="bg-white overflow-x-auto">
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 font-bold">
                  No stock movements recorded yet
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="font-mono">
                    {format(new Date(movement.created_at), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="font-bold">{getProductName(movement.product_id)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getMovementIcon(movement.type)}
                      {getMovementBadge(movement.type)}
                    </div>
                  </td>
                  <td className="font-black text-lg">
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                  </td>
                  <td>{movement.notes || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Stock Movement Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Record Stock Movement"
        footer={
          <>
            <Button variant="default" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Record Movement
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Product"
            value={formData.product_id}
            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} {product.sku ? `(${product.sku})` : ''} - Current: {product.quantity || 0}
              </option>
            ))}
          </Select>

          <Select
            label="Movement Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="in">Stock In (Add to inventory)</option>
            <option value="out">Stock Out (Remove from inventory)</option>
          </Select>

          <Input
            type="number"
            label="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            min="0.01"
            step="0.01"
          />

          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional notes about this movement..."
            rows={3}
          />

          {formData.product_id && formData.quantity > 0 && (
            <Alert variant="info">
              <strong>Preview:</strong> {formData.type === 'in' ? 'Adding' : 'Removing'}{' '}
              <strong>{formData.quantity}</strong> unit(s) {formData.type === 'in' ? 'to' : 'from'}{' '}
              {getProductName(formData.product_id)}
            </Alert>
          )}
        </form>
      </Modal>
    </div>
  )
}
