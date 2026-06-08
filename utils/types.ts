/**
 * CEIR API response types.
 */

export interface DeviceInfo {
  tac: string;
  shortIMEI: string;
  simSlots: number;
  gsmaDeviceType: string;
  gsmaManufacturer: string;
  gsmaBrandName: string;
  gsmaModelName: string;
  gsmaMarketingName: string;
  gsmaAllocationDate: string;
  gsmaOperatingSystem: string;
  standardisedFullName: string;
  standardisedDeviceVendor: string;
  gsmaImeiQuantitySupport: number;
  standardisedDeviceModel: string;
  standardisedMarketingName: string;
  deviceAtlasID: number;
}

export interface ImeiCheckResult {
  paymentState: string;
  blockState: string;
  networkDate: string;
  grayListHistory: string | null;
  deviceIMEI: string | null;
  declarationId: string | null;
  canPay: boolean;
  IMEI: string;
  IMEI14: string;
  WrongFormat: boolean;
  Incorrect: boolean;
  deviceInfo: DeviceInfo | null;
}

export interface ImeiCheckResponse {
  IMEI_CHECK_LIST: ImeiCheckResult[];
}
