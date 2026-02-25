import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Eye, 
  Edit2, 
  RotateCcw, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Filter,
  Download,
  Printer,
  ChevronDown,
  Menu,
  LayoutGrid,
  List as ListIcon,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  DollarSign,
  FileCheck,
  Truck,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  X,
  Copy,
  Info,
  FileJson,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SaleRecord {
  id: string;
  invoiceNo: string;
  date: string;
  refNo: string;
  cashier: string;
  customer: string;
  saleStatus: 'completed' | 'returned';
  grandTotal: number;
  paid: number;
  remaining: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentType: 'mada' | 'cash' | 'bank_transfer';
}

const mockSales: SaleRecord[] = [
  { id: '1', invoiceNo: '484', date: '31/01/2026 17:20:10', refNo: 'SALE2026/01/0017', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 12.00, paid: 12.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' }
];

export default function A4Sales() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(false);
  
  // Modal States
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<SaleRecord | null>(null);
  const [showPayments, setShowPayments] = useState<SaleRecord | null>(null);
  const [showAddPayment, setShowAddPayment] = useState<SaleRecord | null>(null);
  const [showStoreBond, setShowStoreBond] = useState<SaleRecord | null>(null);
  const [showClaimBond, setShowClaimBond] = useState<SaleRecord | null>(null);
  const [showAddDelivery, setShowAddDelivery] = useState<SaleRecord | null>(null);

  const [filters, setFilters] = useState({
    refNo: '',
    invoiceNo: '',
    customer: '',
    branch: '',
    fromDate: '',
    toDate: '',
    grandTotal: '',
    deliveryCompany: 'all',
  });

  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const saved = localStorage.getItem('takamul_a4_sales');
    return saved ? JSON.parse(saved) : mockSales;
  });

  useEffect(() => {
    localStorage.setItem('takamul_a4_sales', JSON.stringify(sales));
  }, [sales]);

  // Close menus on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
      if (!target.closest('.top-menu-container')) {
        setShowTopMenu(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleFilter = () => {
    const newSale: SaleRecord = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNo: filters.invoiceNo || (sales.length > 0 ? (Math.max(...sales.map(s => parseInt(s.invoiceNo) || 0)) + 1).toString() : "1"),
      date: filters.fromDate ? `${filters.fromDate} 00:00:00` : new Date().toLocaleString('en-GB'),
      refNo: filters.refNo || `SALE/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`,
      cashier: filters.branch || 'شركة اختبار',
      customer: filters.customer || 'شخص عام',
      saleStatus: 'completed',
      grandTotal: parseFloat(filters.grandTotal) || 0,
      paid: parseFloat(filters.grandTotal) || 0,
      remaining: 0,
      paymentStatus: 'paid',
      paymentType: 'mada',
    };

    setSales(prevSales => [newSale, ...prevSales]);
    setFilters({
      refNo: '',
      invoiceNo: '',
      customer: '',
      branch: '',
      fromDate: '',
      toDate: '',
      grandTotal: '',
      deliveryCompany: 'all',
    });
    
    alert(direction === 'rtl' ? 'تمت إضافة العملية بنجاح' : 'Operation added successfully');
  };

  const handleActionClick = (action: string, sale: SaleRecord) => {
    setActiveActionMenu(null);
    switch (action) {
      case 'details':
        setShowInvoiceDetails(sale);
        break;
      case 'payments':
        setShowPayments(sale);
        break;
      case 'add_payment':
        setShowAddPayment(sale);
        break;
      case 'warehouse_receipt':
        setShowStoreBond(sale);
        break;
      case 'claim_receipt':
        setShowClaimBond(sale);
        break;
      case 'add_delivery':
        setShowAddDelivery(sale);
        break;
      case 'duplicate':
        const duplicatedSale = {
          ...sale,
          id: Math.random().toString(36).substr(2, 9),
          invoiceNo: (Math.max(...sales.map(s => parseInt(s.invoiceNo) || 0)) + 1).toString(),
          date: new Date().toLocaleString('en-GB'),
        };
        setSales(prevSales => [duplicatedSale, ...prevSales]);
        break;
      case 'return':
        navigate(`/sales/return/${sale.id}`);
        break;
      default:
        console.log(`Action ${action} clicked for sale ${sale.id}`);
    }
  };

  return (
    <div className="space-y-4" dir={direction}>
      {/* Top Bar */}
      <div className="bg-white p-3 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[#8b0000]">
            فواتير مبيعات A4
          </h1>
          <ListIcon size={20} className="text-[#8b0000]" />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-1.5 bg-white text-[#8b0000] hover:bg-red-50 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
          >
            {showFilters ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
          </button>
          <div className="relative top-menu-container">
            <button 
              onClick={() => setShowTopMenu(!showTopMenu)}
              className="p-1.5 bg-white text-gray-600 hover:bg-gray-100 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
            >
              <ListIcon size={18} />
            </button>
            {showTopMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 min-w-[200px] text-right">
                <button 
                  onClick={() => { navigate('/sales/a4-invoices/create'); setShowTopMenu(false); }}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                >
                  إضافة فاتورة A4
                  <PlusCircle size={16} />
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                  تصدير إلى ملف Excel
                  <FileSpreadsheet size={16} />
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                  تصدير إلى ملف pdf
                  <FileText size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-[#8b0000] mb-6 text-right font-medium">
          البيانات الظاهرة في اخر 30 يوم . برجاء استخدام النموذج لاظهار مزيد من النتائج
        </p>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-[#8b0000] mb-1 text-right">الرقم المرجعي</label>
                  <input 
                    type="text" 
                    value={filters.refNo}
                    onChange={(e) => setFilters({ ...filters, refNo: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b0000] mb-1 text-right">رقم الفاتورة</label>
                  <input 
                    type="text" 
                    value={filters.invoiceNo}
                    onChange={(e) => setFilters({ ...filters, invoiceNo: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b0000] mb-1 text-right">عميل</label>
                  <select 
                    value={filters.customer}
                    onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000] bg-white"
                  >
                    <option value="">اختر عميل</option>
                    <option value="شخص عام">شخص عام</option>
                    <option value="عميل افتراضي">عميل افتراضي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b0000] mb-1 text-right">الفروع</label>
                  <select 
                    value={filters.branch}
                    onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000] bg-white"
                  >
                    <option value="">جميع الفروع</option>
                    <option value="شركة اختبار">شركة اختبار</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b0000] mb-1 text-right">المجموع الكلي</label>
                  <input 
                    type="text" 
                    value={filters.grandTotal}
                    onChange={(e) => setFilters({ ...filters, grandTotal: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b0000] mb-1 text-right">من تاريخ</label>
                  <input 
                    type="date" 
                    value={filters.fromDate}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b0000] mb-1 text-right">الي تاريخ</label>
                  <input 
                    type="date" 
                    value={filters.toDate}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b0000] mb-1 text-right">شركات التوصيل</label>
                  <select 
                    value={filters.deliveryCompany}
                    onChange={(e) => setFilters({ ...filters, deliveryCompany: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000] bg-white"
                  >
                    <option value="all">الكل</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex justify-end mt-2">
                  <button 
                    onClick={handleFilter}
                    className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-primary-hover transition-colors"
                  >
                    اتمام العملية
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">اظهر</span>
            <select 
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary bg-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="relative w-full md:w-80 flex items-center gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right" 
              />
            </div>
            <span className="text-sm text-gray-600 whitespace-nowrap">بحث</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-64">
          <table className="w-full min-w-[1200px] text-sm text-right border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border border-primary/20 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">رقم الفاتورة</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">التاريخ</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">الرقم المرجعي</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">كاشير</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">عميل</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">حالة فاتورة المبيعات</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">المجموع الكلي</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">مدفوع</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">المبلغ المتبقي</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">حالة الدفع</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">نوع الدفع</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap w-24 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={`${sale.id}-${index}`} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                  <td className="p-3 text-center border-x border-gray-200">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="p-3 border-x border-gray-200">{sale.invoiceNo}</td>
                  <td className="p-3 border-x border-gray-200">{sale.date}</td>
                  <td className="p-3 border-x border-gray-200">{sale.refNo}</td>
                  <td className="p-3 border-x border-gray-200">{sale.cashier}</td>
                  <td className="p-3 border-x border-gray-200">{sale.customer}</td>
                  <td className="p-3 border-x border-gray-200 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${sale.saleStatus === 'completed' ? 'bg-[#5cb85c]' : 'bg-[#d9534f]'}`}>
                      {sale.saleStatus === 'completed' ? 'مكتملة' : 'مرتجع'}
                    </span>
                  </td>
                  <td className="p-3 border-x border-gray-200">{sale.grandTotal.toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200">{sale.paid.toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200">{sale.remaining.toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${sale.paymentStatus === 'paid' ? 'bg-[#5cb85c]' : sale.paymentStatus === 'partial' ? 'bg-[#5bc0de]' : 'bg-[#d9534f]'}`}>
                      {sale.paymentStatus === 'paid' ? 'مدفوع' : sale.paymentStatus === 'partial' ? 'جزئي' : 'غير مدفوع'}
                    </span>
                  </td>
                  <td className="p-3 border-x border-gray-200 text-center">
                    {sale.paymentType === 'mada' && (
                      <div className="flex justify-center items-center gap-1 text-xs font-bold text-green-700">
                        <span>mada</span>
                        <span className="text-[10px] bg-green-100 px-1 rounded">مدى</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-x border-gray-200 text-center relative action-menu-container">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionMenu(activeActionMenu === sale.id ? null : sale.id);
                      }}
                      className="bg-primary text-white px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto hover:bg-primary-hover transition-colors"
                    >
                      الإجراءات
                      <ChevronDown size={14} />
                    </button>
                    
                    {activeActionMenu === sale.id && (
                      <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-xl z-50 py-1 text-right">
                        <button onClick={() => handleActionClick('details', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          تفاصيل فاتورة المبيعات <FileText size={16} />
                        </button>
                        <button onClick={() => handleActionClick('duplicate', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          تكرار فاتورة المبيعات <Copy size={16} />
                        </button>
                        <button onClick={() => handleActionClick('payments', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          عرض المدفوعات <DollarSign size={16} />
                        </button>
                        <button onClick={() => handleActionClick('add_payment', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          إضافة الدفع <DollarSign size={16} />
                        </button>
                        <button onClick={() => handleActionClick('return', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          إرجاع مبيع <RotateCcw size={16} />
                        </button>
                        <button onClick={() => handleActionClick('warehouse_receipt', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          سند مخزني <FileCheck size={16} />
                        </button>
                        <button onClick={() => handleActionClick('claim_receipt', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          سند مطالبة <Info size={16} />
                        </button>
                        <button onClick={() => handleActionClick('add_delivery', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          إضافة تسليم <Truck size={16} />
                        </button>
                        <button onClick={() => handleActionClick('download_pdf', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          تحميل بصيغة PDF <FileText size={16} />
                        </button>
                        <button onClick={() => handleActionClick('download_excel', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          تحميل كملف إكسل <FileSpreadsheet size={16} />
                        </button>
                        <button onClick={() => handleActionClick('download_csv', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          تحميل بصيغة CSV <FileJson size={16} />
                        </button>
                        <button onClick={() => handleActionClick('send_email', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          ارسال الفاتورة بالبريد الالكتروني <Mail size={16} />
                        </button>
                        <button onClick={() => handleActionClick('send_whatsapp', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          إرسال الفاتورة عبر الواتس <MessageCircle size={16} />
                        </button>
                        <button onClick={() => handleActionClick('release_receipt', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          سند فسح <Truck size={16} />
                        </button>
                        <button onClick={() => handleActionClick('edit_employee', sale)} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                          تعديل المندوب / الموظف <Truck size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-[#8b0000] font-bold">
            عرض 1 إلى {sales.length} من {sales.length} سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
              سابق
            </button>
            <button className="px-3 py-1 border border-primary bg-primary text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
              التالي
            </button>
          </div>
        </div>
        {/* Modals */}
        <AnimatePresence>
          {showInvoiceDetails && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowInvoiceDetails(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl w-full max-w-5xl shadow-2xl relative overflow-hidden my-8"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-primary text-white p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText size={20} />
                    <h2 className="text-lg font-bold">تفاصيل الفاتورة {showInvoiceDetails.invoiceNo}</h2>
                  </div>
                  <button onClick={() => setShowInvoiceDetails(null)} className="hover:bg-white/10 p-1 rounded">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-8 space-y-8 text-right" dir={direction}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <h3 className="font-bold text-[#8b0000]">عميل افتراضي</h3>
                      <p className="text-sm text-gray-600">الهاتف: 00</p>
                      <p className="text-sm text-gray-600">الايميل: info@posit.sa</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <LayoutGrid size={48} className="text-gray-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-[#8b0000]">شركة اختبار</h3>
                      <p className="text-sm text-gray-600">رقم السجل: 1234123123</p>
                      <p className="text-sm text-gray-600">الرقم الضريبي: 50608090</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold text-[#8b0000]">الرقم المرجعي: {showInvoiceDetails.refNo}</p>
                      <p className="text-xs text-gray-500">التاريخ: {showInvoiceDetails.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold">حالة المبيع: <span className="text-red-600">{showInvoiceDetails.saleStatus === 'completed' ? 'مكتملة' : 'مرتجع'}</span></p>
                      <p className="text-sm font-bold">حالة الدفع: <span className="text-green-600">{showInvoiceDetails.paymentStatus === 'paid' ? 'مدفوع' : 'جزئي'}</span></p>
                    </div>
                  </div>

                  <table className="w-full text-sm text-right border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-3 border border-primary/20">م</th>
                        <th className="p-3 border border-primary/20">الوصف</th>
                        <th className="p-3 border border-primary/20">الكمية</th>
                        <th className="p-3 border border-primary/20">سعر الوحدة</th>
                        <th className="p-3 border border-primary/20">المجموع بدون ضريبة</th>
                        <th className="p-3 border border-primary/20">الضريبة</th>
                        <th className="p-3 border border-primary/20">السعر الاجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-3 border-x border-gray-200">1</td>
                        <td className="p-3 border-x border-gray-200">منتج تجريبي</td>
                        <td className="p-3 border-x border-gray-200">1.00 وحدة</td>
                        <td className="p-3 border-x border-gray-200">{showInvoiceDetails.grandTotal.toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">{showInvoiceDetails.grandTotal.toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">0.00</td>
                        <td className="p-3 border-x border-gray-200 font-bold">{showInvoiceDetails.grandTotal.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-gray-100">
                    <button className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors">
                      <Printer size={18} /> طباعة
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors">
                      <Download size={18} /> تحميل PDF
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors">
                      <Mail size={18} /> ارسال ايميل
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showPayments && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
              onClick={() => setShowPayments(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                  <h2 className="text-lg font-bold text-[#8b0000]">عرض المدفوعات - {showPayments.refNo}</h2>
                  <button onClick={() => setShowPayments(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <table className="w-full text-sm text-right border-collapse">
                    <thead>
                      <tr className="bg-[#8b0000] text-white">
                        <th className="p-3 border border-[#a52a2a]">التاريخ</th>
                        <th className="p-3 border border-[#a52a2a]">الرقم المرجعي</th>
                        <th className="p-3 border border-[#a52a2a]">المبلغ</th>
                        <th className="p-3 border border-[#a52a2a]">نوع الدفع</th>
                        <th className="p-3 border border-[#a52a2a]">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-3 border-x border-gray-200">{showPayments.date}</td>
                        <td className="p-3 border-x border-gray-200">PAY-{showPayments.id}</td>
                        <td className="p-3 border-x border-gray-200 font-bold">{showPayments.paid.toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">{showPayments.paymentType}</td>
                        <td className="p-3 border-x border-gray-200 flex justify-center gap-2">
                          <button className="text-red-600 hover:bg-red-50 p-1 rounded">
                            <Trash2 size={16} />
                          </button>
                          <button className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
