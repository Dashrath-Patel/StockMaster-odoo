import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Loading } from '../components/ui/Loading'
import { Alert } from '../components/ui/Alert'
import { Plus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSuppliers(data || [])
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      setError('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier)
      setFormData({
        name: supplier.name,
        contact_email: supplier.contact_email || '',
        contact_phone: supplier.contact_phone || '',
        address: supplier.address || ''
      })
    } else {
      setEditingSupplier(null)
      setFormData({
        name: '',
        contact_email: '',
        contact_phone: '',
        address: ''
      })
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingSupplier(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      if (editingSupplier) {
        const { error: updateError } = await supabase
          .from('suppliers')
          .update(formData)
          .eq('id', editingSupplier.id)
        
        if (updateError) throw updateError
        setSuccess('Supplier updated successfully!')
      } else {
        const { error: insertError } = await supabase
          .from('suppliers')
          .insert([formData])
        
        if (insertError) throw insertError
        setSuccess('Supplier created successfully!')
      }
      
      handleCloseModal()
      fetchSuppliers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving supplier:', error)
      setError(error.message || 'Failed to save supplier')
    }
  }

  const handleDelete = async (supplierId) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return
    
    try {
      const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId)
      
      if (deleteError) throw deleteError
      
      setSuccess('Supplier deleted successfully!')
      fetchSuppliers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error deleting supplier:', error)
      setError('Failed to delete supplier')
    }
  }

  if (loading) return <Loading size="lg" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase">Suppliers</h1>
        <Button variant="primary" onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} />
          <span>Add Supplier</span>
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.length === 0 ? (
          <Card className="col-span-full bg-white">
            <p className="text-center font-bold text-gray-500 py-8">No suppliers yet</p>
          </Card>
        ) : (
          suppliers.map((supplier) => (
            <Card key={supplier.id} className="bg-green-100">
              <h3 className="text-xl font-bold mb-4">{supplier.name}</h3>
              
              <div className="space-y-2 mb-4">
                {supplier.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span className="text-sm">{supplier.contact_email}</span>
                  </div>
                )}
                
                {supplier.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span className="text-sm">{supplier.contact_phone}</span>
                  </div>
                )}
                
                {supplier.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-1" />
                    <span className="text-sm">{supplier.address}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => handleOpenModal(supplier)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(supplier.id)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Supplier Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        footer={
          <>
            <Button variant="default" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingSupplier ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Supplier Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            type="email"
            label="Email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
          />
          
          <Input
            type="tel"
            label="Phone"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
          />
          
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  )
}
