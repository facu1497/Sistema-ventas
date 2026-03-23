import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { Edit2, Plus, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/products/${isEditing}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity)
      })
    });

    setFormData({ name: '', description: '', price: 0, stockQuantity: 0 });
    setIsEditing(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setIsEditing(p.id);
    setFormData({ name: p.name, description: p.description, price: p.price, stockQuantity: p.stockQuantity });
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Gestión de Stock</h1>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input type="text" className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Precio ($)</label>
            <input required type="number" min="0" step="0.01" className="form-input" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          </div>
          <div className="form-group">
            <label className="form-label">Cantidad (Stock)</label>
            <input required type="number" min="0" className="form-input" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: Number(e.target.value)})} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
              {isEditing ? 'Actualizar' : 'Crear Producto'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={() => { setIsEditing(null); setFormData({name: '', description: '', price: 0, stockQuantity: 0}) }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Nombre</th>
              <th style={{ padding: '1rem' }}>Descripción</th>
              <th style={{ padding: '1rem' }}>Precio</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</td></tr>
            ) : products.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>{p.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{p.description}</td>
                <td style={{ padding: '1rem' }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: '1rem', color: p.stockQuantity === 0 ? 'var(--danger)' : 'var(--success)' }}>{p.stockQuantity}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => handleEdit(p)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
