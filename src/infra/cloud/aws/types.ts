export interface UploadedFile {
  name: string;
  url: string;
}
export interface FileInfo {
  mimeType: string;
  fileName: string;
  folderPath: string;
}
export interface DownloadInfo {
  ETag: string;
  ServerSideEncryption: string;
  Location: string;
}

export interface UploadInfo {
  mimeType: string;
  fileName: string;
  presignedUrl: string;
  downloadLink: string;
}
