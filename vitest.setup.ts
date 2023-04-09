import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Extend Vitest's expect method with methods from react-testing-library.
expect.extend(matchers);
