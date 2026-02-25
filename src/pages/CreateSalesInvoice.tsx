import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2,
  Pencil,
  Eye,
  Plus,
  UserPlus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateSalesInvoice() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  const [date, setDate] = useState('16:39:21 23/02/2026');
  const [refNo, setRefNo] = useState('');
  const [cashier, setCashier] = useState('شركة اختبار');
  const [branch, setBranch] = useState('شركة تكامل');
  const [customer, setCustomer] = useState('التوفيق(التوفيق)');
  const [delegate, setDelegate] = useState('عام');
  const [poNumber, setPoNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const [discount, setDiscount] = useState('50');
  const [status, setStatus] = useState('completed');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isCustomerDisabled, setIsCustomerDisabled] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [payments, setPayments] = useState([
    { amount: '0', method: 'شبكة' }
  ]);

  const addPayment = () => {
    setPayments([...payments, { amount: '0', method: 'شبكة' }]);
  };

  const removePayment = (index: number) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, i) => i !== index));
    }
  };

  const updatePayment = (index: number, field: 'amount' | 'method', value: string) => {
    const newPayments = [...payments];
    newPayments[index][field] = value;
    setPayments(newPayments);
  };

  const [products, setProducts] = useState([
    {
      id: 1,
      name: '78574318 - غراء امريكي 1/8 نيبيرو',
      priceNoVat: 6.50,
      priceWithVat: 6.50,
      qty: 10,
      totalNoVat: 65,
      total: 0
    },
    {
      id: 2,
      name: '125 - كوع 3/4 حار نامات',
      priceNoVat: 1.85,
      priceWithVat: 1.85,
      qty: 5,
      totalNoVat: 9.25,
      total: 0
    }
  ]);

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const totalQty = products.reduce((sum, p) => sum + p.qty, 0);

  return (
    <div className="space-y-4" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('quotes')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">اضافة عمليه بيع</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Plus size={20} className="text-[#8b0000]" />
          <h1 className="text-lg font-bold text-[#8b0000]">
            اضافة عمليه بيع
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-8">
        <form className="space-y-8">
          
          {/* Top Section */}
          <div className="bg-red-50/30 p-4 rounded-lg border border-red-100 mb-6">
            <p className="text-sm text-[#8b0000] font-bold text-right mb-4">
              برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000] block">التاريخ</label>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right bg-gray-50" 
                  readOnly
                />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000] block">الرقم المرجعي</label>
                <input 
                  type="text" 
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
                />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000] block">كاشير *</label>
                <select 
                  value={cashier}
                  onChange={(e) => setCashier(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
                >
                  <option value="شركة اختبار">شركة اختبار</option>
                </select>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="bg-[#fff9e6] p-4 rounded-lg border border-[#ffeeba] mb-6">
            <p className="text-sm text-[#856404] font-bold text-right mb-4">
              برجاء تحديث هذه الخيارات قبل إضافة أي منتج
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000] block">الفرع *</label>
                <select 
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
                >
                  <option value="شركة تكامل">شركة دقة الحلول</option>
                </select>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000] block">عميل *</label>
                <div className="flex gap-1">
                  <select 
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    disabled={isCustomerDisabled}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="التوفيق(التوفيق)">التوفيق(التوفيق)</option>
                  </select>
                  <div className="flex items-center gap-1 border border-gray-300 rounded px-1 bg-white">
                    <button type="button" onClick={() => setShowAddCustomerModal(true)} className="text-[#8b0000] hover:text-red-700 p-1 border-l border-gray-200" title="إضافة عميل"><Plus size={16} /></button>
                    <button type="button" onClick={() => setIsCustomerDisabled(true)} className={`p-1 border-l border-gray-200 ${isCustomerDisabled ? 'text-gray-400' : 'text-[#8b0000] hover:text-red-700'}`} title="تعطيل"><Eye size={16} /></button>
                    <button type="button" onClick={() => setIsCustomerDisabled(false)} className={`p-1 ${!isCustomerDisabled ? 'text-gray-400' : 'text-[#8b0000] hover:text-red-700'}`} title="تفعيل"><Pencil size={16} /></button>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000] block">المندوب / الموظف *</label>
                <select 
                  value={delegate}
                  onChange={(e) => setDelegate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
                >
                  <option value="عام">عام</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000] block">اسم المشروع</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
                />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000] block">رقم أمر الشراء</label>
                <input 
                  type="text" 
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
                />
              </div>
            </div>
          </div>

          {/* Product Search */}
          <div className="mb-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="الرجاء إضافة الأصناف" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right outline-none focus:border-red-600 pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4H21V6H3V4ZM3 10H21V12H3V10ZM3 16H21V18H3V16ZM3 20H21V22H3V20Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 border-r border-gray-200 pl-2">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z"></path><path d="M7 7h1v10H7z"></path><path d="M10 7h2v10h-2z"></path><path d="M13 7h1v10h-1z"></path><path d="M16 7h1v10h-1z"></path></svg>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#8b0000] text-right block">الأصناف *</label>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-3 border border-primary/20 w-10 text-center">
                      <Trash2 size={16} className="mx-auto" />
                    </th>
                    <th className="p-3 border border-primary/20">صنف (كود - اسم)</th>
                    <th className="p-3 border border-primary/20">سعر الوحدة بدون ضريبة</th>
                    <th className="p-3 border border-primary/20">سعر الوحدة بالضريبة</th>
                    <th className="p-3 border border-primary/20">الكمية المباعة</th>
                    <th className="p-3 border border-primary/20">الاجمالي بدون ضريبة</th>
                    <th className="p-3 border border-primary/20">اجمالي الصنف (SR)</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="bg-red-50/30">
                      <td className="p-3 border border-gray-200 text-center">
                        <button 
                          type="button" 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-gray-800 hover:text-red-600 font-bold text-lg"
                        >
                          ×
                        </button>
                      </td>
                      <td className="p-3 border border-gray-200 text-right">
                        <span>{product.name}</span>
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input 
                          type="number" 
                          value={product.priceNoVat} 
                          className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-red-600 bg-white"
                          readOnly
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input 
                          type="number" 
                          value={product.priceWithVat} 
                          className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-red-600 bg-white"
                          readOnly
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input 
                          type="number" 
                          value={product.qty} 
                          className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-red-600 bg-white"
                          readOnly
                        />
                      </td>
                      <td className="p-3 border border-gray-200 text-center">{product.totalNoVat}</td>
                      <td className="p-3 border border-gray-200 text-center">{product.total}</td>
                    </tr>
                  ))}
                  <tr className="bg-white font-bold">
                    <td className="p-3 border border-gray-200 text-center">
                      <Trash2 size={16} className="mx-auto text-gray-400" />
                    </td>
                    <td className="p-3 border border-gray-200 text-center">Total</td>
                    <td className="p-3 border border-gray-200 text-center">0</td>
                    <td className="p-3 border border-gray-200 text-center">0</td>
                    <td className="p-3 border border-gray-200 text-center">{totalQty.toFixed(2)}</td>
                    <td className="p-3 border border-gray-200 text-center">0</td>
                    <td className="p-3 border border-gray-200 text-center">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 text-right">
              <label className="text-sm font-bold text-[#8b0000]">الخصم</label>
              <input 
                type="text" 
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
              />
            </div>
            <div className="space-y-2 text-right">
              <label className="text-sm font-bold text-[#8b0000]">حالة فاتورة المبيعات *</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
              >
                <option value="completed">مكتملة</option>
                <option value="pending">معلقة</option>
              </select>
            </div>
            <div className="space-y-2 text-right">
              <label className="text-sm font-bold text-[#8b0000]">أجل الاستحقاق</label>
              <input 
                type="text" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
              />
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
            {payments.map((payment, index) => (
              <div key={index} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                {index > 0 && (
                  <button 
                    type="button"
                    onClick={() => removePayment(index)}
                    className="absolute -top-2 -left-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-md"
                  >
                    <X size={14} />
                  </button>
                )}
                <div className="space-y-2 text-right">
                  <label className="text-sm font-bold text-[#8b0000]">المدفوع</label>
                  <input 
                    type="text" 
                    value={payment.amount}
                    onChange={(e) => updatePayment(index, 'amount', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
                  />
                </div>
                <div className="space-y-2 text-right">
                  <label className="text-sm font-bold text-[#8b0000]">الدفع بواسطة *</label>
                  <select 
                    value={payment.method}
                    onChange={(e) => updatePayment(index, 'method', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
                  >
                    <option value="شبكة">شبكة</option>
                    <option value="نقدي">نقدي</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Payments Button */}
          <div className="flex justify-center">
            <button 
              type="button"
              onClick={addPayment}
              className="w-full bg-[#8b0000] text-white py-2 rounded font-bold hover:bg-[#a52a2a] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              إضافة المزيد من المدفوعات
            </button>
          </div>

          {/* Notes */}
          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-[#8b0000]">ملاحظات فاتورة المبيعات</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 h-32 outline-none focus:border-red-600 text-right text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-8">
            <button 
              type="submit"
              className="bg-[#8b0000] text-white px-6 py-2 rounded font-bold hover:bg-[#a52a2a] transition-colors"
            >
              اتمام العملية
            </button>
            <button 
              type="button"
              className="bg-[#5cb85c] text-white px-6 py-2 rounded font-bold hover:bg-[#4cae4c] transition-colors"
            >
              معاينة الفاتورة
            </button>
            <button 
              type="button"
              onClick={() => navigate('/quotes')}
              className="bg-[#d9534f] text-white px-6 py-2 rounded font-bold hover:bg-[#c9302c] transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </form>
      </div>
      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddCustomerModal && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserPlus size={20} className="text-[#8b0000]" />
                  <h2 className="text-lg font-bold text-[#8b0000]">{t('add_customer')}</h2>
                </div>
                <button onClick={() => setShowAddCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8" dir="rtl">
                <p className="text-sm text-[#8b0000] text-center font-medium">
                  برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
                </p>

                <div className="bg-[#fff9e6] p-6 rounded-lg border border-[#ffeeba] space-y-4">
                  <p className="text-sm text-[#856404] font-bold text-center">برجاء تحديد نوع العميل</p>
                  <div className="flex justify-center gap-12">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="customerType" className="w-4 h-4 accent-[#8b0000]" defaultChecked />
                      <span className="text-sm font-bold text-[#8b0000]">غير مسجل بالضريبة</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="customerType" className="w-4 h-4 accent-[#8b0000]" />
                      <span className="text-sm font-bold text-[#8b0000]">مسجل بالضريبة</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">مجموعة العملاء *</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white">
                      <option>عام</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">مجموعة التسعيرة</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white">
                      <option>عام</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">اسم العميل *</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">هاتف</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">عنوان البريد الإلكتروني</label>
                    <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">السجل التجاري</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">رصيد افتتاحي *( المديونية بالسالب)</label>
                    <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">الحد الائتماني *</label>
                    <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <label className="text-sm font-bold text-[#8b0000] cursor-pointer" htmlFor="stop-sale">ايقاف البيع في حالة وجود مبالغ مستحقة</label>
                  <input type="checkbox" id="stop-sale" className="w-4 h-4 accent-[#8b0000]" />
                </div>

                <div className="flex justify-start pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddCustomerModal(false)}
                    className="bg-[#8b0000] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#a52a2a] transition-colors"
                  >
                    اضافة عميل
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
