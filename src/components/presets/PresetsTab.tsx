import React from 'react';
import type { TestCase } from '../../types/invoice';
import TestCaseSelector from './TestCaseSelector';
import TestCasePreview from './TestCasePreview';
import TestButtons from './TestButtons';

interface PresetsTabProps {
  testCases: Record<string, TestCase>;
  selectedTest: string;
  setSelectedTest: (test: string) => void;
  currentTestCase: TestCase;
  isLoading: boolean;
  onTestDirectPdfMake: () => void;
  onTestLibraryImport: () => void;
  onTestAllCases: () => void;
}

const PresetsTab: React.FC<PresetsTabProps> = ({
  testCases,
  selectedTest,
  setSelectedTest,
  currentTestCase,
  isLoading,
  onTestDirectPdfMake,
  onTestLibraryImport,
  onTestAllCases
}) => {
  return (
    <>
      <TestCaseSelector
        testCases={testCases}
        selectedTest={selectedTest}
        setSelectedTest={setSelectedTest}
      />

      <TestCasePreview currentTestCase={currentTestCase} />

      <TestButtons
        currentTestCase={currentTestCase}
        isLoading={isLoading}
        onTestDirectPdfMake={onTestDirectPdfMake}
        onTestLibraryImport={onTestLibraryImport}
        onTestAllCases={onTestAllCases}
      />
    </>
  );
};

export default PresetsTab;
