import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from './store/useCartStore';
import ClientPortal from './pages/ClientPortal';
import ClientCart from './pages/ClientCart';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminClients from './pages/admin/AdminClients';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  const cartItemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <header className="glass-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            Store
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/admin" className="btn btn-outline">Admin</Link>
            <Link to="/cart" className="btn btn-primary" style={{ position: 'relative' }}>
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span style={{ 
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'var(--danger)', color: 'white', 
                  borderRadius: '50%', width: '20px', height: '20px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 'bold'
                }}>
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="container animate-fade-in">
        <Routes>
          <Route path="/" element={<ClientPortal />} />
          <Route path="/cart" element={<ClientCart />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
