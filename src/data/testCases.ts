import type { TestCase } from '../types/invoice';

export const testCases: Record<string, TestCase> = {
  basic: {
    name: "Basic Invoice",
    invoice: {
      from: { name: "Test Company" },
      to: { name: "Test Customer" },
      invoiceNumber: "INV-001",
      invoiceDate: "2024-01-15",
      currency: "USD",
      items: [
        {
          description: "Test Service",
          quantity: 1,
          unitPrice: 100.00
        }
      ]
    },
    options: {}
  },

  detailed: {
    name: "Detailed Invoice with All Fields",
    invoice: {
      from: {
        name: "Acme Corporation",
        address: "123 Business St\nSuite 100\nNew York, NY 10001",
        email: "billing@acme.com",
        phone: "+1 (555) 123-4567"
      },
      to: {
        name: "John Smith",
        address: "456 Customer Ave\nApt 2B\nLos Angeles, CA 90210",
        email: "john@example.com",
        phone: "+1 (555) 987-6543"
      },
      invoiceNumber: "INV-2024-001",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      currency: "USD",
      items: [
        {
          description: "Web Development Services",
          quantity: 40,
          unitPrice: 75.00,
          taxRate: 0.08
        },
        {
          description: "SSL Certificate",
          quantity: 1,
          unitPrice: 99.00,
          taxRate: 0.08
        }
      ],
      discount: 50.00,
      notes: "Thank you for your business! Payment terms: Net 30 days.",
      terms: "Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly service charge."
    },
    options: {
      layoutStyle: 'modern',
      brandColor: '#2563eb'
    }
  },

  customLabels: {
    name: "Custom Labels (Spanish)",
    invoice: {
      from: { name: "Mi Empresa S.A." },
      to: { name: "Cliente Ejemplo" },
      invoiceNumber: "FACT-2024-001",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      currency: "EUR",
      items: [
        {
          description: "Servicios de Consultoría",
          quantity: 10,
          unitPrice: 50.00,
          taxRate: 0.21
        }
      ],
      notes: "¡Gracias por su negocio!"
    },
    options: {
      layoutStyle: 'minimal',
      brandColor: '#dc2626',
      labels: {
        invoice: "Factura",
        date: "Fecha",
        dueDate: "Fecha de Vencimiento",
        from: "De",
        to: "Para",
        description: "Descripción",
        quantity: "Cantidad",
        unitPrice: "Precio Unitario",
        tax: "Impuesto",
        total: "Total",
        subtotal: "Subtotal",
        discount: "Descuento",
        notes: "Notas",
        terms: "Términos"
      }
    }
  },

  multipleItems: {
    name: "Many Items Invoice",
    invoice: {
      from: { name: "Tech Solutions Inc." },
      to: { name: "Enterprise Client Corp." },
      invoiceNumber: "INV-2024-MULTI",
      invoiceDate: "2024-01-15",
      currency: "USD",
      items: [
        { description: "Software License (Basic)", quantity: 5, unitPrice: 99.99, taxRate: 0.10 },
        { description: "Software License (Pro)", quantity: 2, unitPrice: 199.99, taxRate: 0.10 },
        { description: "Training Session", quantity: 8, unitPrice: 150.00, taxRate: 0.10 },
        { description: "Support Hours", quantity: 20, unitPrice: 85.00, taxRate: 0.10 },
        { description: "Custom Integration", quantity: 1, unitPrice: 2500.00, taxRate: 0.10 },
        { description: "Documentation", quantity: 3, unitPrice: 75.00, taxRate: 0.10 },
        { description: "Server Setup", quantity: 2, unitPrice: 300.00, taxRate: 0.10 }
      ],
      discount: 200.00
    },
    options: {
      layoutStyle: 'creative',
      brandColor: '#059669'
    }
  },

  edgeCase: {
    name: "Edge Cases (Long text, special chars)",
    invoice: {
      from: {
        name: "Company with Very Long Name That Might Cause Layout Issues LLC",
        address: "A very long address that contains special characters like @#$%^&*() and might cause formatting issues\n123 Special Street\nÄÖÜ City, 12345"
      },
      to: {
        name: "Customer with Special Characters: Müller & Søn A/S",
        address: "Ñoño Street 123\nÇity with açcénts"
      },
      invoiceNumber: "INV-2024-SPECIAL-CHARS-&-SYMBOLS",
      invoiceDate: "2024-01-15",
      currency: "USD",
      items: [
        {
          description: "Service with very long description that might wrap to multiple lines and test the layout handling of extensive text content in invoice generation",
          quantity: 1.5,
          unitPrice: 1234.56,
          taxRate: 0.195
        },
        {
          description: "Émojis & Ünicöde tëst 🚀 ✨ 💼",
          quantity: 0.25,
          unitPrice: 9999.99
        }
      ]
    },
    options: {
      brandColor: '#7c3aed'
    }
  }
};
