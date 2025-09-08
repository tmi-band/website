# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for the TMI (Too Much Information) band. It's a simple multi-page HTML site with JavaScript enhancements for dynamic content loading.

## Architecture

- **Static HTML pages**: Core pages (index, about, videos, gallery, etc.) are static HTML
- **Dynamic content**: Events, songs, and contact form use jQuery AJAX to interact with AWS API Gateway endpoints
- **Styling**: Single `style.css` file with Google Fonts (Lato)
- **JavaScript**: Vanilla JavaScript with jQuery 3.7.1 for AJAX calls
- **Images**: Band photos and event images stored directly in the root directory

## API Endpoints

The site communicates with AWS Lambda functions via API Gateway:
- Events: `https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/events`
- Songs: `https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/songs`
- Contact: `https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/contact`

## Deployment

```bash
./publish-website
```

Deploys the website to AWS S3 bucket `s3://tmi-band.net/` using AWS CLI sync command. Excludes hidden files and the publish script itself.

## Development

No build process required - this is a static site. To test locally:
1. Open HTML files directly in a browser, or
2. Use a local web server (e.g., `python3 -m http.server`)

Note: Dynamic content (events, songs, contact form) requires the AWS backend to be running.

## Key Files

- `index.html`: Landing page with band image
- `events.js`: Fetches and displays upcoming/past events
- `songs.js`: Fetches and displays song list
- `contact.js`: Handles contact form submission
- `style.css`: All site styling
- `publish-website`: Deployment script to AWS S3