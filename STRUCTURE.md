# Demo App Structure

This document outlines the restructured architecture of the invoice library demo application.

## Overview

The original monolithic `App.tsx` file (2,298 lines) has been broken down into a well-organized, modular component structure for better maintainability, readability, and reusability.

## Directory Structure

```
demo-app/src/
├── App.tsx                           # Main application component (221 lines)
├── types/
│   └── invoice.ts                    # TypeScript type definitions
├── data/
│   └── testCases.ts                  # Test case data
├── types/
│   ├── invoice.ts                    # TypeScript type definitions
│   └── pdfmake.d.ts                  # PDFMake type declarations
└── components/
    ├── Header.tsx                    # App header component
    ├── ToastManager.tsx              # Toast notification manager
    ├── ToastNotification.tsx         # Individual toast component
    └── custom/
        ├── CustomTab.tsx             # Main custom tab container
        ├── InvoiceForm.tsx           # Invoice form container
        ├── JsonEditor.tsx            # JSON editor with complete configuration
        ├── CompanySection.tsx        # Company information section
        ├── InvoiceDetailsSection.tsx # Invoice details section
        ├── ItemsSection.tsx          # Invoice items section
        ├── AdditionalOptionsSection.tsx # Additional options section
        ├── GenerateButton.tsx       # Generate PDF button
        └── InvoicePreview.tsx        # Live invoice preview
```

## Component Hierarchy

### Main App Component
- **App.tsx**: Root component that manages global state and coordinates between tabs

### Shared Components
- **Header.tsx**: Application header with title and description
- **TabNavigation.tsx**: Tab switching between presets and custom modes
- **StatusSection.tsx**: Displays current operation status

### Presets Tab Components
- **PresetsTab.tsx**: Container for preset test cases functionality
  - **TestCaseSelector.tsx**: Grid of available test cases
  - **TestCasePreview.tsx**: Preview of selected test case data
  - **TestButtons.tsx**: Action buttons for testing

### Custom Tab Components
- **CustomTab.tsx**: Container for custom invoice creation
  - **InvoiceForm.tsx**: Form container with all input sections
    - **CompanySection.tsx**: From/To company information
    - **InvoiceDetailsSection.tsx**: Invoice number, dates, currency
    - **ItemsSection.tsx**: Invoice line items management
    - **AdditionalOptionsSection.tsx**: Discount, branding, notes
    - **GenerateButton.tsx**: PDF generation trigger
  - **InvoicePreview.tsx**: Live preview of the invoice

## Key Features

### Type Safety
- **types/invoice.ts**: Comprehensive TypeScript interfaces for all data structures
- Strong typing throughout the application for better development experience

### Data Management
- **data/testCases.ts**: Centralized test case definitions
- Separation of data from presentation logic

### Modern UI Components
- **ToastManager.tsx**: Manages toast notifications with smart lifecycle
- **ToastNotification.tsx**: Individual toast with animations and auto-dismiss
- **JsonEditor.tsx**: Advanced JSON editor with complete configuration support

### Component Benefits
1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused or extended
3. **Maintainability**: Easier to locate and modify specific functionality
4. **Testing**: Individual components can be tested in isolation
5. **Performance**: Smaller components enable better React optimization

## State Management

The application uses React's built-in state management with hooks:
- Global state managed in the main App component
- Props passed down to child components
- Event handlers passed as props for state updates

## Styling

All components use inline styles for:
- Self-contained styling
- Dynamic theming based on props
- No external CSS dependencies
- Consistent design system

## Development Benefits

1. **Faster Development**: Easier to locate and modify specific features
2. **Better Collaboration**: Multiple developers can work on different components
3. **Easier Debugging**: Isolated components make issues easier to track
4. **Code Reuse**: Components can be extracted for use in other projects
5. **Better IDE Support**: Smaller files provide better IntelliSense and navigation

## Migration Notes

The restructured application maintains 100% feature parity with the original monolithic version while providing:
- Improved code organization
- Better type safety
- Enhanced maintainability
- Cleaner separation of concerns
- More testable architecture
