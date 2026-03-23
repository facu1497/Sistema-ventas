import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Send, Trash } from 'lucide-react';

export default function ClientCart() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [client, setClient] = useState({ name: '', phone: '', email: '', instagram: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client,
          items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price }))
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al procesar reserva');
      }

      // Generate WhatsApp message
      const text = `¡Hola! Quiero reservar los siguientes productos:\n\n${items.map(i => `- ${i.quantity}x ${i.name} ($${i.price * i.quantity})`).join('\n')}\n\n*Total: $${getCartTotal()}*\n\nMis datos:\nNombre: ${client.name}\n${client.instagram ? `Instagram: ${client.instagram}` : ''}`;
      const waUrl = `https://api.whatsapp.com/send?phone=1154718365&text=${encodeURIComponent(text)}`;
      
      clearCart();
      window.open(waUrl, '_blank');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Tu reserva está vacía</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Resumen de Reserva</h2>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>{item.name}</h4>
              <p style={{ color: 'var(--text-muted)' }}>${item.price.toFixed(2)} x {item.quantity}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="number" 
                min="1" 
                max={item.stockQuantity} 
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="form-input"
                style={{ width: '80px', padding: '0.4rem' }}
              />
              <button onClick={() => removeItem(item.id)} className="btn btn-outline" style={{ padding: '0.4rem' }}>
                <Trash size={18} color="var(--danger)" />
              </button>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <span>Total</span>
          <span style={{ color: 'var(--success)' }}>${getCartTotal().toFixed(2)}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Tus Datos</h2>
        {error && <div style={{ color: 'white', background: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre y Apellido *</label>
            <input required type="text" className="form-input" value={client.name} onChange={e => setClient({...client, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono / WhatsApp *</label>
            <input required type="tel" className="form-input" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email (Opcional)</label>
            <input type="email" className="form-input" value={client.email} onChange={e => setClient({...client, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Instagram (Opcional)</label>
            <input type="text" className="form-input" value={client.instagram} onChange={e => setClient({...client, instagram: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="btn btn-success" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
            <Send size={20} />
            {loading ? 'Procesando...' : 'Confirmar Reserva en WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
