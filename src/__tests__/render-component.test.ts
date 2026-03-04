import { describe, it, expect } from 'vitest';
import { buildStoryUrl, extractStoryMetadata } from '../tools/render-component.js';

describe('buildStoryUrl', () => {
  it('should construct the correct iframe URL', () => {
    // Arrange
    const baseUrl = 'http://localhost:6006';
    const storyId = 'example-button--primary';

    // Act
    const url = buildStoryUrl(baseUrl, storyId);

    // Assert
    expect(url).toBe('http://localhost:6006/iframe.html?id=example-button--primary&viewMode=story');
  });

  it('should encode special characters in storyId', () => {
    // Arrange
    const baseUrl = 'http://localhost:6006';
    const storyId = 'components/form--input & select';

    // Act
    const url = buildStoryUrl(baseUrl, storyId);

    // Assert
    expect(url).toContain('id=components%2Fform--input%20%26%20select');
  });

  it('should work with custom base URLs', () => {
    // Arrange
    const baseUrl = 'https://storybook.example.com:9009';
    const storyId = 'design-system-button--large';

    // Act
    const url = buildStoryUrl(baseUrl, storyId);

    // Assert
    expect(url).toBe('https://storybook.example.com:9009/iframe.html?id=design-system-button--large&viewMode=story');
  });
});

describe('extractStoryMetadata', () => {
  it('should extract metadata from entries key', () => {
    // Arrange
    const index = {
      entries: {
        'example-button--primary': {
          id: 'example-button--primary',
          title: 'Example/Button',
          name: 'Primary',
          importPath: './src/stories/Button.stories.tsx',
          tags: ['autodocs'],
        },
      },
    };

    // Act
    const result = extractStoryMetadata(index as never, 'example-button--primary');

    // Assert
    expect(result).toEqual({
      id: 'example-button--primary',
      title: 'Example/Button',
      name: 'Primary',
      componentPath: undefined,
      importPath: './src/stories/Button.stories.tsx',
      exportName: undefined,
      tags: ['autodocs'],
    });
  });

  it('should extract metadata from stories key (legacy format)', () => {
    // Arrange
    const index = {
      stories: {
        'my-story--default': {
          id: 'my-story--default',
          title: 'MyStory',
          name: 'Default',
        },
      },
    };

    // Act
    const result = extractStoryMetadata(index as never, 'my-story--default');

    // Assert
    expect(result?.id).toBe('my-story--default');
    expect(result?.title).toBe('MyStory');
  });

  it('should return undefined for unknown storyId', () => {
    // Arrange
    const index = {
      entries: {
        'example-button--primary': { id: 'example-button--primary' },
      },
    };

    // Act
    const result = extractStoryMetadata(index as never, 'nonexistent--story');

    // Assert
    expect(result).toBeUndefined();
  });

  it('should return undefined for empty index', () => {
    // Arrange
    const index = {};

    // Act
    const result = extractStoryMetadata(index as never, 'any--story');

    // Assert
    expect(result).toBeUndefined();
  });
});
