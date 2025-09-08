# TMI Band Website v2

A modern, responsive static website for the TMI (Too Much Information) band.

## Features

- **Modern Design**: Clean, responsive layout that works on all devices
- **Single Page Application**: Smooth scrolling navigation between sections
- **Dynamic Content**: Events and songs loaded from AWS Lambda functions
- **Image Gallery**: Lightbox for viewing full-size photos
- **Contact Form**: Integrated with AWS backend
- **Performance Optimized**: Lazy loading images, minimal dependencies

## Structure

```
v2/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styles
├── js/
│   └── main.js        # JavaScript functionality
└── images/            # (uses parent directory images)
```

## Deployment

The site is completely static except for the AWS Lambda endpoints for events, songs, and contact form submission.

To deploy:
1. Copy all files from the `v2/` directory to your web server
2. Ensure the AWS Lambda endpoints are accessible
3. Update image paths if needed

## AWS Lambda Integration

The site fetches data from these endpoints:
- Events: `https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/events`
- Songs: `https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/songs`
- Contact: `https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/contact`

## Maintenance

To update content:
- **Events & Songs**: Update via AWS Lambda function
- **Gallery**: Add/replace images and update the gallery section in `index.html`
- **Band Info**: Edit directly in `index.html`
- **Styles**: Modify `css/style.css`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)