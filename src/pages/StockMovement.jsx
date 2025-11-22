import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Select, TextArea } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { Loading } from '../components/ui/Loading'
import { Alert } from '../components/ui/Alert'
import { Plus, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
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
    type: 'IN',
    quantity: 0,
    reason: '',
    reference_number: '',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Fetch stock movements
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products(id, name, sku)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (movementsError) throw movementsError
      setMovements(movementsData || [])

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, sku, quantity')
        .eq('user_id', user.id)
      setProducts(productsData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load stock movements')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      product_id: '',
      type: 'IN',
      quantity: 0,
      reason: '',
      reference_number: '',
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
      const { data: { user } } = await supabase.auth.getUser()
      
      // Insert stock movement
      const { error: insertError } = await supabase
        .from('stock_movements')
        .insert([{
          ...formData,
          quantity: parseInt(formData.quantity),
          user_id: user.id
        }])
      
      if (insertError) throw insertError

      // Update product quantity
      const product = products.find(p => p.id === formData.product_id)
      if (!product) throw new Error('Product not found')

      let newQuantity = product.quantity
      if (formData.type === 'IN') {
        newQuantity += parseInt(formData.quantity)
      } else if (formData.type === 'OUT') {
        newQuantity -= parseInt(formData.quantity)
        if (newQuantity < 0) throw new Error('Insufficient stock')
      } else if (formData.type === 'ADJUSTMENT') {
        newQuantity = parseInt(formData.quantity)
      }

      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', formData.product_id)
        .eq('user_id', user.id)
      
      if (updateError) throw updateError
      
      setSuccess('Stock movement recorded successfully!')
      handleCloseModal()
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving stock movement:', error)
      setError(error.message || 'Failed to save stock movement')
    }
  }

  const getMovementIcon = (type) => {
    switch (type) {
      case 'IN': return <TrendingUp size={20} className="text-green-600" />
      case 'OUT': return <TrendingDown size={20} className="text-red-600" />
      case 'ADJUSTMENT': return <RefreshCw size={20} className="text-blue-600" />
      default: return null
    }
  }

  const getMovementBadge = (type) => {
    switch (type) {
      case 'IN': return <Badge variant="success">Stock In</Badge>
      case 'OUT': return <Badge variant="danger">Stock Out</Badge>
      case 'ADJUSTMENT': return <Badge variant="info">Adjustment</Badge>
      default: return null
    }
  }

  if (loading) return <Loading size="lg" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase">Stock Movement</h1>
        <Button variant="primary" onClick={handleOpenModal}>
          <Plus size={20} className="mr-2" />
          Record Movement
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Movements Timeline */}
      <Card className="bg-white">
        <h2 className="text-2xl font-bold mb-4 uppercase">Recent Movements</h2>
        <div className="space-y-4">
          {movements.length === 0 ? (
            <p className="text-center font-bold text-gray-500 py-8">No stock movements yet</p>
          ) : (
            movements.map((movement) => (
              <div 
                key={movement.id}
                className="flex items-start gap-4 p-4 border-2 border-black bg-gray-50"
              >
                <div className="p-3 bg-white border-2 border-black">
                  {getMovementIcon(movement.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{movement.products?.name}</h3>
                      <p className="text-sm text-gray-600">SKU: {movement.products?.sku}</p>
                    </div>
                    {getMovementBadge(movement.type)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold">Quantity:</span> {movement.quantity}
                    </div>
                    <div>
                      <span className="font-bold">Date:</span> {format(new Date(movement.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                    {movement.reason && (
                      <div className="col-span-2">
                        <span className="font-bold">Reason:</span> {movement.reason}
                      </div>
                    )}
                    {movement.reference_number && (
                      <div>
                        <span className="font-bold">Ref:</span> {movement.reference_number}
                      </div>
                    )}
                    {movement.notes && (
                      <div className="col-span-2">
                        <span className="font-bold">Notes:</span> {movement.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
              Record
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Select
            label="Product"
            value={formData.product_id}
            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku}) - Current: {product.quantity}
              </option>
            ))}
          </Select>

          <Select
            label="Movement Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="IN">Stock In (Add)</option>
            <option value="OUT">Stock Out (Remove)</option>
            <option value="ADJUSTMENT">Adjustment (Set to specific value)</option>
          </Select>

          <Input
            type="number"
            label={formData.type === 'ADJUSTMENT' ? 'Set Quantity To' : 'Quantity'}
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            min="0"
          />

          <Input
            label="Reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="e.g., Purchase, Sale, Damage, etc."
          />

          <Input
            label="Reference Number"
            value={formData.reference_number}
            onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
            placeholder="e.g., PO-12345, INV-67890"
          />

          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes..."
          />
        </form>
      </Modal>
    </div>
  )
}
