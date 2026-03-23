import { Link } from 'react-router-dom';
import { Package, Users, FileText } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Panel de Administración</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        
        <Link to="/admin/products" className="glass-panel" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.2s', display: 'block' }}>
          <Package size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2>Productos (Stock)</h2>
          <p style={{ color: 'var(--text-muted)' }}>Gestionar inventario y precios</p>
        </Link>
        
        <Link to="/admin/orders" className="glass-panel" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.2s', display: 'block' }}>
          <FileText size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2>Facturación / Reservas</h2>
          <p style={{ color: 'var(--text-muted)' }}>Aprobar o rechazar reservas pendientes</p>
        </Link>
        
        <Link to="/admin/clients" className="glass-panel" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.2s', display: 'block' }}>
          <Users size={48} color="#a855f7" style={{ marginBottom: '1rem' }} />
          <h2>Clientes</h2>
          <p style={{ color: 'var(--text-muted)' }}>Lista de clientes registrados</p>
        </Link>

      </div>
    </div>
  );
}
