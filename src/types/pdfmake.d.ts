// Type declarations for pdfmake modules
declare module 'pdfmake/build/vfs_fonts' {
  interface VFS {
    pdfMake?: {
      vfs: Record<string, string>;
    };
  }
  const vfs: VFS;
  export = vfs;
}

declare module 'pdfmake/build/pdfmake' {
  interface PdfMakeStatic {
    vfs?: Record<string, string>;
    createPdf(docDefinition: any): {
      getBlob(callback: (blob: Blob) => void): void;
      download(filename?: string): void;
      open(): void;
    };
  }
  const pdfMake: PdfMakeStatic;
  export = pdfMake;
}
