import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { Loading } from '../components/ui/Loading'
import { Alert } from '../components/ui/Alert'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category_id: '',
    supplier_id: '',
    unit_price: 0,
    quantity: 0,
    min_stock_level: 10,
    max_stock_level: 1000,
    barcode: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Fetch products with related data
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, color),
          suppliers(id, name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (productsError) throw productsError
      setProducts(productsData || [])

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
      setCategories(categoriesData || [])

      // Fetch suppliers
      const { data: suppliersData } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
      setSuppliers(suppliersData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        unit_price: product.unit_price,
        quantity: product.quantity,
        min_stock_level: product.min_stock_level,
        max_stock_level: product.max_stock_level,
        barcode: product.barcode || ''
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        sku: '',
        description: '',
        category_id: '',
        supplier_id: '',
        unit_price: 0,
        quantity: 0,
        min_stock_level: 10,
        max_stock_level: 1000,
        barcode: ''
      })
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (editingProduct) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)
          .eq('user_id', user.id)
        
        if (updateError) throw updateError
        setSuccess('Product updated successfully!')
      } else {
        // Create new product
        const { error: insertError } = await supabase
          .from('products')
          .insert([{
            ...formData,
            user_id: user.id
          }])
        
        if (insertError) throw insertError
        setSuccess('Product created successfully!')
      }
      
      handleCloseModal()
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving product:', error)
      setError(error.message || 'Failed to save product')
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', user.id)
      
      if (deleteError) throw deleteError
      
      setSuccess('Product deleted successfully!')
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product')
    }
  }

  const getStockStatus = (product) => {
    if (product.quantity === 0) return { variant: 'danger', text: 'Out of Stock' }
    if (product.quantity <= product.min_stock_level) return { variant: 'warning', text: 'Low Stock' }
    return { variant: 'success', text: 'In Stock' }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loading size="lg" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase">Products</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Search Bar */}
      <Card className="bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" size={20} />
          <Input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card className="bg-white overflow-x-auto">
        <table className="table-brutal">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 font-bold">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const status = getStockStatus(product)
                return (
                  <tr key={product.id}>
                    <td className="font-mono">{product.sku}</td>
                    <td className="font-bold">{product.name}</td>
                    <td>
                      {product.categories ? (
                        <span className="px-2 py-1 border-2 border-black text-sm font-bold" style={{ backgroundColor: product.categories.color }}>
                          {product.categories.name}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{product.suppliers?.name || '-'}</td>
                    <td className="font-bold">{product.quantity}</td>
                    <td className="font-mono">${product.unit_price.toFixed(2)}</td>
                    <td className="font-bold">${(product.quantity * product.unit_price).toFixed(2)}</td>
                    <td>
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 bg-blue-500 text-white border-2 border-black hover:bg-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-500 text-white border-2 border-black hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </Card>

      {/* Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
        footer={
          <>
            <Button variant="default" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>

            <Select
              label="Supplier"
              value={formData.supplier_id}
              onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Unit Price"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
              required
              step="0.01"
            />
            <Input
              type="number"
              label="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Min Stock Level"
              value={formData.min_stock_level}
              onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt(e.target.value) })}
            />
            <Input
              type="number"
              label="Max Stock Level"
              value={formData.max_stock_level}
              onChange={(e) => setFormData({ ...formData, max_stock_level: parseInt(e.target.value) })}
            />
          </div>

          <Input
            label="Barcode"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  )
}
