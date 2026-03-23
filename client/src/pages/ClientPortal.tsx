import { useEffect, useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../types';

export default function ClientPortal() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('API no disponible');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock data for GitHub pages UI testing
        const localData = localStorage.getItem('demo_products');
        if (localData) {
          setProducts(JSON.parse(localData));
        } else {
          const initialMock = [
            { id: '1', name: 'Producto Demo 1', description: 'Descripción de prueba para visualizar el diseño en Github Pages', price: 1500, stockQuantity: 10 },
            { id: '2', name: 'Producto Demo 2', description: 'Este producto simula no tener stock', price: 3200, stockQuantity: 0 },
            { id: '3', name: 'Producto Demo 3', description: 'Otro producto de prueba', price: 950, stockQuantity: 5 },
          ];
          localStorage.setItem('demo_products', JSON.stringify(initialMock));
          setProducts(initialMock);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando catálogo...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Catálogo de Productos</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {products.map((product) => (
          <div key={product.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h2>
            <p style={{ color: 'var(--text-muted)', flex: 1, marginBottom: '1rem' }}>{product.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                ${product.price.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.9rem', color: product.stockQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
                Stock: {product.stockQuantity}
              </span>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={product.stockQuantity <= 0}
              onClick={() => addItem(product)}
            >
              <PackagePlus size={18} />
              {product.stockQuantity > 0 ? 'Añadir a Reserva' : 'Agotado'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
