import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// 每個測試後自動清理
afterEach(() => {
  cleanup();
});
