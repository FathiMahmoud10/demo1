import React, { useState } from 'react';
import { 
  Search, 
  Printer, 
  FileText, 
  FileDown, 
  LayoutGrid, 
  ChevronRight, 
  ChevronLeft,
  MoreVertical,
  Calendar,
  Filter,
  ArrowUpDown,
  CheckSquare,
  Square,
  ExternalLink,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Purchase, PurchaseStatus, PaymentStatus } from '@/types';

const mockPurchases: Purchase[] = [
  {
    id: '1',
    date: '2024-03-24',
    reference: 'PO-2024-001',
    supplier: 'شركة التوريدات العالمية',
    status: PurchaseStatus.RECEIVED,
    total: 1500.00,
    paid: 1500.00,
    balance: 0.00,
    paymentStatus: PaymentStatus.PAID
  },
  {
    id: '2',
    date: '2024-03-23',
    reference: 'PO-2024-002',
    supplier: 'مؤسسة النور للتجارة',
    status: PurchaseStatus.PENDING,
    total: 2850.50,
    paid: 1000.00,
    balance: 1850.50,
    paymentStatus: PaymentStatus.PARTIAL
  },
  {
    id: '3',
    date: '2024-03-22',
    reference: 'PO-2024-003',
    supplier: 'مصنع الأمل للبلاستيك',
    status: PurchaseStatus.ORDERED,
    total: 5400.00,
    paid: 0.00,
    balance: 5400.00,
    paymentStatus: PaymentStatus.DUE
  }
];

const StatusBadge = ({ status }: { status: PurchaseStatus }) => {
  const styles = {
    [PurchaseStatus.RECEIVED]: "bg-green-100 text-green-700 border-green-200",
    [PurchaseStatus.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [PurchaseStatus.ORDERED]: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const labels = {
    [PurchaseStatus.RECEIVED]: "تم الاستلام",
    [PurchaseStatus.PENDING]: "قيد الانتظار",
    [PurchaseStatus.ORDERED]: "تم الطلب",
  };

  return (
    <span className={cn("px-2 py-1 rounded-md text-xs font-medium border", styles[status])}>
      {labels[status]}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: PaymentStatus }) => {
  const styles = {
    [PaymentStatus.PAID]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [PaymentStatus.PARTIAL]: "bg-orange-100 text-orange-700 border-orange-200",
    [PaymentStatus.DUE]: "bg-red-100 text-red-700 border-red-200",
    [PaymentStatus.OVERDUE]: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const labels = {
    [PaymentStatus.PAID]: "مدفوع",
    [PaymentStatus.PARTIAL]: "جزئي",
    [PaymentStatus.DUE]: "مستحق",
    [PaymentStatus.OVERDUE]: "متأخر",
  };

  return (
    <span className={cn("px-2 py-1 rounded-md text-xs font-medium border", styles[status])}>
      {labels[status]}
    </span>
  );
};

export default function PurchasesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedRows.length === mockPurchases.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockPurchases.map(p => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumbs & Subscription Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span>البداية</span>
          <ChevronLeft size={14} />
          <span className="text-[var(--primary)] font-medium">المشتريات</span>
        </div>
        
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-primary-hover transition-colors">
          <Calendar size={16} />
          <span>اضغط هنا لتجديد الاشتراك - الأيام المتبقية : 10 يوم</span>
        </button>
      </div>

      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
            <LayoutGrid className="text-[var(--primary)]" />
            المشتريات (جميع الفروع)
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.
          </p>
        </div>
        <button className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md hover:opacity-90 transition-all">
          <Plus size={20} />
          <span>إضافة عملية شراء</span>
        </button>
      </div>

      {/* Table Controls */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-1">
              <button className="p-2 hover:bg-[var(--bg-main)] rounded-md text-[var(--text-muted)]" title="طباعة"><Printer size={18} /></button>
              <button className="p-2 hover:bg-[var(--bg-main)] rounded-md text-[var(--text-muted)]" title="تصدير Excel"><FileText size={18} /></button>
              <button className="p-2 hover:bg-[var(--bg-main)] rounded-md text-[var(--text-muted)]" title="تصدير PDF"><FileDown size={18} /></button>
            </div>
            <div className="h-8 w-px bg-[var(--border)] mx-2"></div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>اظهار</span>
                <select 
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-md px-2 py-1 outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-main)]"
              />
            </div>
            <button className="p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-main)] transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 w-12">
                  <button onClick={toggleSelectAll} className="text-white hover:opacity-80 transition-opacity">
                    {selectedRows.length === mockPurchases.length ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </th>
                <th className="p-4 text-sm font-bold">
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                    التاريخ <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-sm font-bold">الرقم المرجعي</th>
                <th className="p-4 text-sm font-bold">المورد</th>
                <th className="p-4 text-sm font-bold">حالة عملية الشراء</th>
                <th className="p-4 text-sm font-bold">المجموع الكلي</th>
                <th className="p-4 text-sm font-bold">مدفوع</th>
                <th className="p-4 text-sm font-bold">الرصيد</th>
                <th className="p-4 text-sm font-bold">حالة الدفع</th>
                <th className="p-4 text-sm font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {mockPurchases.length > 0 ? (
                mockPurchases.map((purchase) => (
                    <tr 
                      key={purchase.id} 
                      className={cn(
                        "hover:bg-[var(--bg-main)]/50 transition-colors group",
                        selectedRows.includes(purchase.id) && "bg-[var(--primary)]/10"
                      )}
                    >
                      <td className="p-4">
                        <button onClick={() => toggleSelectRow(purchase.id)} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                          {selectedRows.includes(purchase.id) ? <CheckSquare size={20} className="text-[var(--primary)]" /> : <Square size={20} />}
                        </button>
                      </td>
                      <td className="p-4 text-sm text-[var(--text-main)] font-medium">{purchase.date}</td>
                      <td className="p-4 text-sm text-[var(--primary)] font-bold hover:underline cursor-pointer">{purchase.reference}</td>
                      <td className="p-4 text-sm text-[var(--text-main)]">{purchase.supplier}</td>
                      <td className="p-4"><StatusBadge status={purchase.status} /></td>
                      <td className="p-4 text-sm font-bold text-[var(--text-main)]">{purchase.total.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س</td>
                      <td className="p-4 text-sm font-bold text-emerald-500">{purchase.paid.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س</td>
                      <td className="p-4 text-sm font-bold text-red-500">{purchase.balance.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س</td>
                      <td className="p-4"><PaymentBadge status={purchase.paymentStatus} /></td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] rounded-md transition-all">
                            <ExternalLink size={16} />
                          </button>
                          <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] rounded-md transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-[var(--bg-main)] rounded-full">
                        <FileText size={48} className="text-[var(--text-muted)] opacity-30" />
                      </div>
                      <p className="text-lg font-medium">لا توجد بيانات في الجدول</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <p className="text-sm text-[var(--text-muted)]">
            عرض {mockPurchases.length > 0 ? 1 : 0} إلى {mockPurchases.length} من {mockPurchases.length} سجلات
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              <ChevronRight size={18} />
            </button>
            <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-bold shadow-sm">1</button>
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
