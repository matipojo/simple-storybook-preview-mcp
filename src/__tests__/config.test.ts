import { describe, it, expect } from 'vitest';
import { buildConfig, buildCspOrigins, normalizeUrl, DEFAULT_STORYBOOK_URL } from '../config.js';

describe('normalizeUrl', () => {
  it('should strip trailing slashes', () => {
    // Arrange
    const url = 'http://localhost:6006///';

    // Act
    const result = normalizeUrl(url);

    // Assert
    expect(result).toBe('http://localhost:6006');
  });

  it('should leave clean URLs unchanged', () => {
    // Arrange
    const url = 'http://localhost:6006';

    // Act
    const result = normalizeUrl(url);

    // Assert
    expect(result).toBe('http://localhost:6006');
  });
});

describe('buildCspOrigins', () => {
  it('should generate 10 consecutive port origins from the base URL', () => {
    // Arrange
    const baseUrl = 'http://localhost:6006';

    // Act
    const origins = buildCspOrigins(baseUrl);

    // Assert
    expect(origins).toHaveLength(10);
    expect(origins[0]).toBe('http://localhost:6006');
    expect(origins[9]).toBe('http://localhost:6015');
  });

  it('should handle HTTPS URLs with explicit port', () => {
    // Arrange
    const baseUrl = 'https://storybook.example.com:9009';

    // Act
    const origins = buildCspOrigins(baseUrl);

    // Assert
    expect(origins[0]).toBe('https://storybook.example.com:9009');
    expect(origins[9]).toBe('https://storybook.example.com:9018');
  });

  it('should default to port 443 for HTTPS without explicit port', () => {
    // Arrange
    const baseUrl = 'https://storybook.example.com';

    // Act
    const origins = buildCspOrigins(baseUrl);

    // Assert
    expect(origins[0]).toBe('https://storybook.example.com:443');
  });

  it('should default to port 80 for HTTP without explicit port', () => {
    // Arrange
    const baseUrl = 'http://storybook.example.com';

    // Act
    const origins = buildCspOrigins(baseUrl);

    // Assert
    expect(origins[0]).toBe('http://storybook.example.com:80');
  });
});

describe('buildConfig', () => {
  it('should use DEFAULT_STORYBOOK_URL when no env URL is provided', () => {
    // Arrange & Act
    const cfg = buildConfig(undefined);

    // Assert
    expect(cfg.storybookUrl).toBe(DEFAULT_STORYBOOK_URL);
  });

  it('should use DEFAULT_STORYBOOK_URL for empty string', () => {
    // Arrange & Act
    const cfg = buildConfig('');

    // Assert
    expect(cfg.storybookUrl).toBe(DEFAULT_STORYBOOK_URL);
  });

  it('should use provided URL and strip trailing slashes', () => {
    // Arrange & Act
    const cfg = buildConfig('http://my-host:9009/');

    // Assert
    expect(cfg.storybookUrl).toBe('http://my-host:9009');
  });

  it('should derive CSP origins from the provided URL', () => {
    // Arrange & Act
    const cfg = buildConfig('http://localhost:3000');

    // Assert
    expect(cfg.cspOrigins[0]).toBe('http://localhost:3000');
    expect(cfg.cspOrigins).toHaveLength(10);
  });

  it('should enable debug when DEBUG is "true"', () => {
    // Arrange & Act
    const cfg = buildConfig(undefined, 'true');

    // Assert
    expect(cfg.debug).toBe(true);
  });

  it('should enable debug when DEBUG is "1"', () => {
    // Arrange & Act
    const cfg = buildConfig(undefined, '1');

    // Assert
    expect(cfg.debug).toBe(true);
  });

  it('should disable debug by default', () => {
    // Arrange & Act
    const cfg = buildConfig(undefined, undefined);

    // Assert
    expect(cfg.debug).toBe(false);
  });

  it('should disable debug for arbitrary strings', () => {
    // Arrange & Act
    const cfg = buildConfig(undefined, 'yes');

    // Assert
    expect(cfg.debug).toBe(false);
  });

  it('should throw a clear error for invalid URLs', () => {
    // Arrange & Act & Assert
    expect(() => buildConfig('not-a-url')).toThrow('Invalid STORYBOOK_URL: "not-a-url"');
  });
});

