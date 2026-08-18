export type CategoryType =
  | 'Electronics'
  | 'Office Furniture'
  | 'Software'
  | 'Appliances'
  | 'Home & Living'
  | 'Travel'
  | 'Other';

export interface DocumentItem {
  id: string;
  name: string;
  type: 'receipt' | 'invoice' | 'warranty_card' | 'manual';
  fileUrl: string;
  previewUrl?: string;
  uploadDate: string;
  fileSize: string;
}

export interface WarrantyInfo {
  hasWarranty: boolean;
  durationMonths: number;
  startDate: string;
  expiryDate: string;
  provider: string;
  terms: string;
  claimInstructions?: string;
  claimStatus?: 'none' | 'drafted' | 'submitted' | 'approved';
}

export interface ReturnWindowInfo {
  hasReturn: boolean;
  returnDays: number;
  deadlineDate: string;
  status: 'open' | 'expiring_soon' | 'closed';
  policy: string;
  restockingFee?: string;
}

export interface PurchaseItem {
  id: string;
  name: string;
  vendor: string;
  category: CategoryType;
  purchaseDate: string;
  price: number;
  currency: string;
  orderNumber?: string;
  serialNumber?: string;
  paymentMethod?: string;
  warranty: WarrantyInfo;
  returnWindow: ReturnWindowInfo;
  documents: DocumentItem[];
  tags: string[];
  notes?: string;
  aiConfidence?: number;
  aiExtractedNotes?: string;
  taxDeductible?: boolean;
}

export interface AIActionItem {
  id: string;
  type: 'return_closing' | 'warranty_expiring' | 'receipt_sync' | 'warranty_claim';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  purchaseId?: string;
  actionLabel: string;
}

export interface SpendingInsight {
  id: string;
  title: string;
  description: string;
  type: 'spending' | 'warranty' | 'subscription' | 'tax';
  actionLabel: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  referencedPurchaseIds?: string[];
}

export type ActiveView =
  | 'dashboard'
  | 'purchases'
  | 'warranties'
  | 'returns'
  | 'vault'
  | 'analytics'
  | 'timeline'
  | 'settings';
