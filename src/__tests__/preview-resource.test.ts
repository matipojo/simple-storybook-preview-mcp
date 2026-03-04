import { describe, it, expect } from 'vitest';
import { inlinePlaceholder } from '../resources/preview-resource.js';

describe('inlinePlaceholder', () => {
  it('should replace the placeholder with content', () => {
    // Arrange
    const html = '<style>%%STYLES%%</style>';
    const content = 'body { color: red; }';

    // Act
    const result = inlinePlaceholder(html, '%%STYLES%%', content);

    // Assert
    expect(result).toBe('<style>body { color: red; }</style>');
  });

  it('should return html unchanged when placeholder is not found', () => {
    // Arrange
    const html = '<div>hello</div>';

    // Act
    const result = inlinePlaceholder(html, '%%MISSING%%', 'content');

    // Assert
    expect(result).toBe('<div>hello</div>');
  });

  it('should only replace the first occurrence', () => {
    // Arrange
    const html = '%%TOKEN%% and %%TOKEN%%';

    // Act
    const result = inlinePlaceholder(html, '%%TOKEN%%', 'X');

    // Assert
    expect(result).toBe('X and %%TOKEN%%');
  });

  it('should handle empty content', () => {
    // Arrange
    const html = '<script>%%BUNDLE%%</script>';

    // Act
    const result = inlinePlaceholder(html, '%%BUNDLE%%', '');

    // Assert
    expect(result).toBe('<script></script>');
  });

  it('should handle placeholder at the start of the string', () => {
    // Arrange
    const html = '%%START%%rest';

    // Act
    const result = inlinePlaceholder(html, '%%START%%', 'begin-');

    // Assert
    expect(result).toBe('begin-rest');
  });

  it('should handle placeholder at the end of the string', () => {
    // Arrange
    const html = 'start%%END%%';

    // Act
    const result = inlinePlaceholder(html, '%%END%%', '-finish');

    // Assert
    expect(result).toBe('start-finish');
  });
});
