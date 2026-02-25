import React, { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, Edit, Trash2, PlusCircle } from 'lucide-react';
import AddUnitModal from '@/components/AddUnitModal';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Units = () => {
  const { t, direction } = useLanguage();
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const [units, setUnits] = useState([
    { id: 1, code: 'U-001', name: 'قطعة' },
    { id: 2, code: 'U-002', name: 'كيلو' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleActionMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openActionId === id) {
      setOpenActionId(null);
      setMenuPosition(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setOpenActionId(id);
      
      const menuWidth = 160;
      const left = direction === 'rtl' 
        ? rect.right - menuWidth 
        : rect.left;
        
      setMenuPosition({ 
        top: rect.bottom + 5, 
        left: Math.max(10, left)
      });
    }
  };

  const handleAddUnit = (unitName: string) => {
    const newUnit = {
      id: units.length > 0 ? Math.max(...units.map(u => u.id)) + 1 : 1,
      code: `U-00${units.length + 1}`,
      name: unitName,
    };
    setUnits([...units, newUnit]);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('confirm_delete_unit') || 'Are you sure?')) {
      setUnits(units.filter(u => u.id !== id));
      setOpenActionId(null);
    }
  };

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('units')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {t('units')}
          </h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-medium"
          >
              <PlusCircle size={18} />
              {t('add_new_unit')}
          </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[300px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-3 border border-primary-hover">{t('unit_code')}</th>
                <th scope="col" className="px-6 py-3 border border-primary-hover">{t('unit_name')}</th>
                <th scope="col" className="px-6 py-3 border border-primary-hover text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-gray-100">{unit.code}</td>
                  <td className="px-6 py-4 border border-gray-100">{unit.name}</td>
                  <td className="px-6 py-4 border border-gray-100 text-center">
                    <button 
                      onClick={(e) => toggleActionMenu(unit.id, e)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-hover transition-colors"
                    >
                      <span>{t('actions')}</span>
                      <ChevronDown size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Floating Action Menu */}
        <AddUnitModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAddUnit={handleAddUnit} 
        />

        {/* Floating Action Menu */}
        <AnimatePresence>
          {openActionId !== null && menuPosition && (
            <motion.div 
              ref={actionMenuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden w-40 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              style={{ top: menuPosition.top, left: menuPosition.left }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onMouseDown={(e) => e.stopPropagation()}
                className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
              >
                {direction === 'rtl' ? (
                  <><span>{t('edit')}</span><Edit size={14} className="text-gray-500" /></>
                ) : (
                  <><Edit size={14} className="text-gray-500" /><span>{t('edit')}</span></>
                )}
              </button>
              <button 
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleDelete(openActionId)}
                className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
              >
                {direction === 'rtl' ? (
                  <><span>{t('delete')}</span><Trash2 size={14} className="text-red-500" /></>
                ) : (
                  <><Trash2 size={14} className="text-red-500" /><span>{t('delete')}</span></>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Units;
