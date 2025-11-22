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
    email: '',
    phone: '',
    address: '',
    contact_person: ''
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
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
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        contact_person: supplier.contact_person || ''
      })
    } else {
      setEditingSupplier(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        contact_person: ''
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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (editingSupplier) {
        const { error: updateError } = await supabase
          .from('suppliers')
          .update(formData)
          .eq('id', editingSupplier.id)
          .eq('user_id', user.id)
        
        if (updateError) throw updateError
        setSuccess('Supplier updated successfully!')
      } else {
        const { error: insertError } = await supabase
          .from('suppliers')
          .insert([{
            ...formData,
            user_id: user.id
          }])
        
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
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId)
        .eq('user_id', user.id)
      
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
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          Add Supplier
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
                {supplier.contact_person && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Contact:</span>
                    <span>{supplier.contact_person}</span>
                  </div>
                )}
                
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span className="text-sm">{supplier.email}</span>
                  </div>
                )}
                
                {supplier.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span className="text-sm">{supplier.phone}</span>
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
                  className="flex-1"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(supplier.id)}
                  className="flex-1"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
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
            label="Contact Person"
            value={formData.contact_person}
            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
          />
          
          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          
          <Input
            type="tel"
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
