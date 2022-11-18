export interface WinstonLogEntry {
  level?: string;
  message?: string;
  metadata: Record<string, unknown>;
}
