export type Metadata = Record<string | number, unknown>;

export interface WinstonLogEntry {
  level?: string;
  timestamp?: string;
  message?: string;
  metadata: Metadata;
}
