import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

export interface Group {
  id: number;
  code: string;
  name: string;
}

interface GroupsContextType {
  groups: Group[];
  addGroup: (name: string) => void;
  deleteGroup: (id: number) => void;
  duplicateGroup: (id: number) => void;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('takamul_groups');
    return saved ? JSON.parse(saved) : [
      { id: 1, code: 'GP-001', name: 'مجموعة رئيسية' },
      { id: 2, code: 'GP-002', name: 'مجموعة فرعية' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_groups', JSON.stringify(groups));
  }, [groups]);

  // تحميل المجموعات من الـ API: GET /api/ProductCategories
  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const token = localStorage.getItem('takamul_token');
        const res = await fetch(`${AUTH_API_BASE}/api/ProductCategories`, {
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          console.warn('Failed to fetch product categories from API, status:', res.status);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Group[] = data.map((c: any, idx: number) => {
            const id = Number(c?.id ?? c?.categoryId ?? idx + 1);
            const name = String(c?.categoryName ?? c?.name ?? '');
            return {
              id,
              code: c?.code ?? `CAT-${String(id).padStart(3, '0')}`,
              name,
            };
          });
          setGroups(mapped);
        }
      } catch (err) {
        console.error('Error loading product categories from API', err);
      }
    };
    loadFromApi();
  }, []);

  const addGroup = (name: string) => {
    const nextId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
    const nextCodeNum = groups.length > 0 ? Math.max(...groups.map(g => parseInt(g.code.split('-')[1]))) + 1 : 1;
    const newGroup = {
      id: nextId,
      code: `GP-${String(nextCodeNum).padStart(3, '0')}`,
      name
    };
    setGroups([...groups, newGroup]);

    const token = localStorage.getItem('takamul_token');
    const payload = {
      categoryName: name,
      description: '',
      parentCategoryId: 0,
      isActive: 1,
    };
    fetch(`${AUTH_API_BASE}/api/ProductCategories/CREATE`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error('Failed to create product category via API', err);
    });
  };

  const deleteGroup = (id: number) => {
    setGroups(groups.filter(g => g.id !== id));

    const token = localStorage.getItem('takamul_token');
    fetch(`${AUTH_API_BASE}/api/ProductCategories/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }).catch((err) => {
      console.error('Failed to delete product category via API', err);
    });
  };

  const duplicateGroup = (id: number) => {
    const group = groups.find(g => g.id === id);
    if (group) {
      const nextId = Math.max(...groups.map(g => g.id)) + 1;
      const nextCodeNum = Math.max(...groups.map(g => parseInt(g.code.split('-')[1]))) + 1;
      const newGroup = {
        id: nextId,
        code: `GP-${String(nextCodeNum).padStart(3, '0')}`,
        name: `${group.name} (نسخة)`
      };
      setGroups([...groups, newGroup]);

      const token = localStorage.getItem('takamul_token');
      const payload = {
        categoryName: newGroup.name,
        description: '',
        parentCategoryId: 0,
        isActive: 1,
      };
      fetch(`${AUTH_API_BASE}/api/ProductCategories/CREATE`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error('Failed to duplicate product category via API', err);
      });
    }
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup, deleteGroup, duplicateGroup }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};
