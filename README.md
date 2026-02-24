# Local Shoe Factory Landing Page

A simple, professional landing page website for a local shoe manufacturing factory to showcase their business, products, and contact information. The page serves as an online presence to attract potential customers and provide essential business information in a clean, accessible format.

## Overview

This project is a static landing page designed to present a local shoe factory's business information, including their products, manufacturing capabilities, and contact details. The website is built with web standards and optimized for performance and accessibility.

## Development Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A text editor or IDE (VS Code, Sublime Text, etc.)
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd proj_a80-local-shoe-factory-landing-page
   ```

2. Open the project in your preferred text editor:
   ```bash
   code .
   ```

3. To view the site locally, simply open `index.html` in your web browser:
   - Right-click on `index.html` and select "Open with Browser"
   - Or use a local development server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js (if you have http-server installed)
     npx http-server -p 8000
     ```
   - Navigate to `http://localhost:8000` in your browser

### Making Changes

1. Edit the HTML, CSS, or JavaScript files as needed
2. Refresh your browser to see changes (hard refresh with Ctrl+Shift+R or Cmd+Shift+R if needed)
3. Test across different browsers and screen sizes

## File Structure

```
proj_a80-local-shoe-factory-landing-page/
├── index.html          # Main HTML file with page structure
├── styles.css          # CSS styling for the landing page
├── script.js           # JavaScript for interactivity
├── README.md           # Project documentation (this file)
└── .gitignore         # Git ignore rules for version control
```

### File Descriptions

- **index.html**: Contains the semantic HTML structure of the landing page including header, hero section, product showcase, about section, and contact form
- **styles.css**: All styling rules for layout, colors, typography, responsive design, and animations
- **script.js**: Interactive functionality such as form validation, smooth scrolling, and dynamic content
- **.gitignore**: Specifies intentionally untracked files to ignore in version control

## Deployment

### GitHub Pages Deployment

This project is configured for easy deployment using GitHub Pages:

1. Push your code to a GitHub repository:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select the branch (usually `main`) and root folder (`/`)
   - Click "Save"

3. Your site will be published at:
   ```
   https://<username>.github.io/<repository-name>/
   ```

4. Any subsequent pushes to the main branch will automatically update the live site

### Alternative Deployment Options

- **Netlify**: Drag and drop your project folder or connect your Git repository
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Traditional Web Hosting**: Upload files via FTP to your web server's public directory

## Browser Compatibility

The landing page is designed to work across modern browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

### Responsive Design

The site is fully responsive and optimized for:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Maintenance Guidelines

### Regular Updates

- Review and update product information quarterly
- Check for broken links monthly
- Test contact form functionality weekly
- Update copyright year annually

### Performance Optimization

- Optimize images before adding (use WebP format when possible)
- Minimize CSS and JavaScript for production
- Ensure all assets are cached appropriately
- Monitor page load times using browser dev tools

### Accessibility

- Maintain semantic HTML structure
- Ensure all images have descriptive alt text
- Keep color contrast ratios WCAG AA compliant (4.5:1 for normal text)
- Test with screen readers periodically
- Ensure keyboard navigation works for all interactive elements

### Security Best Practices

- Keep all dependencies updated (if using any frameworks later)
- Validate and sanitize all form inputs
- Use HTTPS in production
- Implement proper CORS policies if connecting to APIs

## Contributing

When making changes to this project:

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test thoroughly

3. Commit with clear, descriptive messages:
   ```bash
   git commit -m "Add: description of what you added"
   ```

4. Push to your branch and create a pull request

## Contact Information

For questions, updates, or maintenance requests regarding this project:

- **Project Repository**: <repository-url>
- **Issue Tracker**: <repository-url>/issues
- **Project Maintainer**: <contact-email>

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Changelog

### Version 1.0.0 (Initial Release)
- Project initialization
- Basic file structure setup
- Documentation created
