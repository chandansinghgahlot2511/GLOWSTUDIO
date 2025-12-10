export enum AppStatus {
  IDLE = 'IDLE',
  IMAGE_SELECTED = 'IMAGE_SELECTED',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ImageFile {
  file?: File;
  previewUrl: string;
  base64Data: string; // The raw base64 string without the prefix
  mimeType: string;
}

export interface EditResult {
  imageUrl: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}