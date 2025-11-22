import { useEffect, useState } from 'react'
import { productsApi, categoriesApi, suppliersApi } from '../api/client'
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
    category_id: '',
    supplier_id: '',
    cost_price: 0,
    selling_price: 0,
    quantity: 0,
    reorder_level: 10,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel using backend API
      const [productsData, categoriesData, suppliersData] = await Promise.all([
        productsApi.list(),
        categoriesApi.list(),
        suppliersApi.list(),
      ])
      
      setProducts(productsData || [])
      setCategories(categoriesData || [])
      setSuppliers(suppliersData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        sku: product.sku || '',
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        cost_price: product.cost_price || 0,
        selling_price: product.selling_price || 0,
        quantity: product.quantity || 0,
        reorder_level: product.reorder_level || 10,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        sku: '',
        category_id: '',
        supplier_id: '',
        cost_price: 0,
        selling_price: 0,
        quantity: 0,
        reorder_level: 10,
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
      // Clean up empty strings to null for optional fields
      const cleanData = {
        ...formData,
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null,
        sku: formData.sku || null,
        cost_price: parseFloat(formData.cost_price) || null,
        selling_price: parseFloat(formData.selling_price) || null,
        quantity: parseInt(formData.quantity) || 0,
        reorder_level: parseInt(formData.reorder_level) || null,
      }

      if (editingProduct) {
        // Update existing product via backend API
        await productsApi.update(editingProduct.id, cleanData)
        setSuccess('Product updated successfully!')
      } else {
        // Create new product via backend API
        await productsApi.create(cleanData)
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
      await productsApi.delete(productId)
      setSuccess('Product deleted successfully!')
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error deleting product:', error)
      setError(error.message || 'Failed to delete product')
    }
  }

  const getStockStatus = (product) => {
    const qty = product.quantity || 0
    const reorder = product.reorder_level || 10
    
    if (qty === 0) return { variant: 'danger', text: 'Out of Stock' }
    if (qty <= reorder) return { variant: 'warning', text: 'Low Stock' }
    return { variant: 'success', text: 'In Stock' }
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || '-'
  }

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId)
    return supplier?.name || '-'
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Total Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-8 font-bold">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const status = getStockStatus(product)
                const totalValue = (product.quantity || 0) * (product.selling_price || 0)
                return (
                  <tr key={product.id}>
                    <td className="font-mono">{product.sku || '-'}</td>
                    <td className="font-bold">{product.name}</td>
                    <td>{getCategoryName(product.category_id)}</td>
                    <td>{getSupplierName(product.supplier_id)}</td>
                    <td className="font-bold">{product.quantity || 0}</td>
                    <td className="font-mono">${(product.cost_price || 0).toFixed(2)}</td>
                    <td className="font-mono">${(product.selling_price || 0).toFixed(2)}</td>
                    <td className="font-bold">${totalValue.toFixed(2)}</td>
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
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Select Category (Optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>

            <Select
              label="Supplier"
              value={formData.supplier_id}
              onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
            >
              <option value="">Select Supplier (Optional)</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              label="Cost Price"
              value={formData.cost_price}
              onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
              step="0.01"
              placeholder="0.00"
            />
            <Input
              type="number"
              label="Selling Price"
              value={formData.selling_price}
              onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
              step="0.01"
              placeholder="0.00"
            />
            <Input
              type="number"
              label="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <Input
            type="number"
            label="Reorder Level"
            value={formData.reorder_level}
            onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
            placeholder="10"
          />
        </form>
      </Modal>
    </div>
  )
}
