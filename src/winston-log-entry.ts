export interface WinstonLogEntry {
  level?: string;
  timestamp?: string;
  message?: string;
  metadata: Record<string, unknown>;
}
