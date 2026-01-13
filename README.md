# tejreddym. | Personal Portfolio

> A cyberpunk-inspired interactive portfolio showcasing AI/ML engineering and full-stack development work.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tejreddym.cv)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/tejreddym/deploys)

## 🚀 Overview

A unique, terminal-themed portfolio website featuring an interactive PEPPERai chat interface, glassmorphism UI design, and a distinctive cyberpunk aesthetic. Built with vanilla HTML, CSS, and JavaScript, this portfolio showcases projects in AI/ML, computer vision, and full-stack development.

**Live Site:** [tejreddym.cv](https://tejreddym.cv)

## ✨ Key Features

### 🖥️ Interactive Terminal Interface

- **Boot Sequence Animation**: System initialization with realistic terminal boot logs
- **PEPPERai Chat Bot**: AI-powered chat interface using Groq API
- **Command System**: Navigate the site through terminal commands (`/help`, `/projects`, `/about`, etc.)
- **Admin Mode**: Secret handshake authentication for enhanced features

### 🎨 Design Features

- **Glassmorphism UI**: Modern glass effect navigation and components
- **Responsive Design**: Mobile-first approach with Bootstrap 5.3.8
- **Custom Animations**: Brand dot pulse, fade-in effects, smooth transitions
- **Cyberpunk Theme**: Dark background with neon green accents (#00ff00)
- **CSS Custom Properties**: Centralized theme management system

### ♿ Accessibility

- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Semantic HTML**: Proper HTML5 structure
- **Focus Management**: Clear focus indicators

### 🔧 Technical Implementation

- **Netlify Functions**: Serverless backend for chat API
- **Environment Variables**: Secure API key management
- **Error Handling**: Robust error handling with user feedback
- **SEO Optimized**: Meta descriptions, semantic structure, sitemap

## 📁 Project Structure

```
html-css-portfolio/
├── index.html              # Homepage with terminal interface
├── about.html             # System specifications / About page
├── projects.html          # Project showcase
├── interests.html         # Personal interests & hobbies
├── contact.html           # Contact form with glassmorphism
├── css/
│   ├── style.css         # Main stylesheet with theme variables
│   └── proj-style.css    # Projects page specific styles
├── js/
│   └── scripts.js        # Terminal logic & chat interface
├── images/
│   ├── rocket.webp       # Favicon
│   └── project-*.webp    # Project thumbnails
├── netlify/
│   └── functions/
│       └── chat.js       # Serverless chat API endpoint
├── robots.txt            # Search engine directives
├── sitemap.xml           # Site structure for SEO
└── README.md             # This file
```

## 🛠️ Tech Stack

### Frontend

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid, Animations
- **JavaScript (ES6+)**: Async/await, DOM manipulation
- **Bootstrap 5.3.8**: Responsive grid and components

### Fonts

- **Playfair Display**: Display text (headings)
- **Libre Baskerville**: Body text
- **Courier Prime**: Monospace (terminal)

### Backend & Deployment

- **Netlify**: Hosting & deployment
- **Netlify Functions**: Serverless API
- **Groq API**: AI chat responses

### Development Tools

- **Git**: Version control
- **VS Code**: Primary IDE
- **WebP**: Image optimization

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for local Netlify Functions testing)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tejreddym/html-css-portfolio.git
   cd html-css-portfolio
   ```

2. **Open locally**

   ```bash
   # Simple method - open index.html in browser
   open index.html

   # Or use a local server (recommended)
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

3. **Set up Netlify Functions (Optional)**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Set environment variables
   netlify env:set GROQ_API_KEY your_api_key_here

   # Run locally with functions
   netlify dev
   ```

### Environment Variables

Create a `.env` file for local development:

```env
GROQ_API_KEY=your_groq_api_key_here
```

**Note**: Never commit `.env` to version control. The `.gitignore` should exclude it.

## 🎨 Customization

### Theme Colors

All colors are defined as CSS custom properties in `css/style.css`:

```css
:root {
  --color-bg-primary: #0d0d0d;
  --color-text-primary: #f2f2f2;
  --color-accent: #00ff00;
  /* ... more variables */
}
```

### Terminal Commands

Modify commands in `js/scripts.js`:

```javascript
switch (cmd) {
  case "/help":
  // Your custom help text
  case "/mycommand":
  // Add new commands here
}
```

### Chat Personality

Edit the knowledge base in `netlify/functions/chat.js` to customize PEPPERai's responses.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: ≥ 992px
- **Large Desktop**: ≥ 1200px

## 🔐 Security Features

- **Environment Variables**: API keys stored securely
- **Rate Limiting**: Built into Groq API
- **Input Validation**: Form validation on contact page
- **No Client Secrets**: All sensitive operations server-side

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance)
- **Image Format**: WebP for optimal compression
- **Font Loading**: Preconnect to Google Fonts
- **CSS Optimization**: Minimal, component-based styles
- **No jQuery**: Vanilla JavaScript for performance

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (not supported - modern features required)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Divya Tej Reddy Maddala (Tej Reddy)**

- Email: phoenixtej3468@gmail.com
- LinkedIn: [linkedin.com/in/tej-reddy-m](https://www.linkedin.com/in/tej-reddy-m)
- GitHub: [@tejreddym](https://github.com/tejreddym)

## 🙏 Acknowledgments

- Design inspiration: Cyberpunk aesthetic & terminal interfaces
- AI Assistant: ChatGPT & Gemini for development assistance
- Icons & Graphics: Custom designed in Canva
- Groq API for chat functionality

## 🐛 Known Issues

- Terminal interface only displays on desktop (≥992px) by design
- Secret handshake easter egg is client-side (not secure authentication)

## 🔮 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Blog section with markdown support
- [ ] Project filtering by technology
- [ ] Animation performance optimization
- [ ] Progressive Web App (PWA) features
- [ ] Multi-language support

## 📞 Support

For issues, questions, or suggestions:

1. Open an issue on GitHub
2. Email: phoenixtej3468@gmail.com
3. Connect on LinkedIn

---

**Built with 💚 by Tej Reddy | © 2026**
