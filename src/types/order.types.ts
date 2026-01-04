/**
 * Order & Supply Chain Types (Phase 2)
 */

import type { ID, Timestamp, Document } from './common.types';

// ===== Order Type =====
export type OrderType = 'NORMAL' | 'TRIAL';

// ===== Order Status =====
export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_DISTRIBUTOR_APPROVAL' // A → B
  | 'PENDING_LICENSE_HOLDER_APPROVAL' // B → C
  | 'PENDING_MANUFACTURER_APPROVAL' // C → D
  | 'FEASIBILITY_CHECK' // D checks quantity & schedule
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_PRODUCTION'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

// ===== Shipment Status =====
export type ShipmentStatus =
  | 'PREPARING'
  | 'INTERNATIONAL_SHIPPED'
  | 'IN_TRANSIT_INTERNATIONAL'
  | 'ARRIVED_AT_AIRPORT'
  | 'CUSTOMS_INSPECTION'
  | 'CUSTOMS_CLEARED'
  | 'IN_TRANSIT_TO_DISTRIBUTOR'
  | 'DELIVERED_TO_DISTRIBUTOR'
  | 'DISTRIBUTOR_INSPECTION'
  | 'IN_TRANSIT_TO_HOSPITAL'
  | 'DELIVERED_TO_HOSPITAL'
  | 'HOSPITAL_INSPECTION'
  | 'ACCEPTED';

// ===== Collection Status =====
export type CollectionStatus =
  | 'NOT_REQUIRED'
  | 'SCHEDULED'
  | 'REMINDER_SENT'
  | 'PICKED_UP'
  | 'IN_STORAGE'
  | 'DISPOSED';

// ===== Surgery Status =====
export type SurgeryStatus = 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

// ===== Order =====
export interface Order {
  id: ID;
  orderNumber: string;

  // Type & Basic Info
  type: OrderType;
  status: OrderStatus;

  // Relationships
  projectId?: ID;
  contractId?: ID;
  hospitalId: ID;
  hospitalName: string;

  // Product Info
  productName: string;
  nuclide?: string;
  activityPerSeed?: number;
  quantity: number;
  totalActivity?: number;
  sourceNumbers?: string[];

  // Dates
  requestedDeliveryDate: Timestamp;
  approvedDeliveryDate?: Timestamp;

  // Collection
  collectionRequired: boolean;
  collectionDate?: Timestamp;
  collectionStatus?: CollectionStatus;

  // Approval Chain (A → B → C → D)
  approvals: OrderApproval[];

  // Feasibility
  feasibilityCheck?: FeasibilityCheck;

  // Shipment
  shipment?: Shipment;

  // Surgery
  surgery?: Surgery;

  // Documents
  documents: Document[];

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// ===== Order Approval =====
export type ApprovalParty = 'HOSPITAL' | 'DISTRIBUTOR' | 'LICENSE_HOLDER' | 'MANUFACTURER';

export interface OrderApproval {
  id: ID;
  orderId: ID;
  party: ApprovalParty;
  approvedBy?: ID;
  approvedByName?: string;
  approvedAt?: Timestamp;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  rejectionReason?: string;
}

// ===== Feasibility Check =====
export interface FeasibilityCheck {
  id: ID;
  orderId: ID;
  requestedQuantity: number;
  requestedDate: Timestamp;
  isFeasible: boolean;
  approvedQuantity?: number;
  approvedDate?: Timestamp;
  productionCapacity?: number;
  notes?: string;
  reviewedBy?: ID;
  reviewedAt?: Timestamp;
}

// ===== Shipment =====
export interface Shipment {
  id: ID;
  orderId: ID;
  status: ShipmentStatus;

  // International
  airWaybill?: string;
  invoice?: Document;
  packingList?: Document;
  certificateOfAnalysis?: Document;
  qaDocuments?: Document[];
  labelPhotos?: Document[];
  arrivalAtAirportDate?: Timestamp;

  // Customs
  customsInspectionStarted?: Timestamp;
  importDeclaration?: Document;
  clearanceCertificate?: Document;
  customsClearedAt?: Timestamp;

  // Domestic - To Distributor
  domesticCarrier?: string;
  domesticTrackingNumber?: string;
  pickupFromAirportAt?: Timestamp;
  deliveredToDistributorAt?: Timestamp;
  deliveryNoteDistributor?: Document;
  proofOfDeliveryDistributor?: Document;

  // Distributor Inspection
  distributorInspectionReport?: Document;
  distributorInspectionCompletedAt?: Timestamp;
  nonConformanceReports?: Document[];

  // Domestic - To Hospital
  dispatchedToHospitalAt?: Timestamp;
  deliveredToHospitalAt?: Timestamp;
  deliveryNoteHospital?: Document;
  proofOfDeliveryHospital?: Document;

  // Hospital Inspection
  hospitalInspectionCompletedAt?: Timestamp;
  hospitalInspectionReport?: Document;
  acceptedAt?: Timestamp;

  // Timeline
  milestones: ShipmentMilestone[];
}

export interface ShipmentMilestone {
  id: ID;
  status: ShipmentStatus;
  timestamp: Timestamp;
  location?: string;
  notes?: string;
  updatedBy?: ID;
}

// ===== Surgery =====
export interface Surgery {
  id: ID;
  orderId: ID;
  status: SurgeryStatus;
  scheduledDate?: Timestamp;
  completedDate?: Timestamp;
  facility: string;
  surgeon?: string;
  usageRecords?: Document[];
  notes?: string;
}

// ===== Collection =====
export interface Collection {
  id: ID;
  orderId: ID;
  status: CollectionStatus;
  scheduledDate: Timestamp;
  reminderSentAt?: Timestamp;
  pickedUpAt?: Timestamp;
  pickedUpBy?: ID;
  storageLocation?: string;
  storedAt?: Timestamp;
  disposalMethod?: string;
  disposedAt?: Timestamp;
  disposedBy?: ID;
  recallManifest?: Document;
  completionCertificate?: Document;
  notes?: string;
}

// ===== Inventory Item =====
export interface InventoryItem {
  id: ID;
  productName: string;
  nuclide?: string;
  quantity: number;
  activity?: number;
  location: string;
  status:
    | 'AVAILABLE'
    | 'RESERVED'
    | 'IN_PRODUCTION'
    | 'SHIPPED'
    | 'USED'
    | 'COLLECTED'
    | 'DISPOSED';
  expiryDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ===== Order Filters =====
export interface OrderFilters {
  type?: OrderType[];
  status?: OrderStatus[];
  hospitalIds?: ID[];
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
  collectionRequired?: boolean;
  search?: string;
}

// ===== Order Statistics =====
export interface OrderStats {
  total: number;
  byType: Record<OrderType, number>;
  byStatus: Record<OrderStatus, number>;
  pendingApprovals: number;
  inProduction: number;
  inTransit: number;
  pendingCollection: number;
}
