# AI-Powered Web Scraping Engine

A modern, intuitive dashboard for an AI-powered web scraping service that allows users to extract structured data from any website without predefined schemas, view results in real-time, and export data in multiple formats.

## Features

- **URL Input**: Enter any website URL and start scraping with a single click
- **Real-time Status**: View extraction progress with visual indicators
- **Results Visualization**: Display extracted data in a collapsible JSON tree view with syntax highlighting
- **Multiple Export Formats**: Download scraped data in JSON, CSV, and Excel formats
- **Configurable Settings**: Customize extraction parameters (wait time, depth, specific data types)
- **History Management**: Access previously scraped URLs with timestamps

## Technologies Used

### Frontend

- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Unstyled, accessible UI components
- **Lucide React**: Beautiful, consistent icons
- **React Router**: Client-side routing
- **React Hook Form**: Form validation and handling
- **Zod**: Schema validation
- **Framer Motion**: Animation library

### Web Scraping

- **Cheerio**: Fast, flexible implementation of jQuery for server-side scraping
- **JSDOM**: JavaScript implementation of the DOM for parsing HTML
- **Mozilla Readability**: Extract clean article content from web pages
- **Playwright**: Browser automation for handling JavaScript-rendered content
- **TurnDown**: HTML to Markdown converter

### Data Processing

- **Custom AI Extraction Engine**: Intelligent data extraction without predefined schemas
- **Metadata Extraction**: Automatically extract page metadata
- **Content Analysis**: Extract meaningful content from web pages

## Project Structure

```
src/
├── components/         # UI Components
│   ├── Dashboard/      # Dashboard components
│   │   ├── Header.tsx
│   │   ├── HistorySidebar.tsx
│   │   ├── Layout.tsx
│   │   ├── ResultsPanel.tsx
│   │   ├── SettingsPanel.tsx
│   │   └── UrlInputSection.tsx
│   └── ui/             # Shadcn UI components
├── lib/                # Core libraries
│   ├── scraper/        # Scraping engine
│   │   ├── api.ts      # API interface
│   │   ├── engine.ts   # Core scraping engine
│   │   ├── extractors/ # Data extractors
│   │   ├── types.ts    # Type definitions
│   │   └── utils/      # Utility functions
├── services/           # Service layer
│   └── ScraperService.ts # Scraper service
└── types/              # Type definitions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd web-scraping-engine
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a URL in the input field
2. Configure scraping settings if needed
3. Click the "Scrape" button
4. View the extracted data in the results panel
5. Download the data in your preferred format (JSON, CSV, or Excel)

## Algorithms and Techniques

### Intelligent Data Extraction

The scraper uses a combination of techniques to extract meaningful data:

1. **DOM Traversal**: Analyzes the DOM structure to identify data patterns
2. **Content Analysis**: Uses Mozilla Readability to extract main content
3. **Metadata Extraction**: Extracts standard metadata from HTML head tags
4. **Data Structuring**: Organizes extracted data into a structured format

### Export Formats

- **JSON**: Native format for the extracted data
- **CSV**: Flattened representation for spreadsheet applications
- **Excel**: Formatted spreadsheet with proper data types

## Development

### Building for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Cheerio](https://cheerio.js.org/)
- [Mozilla Readability](https://github.com/mozilla/readability)
- [Playwright](https://playwright.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
