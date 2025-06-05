# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-05

### Added
- Initial release of Storyblok image loader for Next.js
- Support for Next.js Image component with Storyblok images
- Configurable host and prefix options
- TypeScript support with full type definitions
- ESM and CommonJS compatibility
- Basic image transformation support (resize, quality, format)

### Features
- `storyblokImageLoader` - Default image loader
- `getStoryblokImageLoader` - Factory function for custom configuration
- `imgSrcIsStoryblok` - Utility to check if image source is from Storyblok
- Full TypeScript type definitions
- Environment variable configuration support

### Documentation
- Comprehensive README with usage examples
- API documentation for all exported functions and types
- Configuration options documentation
