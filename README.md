# VeriScope: AI-Powered Research Assistant

VeriScope is an AI-powered research assistant designed specifically for students. It leverages cutting-edge artificial intelligence to streamline and enhance the research process, ensuring accuracy and efficiency.

## Key Features

- **Fake News Detection:** VeriScope can analyze text and URLs to identify potential misinformation and fake news, helping students to discern credible sources.
- **Research Paper Generation:** The tool can assist in generating research papers by structuring content, suggesting relevant topics, and drafting sections, allowing students to focus on the core research and analysis.

## Tech Stack

- **Frontend:** Next.js 15, React 18, Tailwind CSS
- **AI/ML:** Google Genkit, Gemini AI
- **UI Components:** Radix UI, Shadcn/ui
- **State Management:** React Query, React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/OnHighEngineer/ResearchTool-using-LLM.git

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file and add your API key:
# GOOGLE_GENAI_API_KEY=your_api_key_here

# Run the development server
npm run dev
```

The app will be available at `http://localhost:9002`

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_GENAI_API_KEY` | Your Google Gemini API key |

Get your API key from: https://aistudio.google.com/app/apikey

## Project Structure

```
├── src/
│   ├── ai/                    # AI flows and configurations
│   │   ├── flows/
│   │   │   ├── detect-fake-news.ts
│   │   │   └── generate-research-paper.ts
│   │   └── ai-instance.ts
│   ├── app/                   # Next.js app router pages
│   │   ├── fake-news-detector/
│   │   └── research/
│   └── components/            # React components
├── public/                   # Static assets
└── package.json
```

## License

MIT License

---

Built with Next.js and Google Gemini AI
