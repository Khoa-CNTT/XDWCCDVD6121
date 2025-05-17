export interface VayInfo {
  ten: string;
  anh: string;
  gia: number;
}

export interface MakeupInfo {
  ten_makeup: string;
  anh_makeup: string;
  gia_makeup: number;
  phong_cach?: string;
  chi_tiet?: string;
}

export interface RapInfo {
  ten_rap: string;
  anh_rap: string;
  gia_thue: number;
  mau?: string;
  soGhe?: string;
  soDayGhe?: string;
}

export interface BaseCartItem {
  id: number;
  type: string;
}

export interface VayCuoiCartItem extends BaseCartItem {
  type: "VAYCUOI";
  vayId: number;
  instanceId?: number; // Add instanceId to store the reserved instance
  startDate: string;
  endDate: string;
  vayInfo: VayInfo;
  reserved_at?: string; // Add reserved_at to track reservation time in cart
}

export interface MakeupCartItem extends BaseCartItem {
  type: "MAKEUP";
  makeupId: number;
  ngay_hen: string;
  makeupInfo: MakeupInfo;
}

export interface RapCuoiCartItem extends BaseCartItem {
  type: "RAPCUOI";
  rapId: number;
  startDate: string;
  endDate: string;
  rapInfo: RapInfo;
}

export type CartItem = VayCuoiCartItem | MakeupCartItem | RapCuoiCartItem;
