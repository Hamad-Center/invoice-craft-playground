import type { Invoice, InvoiceOptions } from '../types/invoice';
import { generateInvoicePdf } from 'invoice-craft';

export const testDirectPdfMake = async (
  setStatus: (status: string) => void,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  setStatus('Testing pdfMake directly...');

  try {
    // Test pdfMake directly without our library
    setStatus('Loading pdfMake...');
    const pdfMake = await import('pdfmake/build/pdfmake');
    const pdfFonts = await import('pdfmake/build/vfs_fonts');

    setStatus('Initializing pdfMake...');
    const pdfMakeInstance = (pdfMake as any).default || pdfMake;
    const fontsInstance = (pdfFonts as any).default || pdfFonts;

    // Set up fonts
    if (fontsInstance?.pdfMake?.vfs) {
      pdfMakeInstance.vfs = fontsInstance.pdfMake.vfs;
    }

    setStatus('Creating simple PDF...');

    const docDefinition = {
      content: [
        { text: 'Simple Test PDF', style: 'header' },
        { text: 'This is a test to see if pdfMake works directly.' },
        { text: 'From: Test Company' },
        { text: 'To: Test Customer' },
        { text: 'Amount: $100.00' }
      ],
      styles: {
        header: { fontSize: 18, bold: true }
      }
    };

    setStatus('Generating PDF...');

    const pdfPromise = new Promise((resolve, reject) => {
      try {
        pdfMakeInstance.createPdf(docDefinition).getBlob((blob: Blob) => {
          resolve({ blob, filename: 'test-invoice.pdf' });
        });
      } catch (error) {
        reject(error);
      }
    });

    const result = await Promise.race([
      pdfPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('PDF generation timeout')), 30000)
      )
    ]);

    setStatus('PDF generated successfully! Check your downloads folder.');

    // Trigger download
    const { blob, filename } = result as { blob: Blob; filename: string };
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus('Direct pdfMake test successful! PDF downloaded.');
  } catch (error) {
    console.error('Direct pdfMake error:', error);
    setStatus(`Direct pdfMake Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setIsLoading(false);
  }
};

export const testLibraryImport = async (
  invoice: Invoice,
  options: InvoiceOptions,
  setStatus: (status: string) => void,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  setStatus('Testing invoice library...');

  try {
    setStatus('Loading invoice library...');
    // Using static import from top of file

    setStatus('Generating PDF with library...');
    console.log('Generating invoice:', invoice, options);

    const result = await Promise.race([
      generateInvoicePdf(invoice, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Library generation timeout')), 30000)
      )
    ]);

    setStatus('PDF generated successfully! Downloading...');

    // Trigger download
    const { blob, filename } = result as { blob: Blob; filename: string };
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus('Library test successful! PDF downloaded.');
  } catch (error) {
    console.error('Library error:', error);
    setStatus(`Library Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setIsLoading(false);
  }
};
