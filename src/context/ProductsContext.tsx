import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

export interface Product {
  id: number;
  image: string;
  code: string;
  name: string;
  brand: string;
  agent: string;
  category: string;
  categoryId?: number;
  cost: string;
  price: string;
  quantity: string;
  unit: string;
  alertQuantity: string;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  deleteMultipleProducts: (ids: number[]) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// يحول منتج الـ API إلى شكل الواجهة الحالية
const mapApiProduct = (p: any, index: number): Product => {
  const id = Number(p?.id ?? p?.productId ?? index + 1);
  return {
    id,
    image: '', // يمكن ربطه لاحقاً إن وُجد حقل للصورة
    code: String(p?.barcode ?? p?.code ?? id),
    name: String(p?.productName ?? p?.name ?? ''),
    brand: String(p?.brand ?? ''),
    agent: '',
    category: String(p?.categoryName ?? p?.category ?? ''),
    categoryId: p?.categoryId ?? p?.id ?? id,
    cost: String(p?.costPrice ?? p?.cost ?? '0'),
    price: String(p?.sellingPrice ?? p?.price ?? '0'),
    quantity: String(p?.quantity ?? '0'),
    unit: String(p?.unit ?? 'وحدة'),
    alertQuantity: String(p?.minStockLevel ?? p?.alertQuantity ?? '0'),
  };
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // دالة موحدة لتحميل المنتجات من الـ API (GET /api/Products)
  const loadFromApi = async () => {
    try {
      const token = localStorage.getItem('takamul_token');
      const res = await fetch(`${AUTH_API_BASE}/api/Products`, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        console.warn('Failed to fetch products from API, status:', res.status);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((p: any, idx: number) => mapApiProduct(p, idx));
        setProducts(mapped);
      }
    } catch (err) {
      console.error('Error loading products from API', err);
    }
  };

  useEffect(() => {
    loadFromApi();
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    // إرسال للـ API: POST /api/Products/add ثم إعادة تحميل القائمة
    (async () => {
      try {
        const token = localStorage.getItem('takamul_token');
        const payload = {
          barcode: product.code,
          productName: product.name,
          description: '',
          categoryId: product.categoryId ?? 0,
          costPrice: Number(product.cost || '0'),
          sellingPrice: Number(product.price || '0'),
          minStockLevel: Number(product.alertQuantity || '0'),
          parentProductId: 0,
          producttype: 1,
        };
        const res = await fetch(`${AUTH_API_BASE}/api/Products/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error('Failed to add product via API, status:', res.status);
          return;
        }
        await loadFromApi();
      } catch (err) {
        console.error('Failed to add product via API', err);
      }
    })();
  };

  const deleteProduct = (id: number) => {
    (async () => {
      try {
        const token = localStorage.getItem('takamul_token');
        const res = await fetch(`${AUTH_API_BASE}/api/Products/${id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          console.error('Failed to delete product via API, status:', res.status);
          return;
        }
        await loadFromApi();
      } catch (err) {
        console.error('Failed to delete product via API', err);
      }
    })();
  };

  const deleteMultipleProducts = (ids: number[]) => {
    (async () => {
      try {
        const token = localStorage.getItem('takamul_token');
        await Promise.all(
          ids.map((id) =>
            fetch(`${AUTH_API_BASE}/api/Products/${id}`, {
              method: 'DELETE',
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            })
          )
        );
        await loadFromApi();
      } catch (err) {
        console.error('Failed to delete products via API', err);
      }
    })();
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    // حالياً نحدّث في الواجهة فقط؛ يمكن لاحقاً ربطه بـ PUT /api/Products/{id}
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    setProducts(updated);
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct, deleteMultipleProducts, updateProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
