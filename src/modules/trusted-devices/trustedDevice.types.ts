export interface CreateTrustedDeviceInput {
  userId: string;
  trustedDeviceIdHash: string;
  expiresAt: Date;
}