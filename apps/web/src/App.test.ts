import { describe, it, expect } from 'vitest';
import { App } from './App';

describe('App component', () => {
  it('is defined as a functional component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
