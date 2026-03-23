import { useState, useEffect } from 'react';
import type { Order } from '../../types';
import { Check, X, Clock } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    if (!confirm(`¿Estás seguro de marcar esta reserva como ${status}?`)) return;
    
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    fetchOrders();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'APPROVED': return <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Check size={16}/> Aprobada</span>;
      case 'REJECTED': return <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><X size={16}/> Rechazada</span>;
      default: return <span style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={16}/> Pendiente</span>;
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Reservas y Facturación</h1>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {loading ? (
          <div>Cargando...</div>
        ) : orders.map((order: any) => (
          <div key={order.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>Reserva #{order.id.slice(-6).toUpperCase()}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {getStatusBadge(order.status)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Datos del Cliente</h4>
                <p><strong>{order.client?.name}</strong></p>
                <p>📞 <a href={`https://wa.me/${order.client?.phone}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{order.client?.phone}</a></p>
                {order.client?.email && <p>✉️ {order.client.email}</p>}
                {order.client?.instagram && <p>📱 @{order.client.instagram}</p>}
              </div>
              
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Artículos</h4>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                  {order.items?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{item.quantity}x {item.product?.name || 'Producto eliminado'}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontWeight: 'bold' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--success)' }}>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleStatusChange(order.id, 'REJECTED')}>
                  <X size={18} /> Rechazar
                </button>
                <button className="btn btn-success" onClick={() => handleStatusChange(order.id, 'APPROVED')}>
                  <Check size={18} /> Aprobar Reserva
                </button>
              </div>
            )}
            
          </div>
        ))}
        {orders.length === 0 && !loading && (
           <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
             No hay reservas registradas.
           </div>
        )}
      </div>
    </div>
  );
}
