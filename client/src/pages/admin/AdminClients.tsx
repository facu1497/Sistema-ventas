import { useState, useEffect } from 'react';
import type { Client } from '../../types';
import { Trash2 } from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = () => {
    setLoading(true);
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este cliente?')) return;
    await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    fetchClients();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Directorio de Clientes</h1>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Nombre</th>
              <th style={{ padding: '1rem' }}>Teléfono</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Instagram</th>
              <th style={{ padding: '1rem' }}>Registrado el</th>
              <th style={{ padding: '1rem' }}>Órdenes</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</td></tr>
            ) : clients.map((c: any) => (
              <tr key={c.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.name}</td>
                <td style={{ padding: '1rem' }}>
                  <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                    {c.phone}
                  </a>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.email || '-'}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.instagram || '-'}</td>
                <td style={{ padding: '1rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                    {c._count?.orders || 0}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => handleDelete(c.id)}>
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
