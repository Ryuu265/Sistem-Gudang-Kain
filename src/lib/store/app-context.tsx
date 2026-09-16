'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BusinessInfo, Category, Unit, Supplier, Customer, Product, 
  Transaction, DeliveryNote, StockMovement, Profile, AuditLog, UserRole
} from '@/types';
import { 
  INITIAL_BUSINESS_INFO, INITIAL_CATEGORIES, INITIAL_UNITS, 
  INITIAL_SUPPLIERS, INITIAL_CUSTOMERS, INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS, INITIAL_DELIVERY_NOTES, INITIAL_PROFILES, INITIAL_AUDIT_LOGS 
} from './mock-store';

interface AppContextType {
  businessInfo: BusinessInfo;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;
  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  suppliers: Supplier[];
  addSupplier: (sup: Omit<Supplier, 'id'>) => void;
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id'>) => void;
  products: Product[];
  addProduct: (prod: Omit<Product, 'id' | 'stok_saat_ini'>) => void;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  archiveProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'nomor_transaksi'>) => Transaction;
  updateTransactionStatus: (id: string, newStatus: 'selesai' | 'dibatalkan') => { success: boolean; error?: string };
  deliveryNotes: DeliveryNote[];
  updateDeliveryNoteStatus: (id: string, newStatus: DeliveryNote['status'], notes?: string) => void;
  confirmDeliveryReceipt: (id: string, data: {
    tanggal_terima: string;
    nama_penerima: string;
    ttd_penerima_url?: string;
    returns?: Array<{ item_id: string; product_id: string; qty_retur: number; alasan: string }>;
  }) => void;
  stockMovements: StockMovement[];
  profiles: Profile[];
  currentUser: Profile;
  setCurrentRole: (role: UserRole) => void;
  auditLogs: AuditLog[];
  logAudit: (aksi: string, tabel: string, record_id?: string, data_lama?: any, data_baru?: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(INITIAL_BUSINESS_INFO);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>(INITIAL_DELIVERY_NOTES);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentUser, setCurrentUser] = useState<Profile>(INITIAL_PROFILES[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('sgk_business_info');
      if (savedInfo) setBusinessInfo(JSON.parse(savedInfo));

      const savedProducts = localStorage.getItem('sgk_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedTx = localStorage.getItem('sgk_transactions');
      if (savedTx) setTransactions(JSON.parse(savedTx));

      const savedDn = localStorage.getItem('sgk_delivery_notes');
      if (savedDn) setDeliveryNotes(JSON.parse(savedDn));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('sgk_business_info', JSON.stringify(businessInfo));
  }, [businessInfo]);

  useEffect(() => {
    localStorage.setItem('sgk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sgk_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sgk_delivery_notes', JSON.stringify(deliveryNotes));
  }, [deliveryNotes]);

  // Logging function
  const logAudit = (aksi: string, tabel: string, record_id?: string, data_lama?: any, data_baru?: any) => {
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      user_name: currentUser.nama_lengkap,
      aksi,
      tabel,
      record_id,
      data_lama,
      data_baru,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Update Business Info
  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    setBusinessInfo((prev) => {
      const updated = { ...prev, ...info, updated_at: new Date().toISOString() };
      logAudit('UPDATE_INFO_BISNIS', 'business_info', prev.id, prev, updated);
      return updated;
    });
  };

  // Categories
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `c-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCat]);
    logAudit('TAMBAH_KATEGORI', 'categories', newCat.id, null, newCat);
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...cat, updated_at: new Date().toISOString() } : c))
    );
    logAudit('EDIT_KATEGORI', 'categories', id, null, cat);
  };

  const deleteCategory = (id: string): boolean => {
    const hasProducts = products.some((p) => p.category_id === id && p.is_active);
    if (hasProducts) {
      return false; // Prevent deletion
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    logAudit('HAPUS_KATEGORI', 'categories', id);
    return true;
  };

  // Units, Suppliers, Customers
  const addUnit = (unit: Omit<Unit, 'id'>) => {
    const newUnit = { ...unit, id: `u-${Date.now()}` };
    setUnits((prev) => [...prev, newUnit]);
  };

  const addSupplier = (sup: Omit<Supplier, 'id'>) => {
    const newSup = { ...sup, id: `s-${Date.now()}` };
    setSuppliers((prev) => [...prev, newSup]);
    logAudit('TAMBAH_SUPPLIER', 'suppliers', newSup.id, null, newSup);
  };

  const addCustomer = (cust: Omit<Customer, 'id'>) => {
    const newCust = { ...cust, id: `k-${Date.now()}` };
    setCustomers((prev) => [...prev, newCust]);
    logAudit('TAMBAH_CUSTOMER', 'customers', newCust.id, null, newCust);
  };

  // Product CRUD
  const addProduct = (prod: Omit<Product, 'id' | 'stok_saat_ini'>) => {
    const newProd: Product = {
      ...prod,
      id: `p-${Date.now()}`,
      stok_saat_ini: 0, // Stock starts at 0, updated strictly via transactions
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    logAudit('TAMBAH_PRODUK', 'products', newProd.id, null, newProd);
  };

  const updateProduct = (id: string, prod: Partial<Product>) => {
    // Note: stok_saat_ini cannot be updated manually from master screen
    const { stok_saat_ini, ...allowedUpdates } = prod;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...allowedUpdates, updated_at: new Date().toISOString() } : p))
    );
    logAudit('EDIT_PRODUK', 'products', id, null, allowedUpdates);
  };

  const archiveProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
    logAudit('ARSIP_PRODUK', 'products', id);
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: `p-${Date.now()}`,
      sku: `${target.sku}-COPY-${Math.floor(Math.random() * 1000)}`,
      nama: `${target.nama} (Salinan)`,
      stok_saat_ini: 0,
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
    logAudit('DUPLIKAT_PRODUK', 'products', duplicated.id);
  };

  // Transaction & Atomic Stock Update Trigger Simulation
  const addTransaction = (tx: Omit<Transaction, 'id' | 'nomor_transaksi'>): Transaction => {
    const prefix = tx.tipe === 'masuk' ? 'MSK' : tx.tipe === 'keluar' ? 'KLR' : 'ADJ';
    const dateObj = new Date();
    const YYYYMM = `${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    const seq = String(transactions.length + 1).padStart(4, '0');
    const nomorTx = `${prefix}-${YYYYMM}-${seq}`;

    const newTx: Transaction = {
      ...tx,
      id: `t-${Date.now()}`,
      nomor_transaksi: nomorTx,
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    logAudit('BUAT_TRANSAKSI', 'transactions', newTx.id, null, newTx);

    // If status is 'selesai', run stock update trigger immediately
    if (newTx.status === 'selesai') {
      applyStockTrigger(newTx);
    }

    return newTx;
  };

  const applyStockTrigger = (tx: Transaction) => {
    if (!tx.items) return;

    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];

      tx.items?.forEach((item) => {
        const prodIndex = updatedProducts.findIndex((p) => p.id === item.product_id);
        if (prodIndex === -1) return;

        const prod = updatedProducts[prodIndex];
        const qtyActual = item.qty_aktual && item.qty_aktual > 0 ? item.qty_aktual : item.qty;
        let stokSebelum = prod.stok_saat_ini;
        let stokSesudah = stokSebelum;

        if (tx.tipe === 'masuk') {
          stokSesudah = stokSebelum + qtyActual;
        } else if (tx.tipe === 'keluar') {
          if (stokSebelum < qtyActual && !businessInfo.allow_negative_stock) {
            throw new Error(`Stok tidak mencukupi untuk ${prod.nama}. Tersedia: ${stokSebelum}`);
          }
          stokSesudah = stokSebelum - qtyActual;
        } else if (tx.tipe === 'penyesuaian') {
          stokSesudah = qtyActual;
        }

        updatedProducts[prodIndex] = {
          ...prod,
          stok_saat_ini: stokSesudah,
          updated_at: new Date().toISOString(),
        };

        // Record stock movement ledger
        const newMovement: StockMovement = {
          id: `sm-${Date.now()}-${Math.random()}`,
          product_id: prod.id,
          transaction_id: tx.id,
          tanggal: new Date().toISOString(),
          tipe: tx.tipe,
          qty_masuk: tx.tipe === 'masuk' ? qtyActual : 0,
          qty_keluar: tx.tipe === 'keluar' ? qtyActual : 0,
          stok_sebelum: stokSebelum,
          stok_sesudah: stokSesudah,
          keterangan: tx.keterangan || `Transaksi ${tx.nomor_transaksi}`,
          created_by: currentUser.id,
        };
        setStockMovements((sm) => [newMovement, ...sm]);
      });

      return updatedProducts;
    });

    // If transaction is outgoing ('keluar'), auto generate Surat Jalan if not already present
    if (tx.tipe === 'keluar') {
      generateDeliveryNoteForTx(tx);
    }
  };

  const generateDeliveryNoteForTx = (tx: Transaction) => {
    const existing = deliveryNotes.find((dn) => dn.transaction_id === tx.id);
    if (existing) return;

    const dateObj = new Date();
    const YYYY = dateObj.getFullYear();
    const MM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const seq = String(deliveryNotes.filter((d) => d.arah === 'keluar').length + 1).padStart(4, '0');
    const nomorSj = `SJ/${YYYY}/${MM}/${seq}`;

    const cust = customers.find((c) => c.id === tx.customer_id);

    const newDn: DeliveryNote = {
      id: `dn-${Date.now()}`,
      nomor_surat_jalan: nomorSj,
      arah: 'keluar',
      transaction_id: tx.id,
      tanggal: tx.tanggal,
      tanggal_kirim: tx.tanggal,
      customer_id: tx.customer_id,
      customer: cust,
      nama_penerima: cust?.kontak_person || cust?.nama || 'Penerima',
      alamat_tujuan: cust?.alamat || 'Alamat Customer',
      telepon_tujuan: cust?.telepon || '-',
      nama_sopir: 'Sopir Ekspedisi',
      nomor_kendaraan: 'B 1234 GDK',
      ekspedisi: 'Ekspedisi Gudang',
      jumlah_koli: tx.items?.length || 1,
      keterangan: tx.keterangan,
      status: 'diterbitkan',
      diterbitkan_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    setDeliveryNotes((prev) => [newDn, ...prev]);
    logAudit('TERBITKAN_SURAT_JALAN', 'delivery_notes', newDn.id, null, newDn);
  };

  const updateTransactionStatus = (id: string, newStatus: 'selesai' | 'dibatalkan') => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return { success: false, error: 'Transaksi tidak ditemukan' };

    try {
      if (newStatus === 'selesai' && tx.status === 'draft') {
        applyStockTrigger(tx);
      }
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t))
      );
      logAudit('UPDATE_STATUS_TRANSAKSI', 'transactions', id, tx.status, newStatus);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal memperbarui status' };
    }
  };

  // Delivery Notes Status Update & Receipt Confirmation
  const updateDeliveryNoteStatus = (id: string, newStatus: DeliveryNote['status'], notes?: string) => {
    setDeliveryNotes((prev) =>
      prev.map((dn) => (dn.id === id ? { ...dn, status: newStatus, updated_at: new Date().toISOString() } : dn))
    );
    logAudit('UPDATE_STATUS_SJ', 'delivery_notes', id, null, { newStatus, notes });
  };

  const confirmDeliveryReceipt = (id: string, data: {
    tanggal_terima: string;
    nama_penerima: string;
    ttd_penerima_url?: string;
    returns?: Array<{ item_id: string; product_id: string; qty_retur: number; alasan: string }>;
  }) => {
    const dn = deliveryNotes.find((d) => d.id === id);
    if (!dn) return;

    setDeliveryNotes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: data.returns && data.returns.length > 0 ? 'ditolak_sebagian' : 'diterima',
              tanggal_terima: data.tanggal_terima,
              nama_penerima: data.nama_penerima,
              ttd_penerima_url: data.ttd_penerima_url || d.ttd_penerima_url,
              updated_at: new Date().toISOString(),
            }
          : d
      )
    );

    // If there are returns, automatically create an incoming Return Transaction to increase stock back
    if (data.returns && data.returns.length > 0) {
      const returnItems = data.returns.map((r) => ({
        product_id: r.product_id,
        qty: r.qty_retur,
        qty_aktual: r.qty_retur,
        harga_satuan: 0,
        subtotal: 0,
        keterangan: `Retur pengiriman ${dn.nomor_surat_jalan}: ${r.alasan}`,
      }));

      addTransaction({
        tipe: 'masuk',
        tanggal: data.tanggal_terima,
        customer_id: dn.customer_id,
        nomor_referensi: dn.nomor_surat_jalan,
        keterangan: `Retur penerimaan barang dari Surat Jalan ${dn.nomor_surat_jalan}`,
        total_nilai: 0,
        status: 'selesai',
        items: returnItems as any,
      });
    }

    logAudit('KONFIRMASI_PENERIMAAN_SJ', 'delivery_notes', id, null, data);
  };

  const setCurrentRole = (role: UserRole) => {
    const matched = profiles.find((p) => p.role === role) || {
      id: `prof-${role}`,
      nama_lengkap: `User ${role.toUpperCase()}`,
      role,
      is_active: true,
    };
    setCurrentUser(matched);
  };

  return (
    <AppContext.Provider
      value={{
        businessInfo,
        updateBusinessInfo,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        units,
        addUnit,
        suppliers,
        addSupplier,
        customers,
        addCustomer,
        products,
        addProduct,
        updateProduct,
        archiveProduct,
        duplicateProduct,
        transactions,
        addTransaction,
        updateTransactionStatus,
        deliveryNotes,
        updateDeliveryNoteStatus,
        confirmDeliveryReceipt,
        stockMovements,
        profiles,
        currentUser,
        setCurrentRole,
        auditLogs,
        logAudit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
