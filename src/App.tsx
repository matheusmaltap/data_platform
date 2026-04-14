import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Discovery } from './pages/Discovery';
import { Cart } from './pages/Cart';
import { AccessRequests } from './pages/AccessRequests';
import { IngestionList } from './pages/IngestionList';
import { IngestionNew } from './pages/IngestionNew';
import { IngestionDetail } from './pages/IngestionDetail';
import { SourceList } from './pages/SourceList';
import { SourceNew } from './pages/SourceNew';
import { ProductList } from './pages/ProductList';
import { ProductNew } from './pages/ProductNew';
import { ProductDetail } from './pages/ProductDetail';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Discovery />} />
            <Route path="/discovery/cart" element={<Cart />} />
            <Route path="/access-requests" element={<AccessRequests />} />
            <Route path="/ingestion" element={<IngestionList />} />
            <Route path="/ingestion/new" element={<IngestionNew />} />
            <Route path="/ingestion/sources" element={<SourceList />} />
            <Route path="/ingestion/sources/new" element={<SourceNew />} />
            <Route path="/ingestion/:id" element={<IngestionDetail />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductNew />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
