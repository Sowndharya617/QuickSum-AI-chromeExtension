# QuickSum AI

QuickSum AI is a Chrome extension that summarizes any web page using Google's Gemini AI.

## Features

- Summarize the current page:
  - **Brief summary** (2-3 sentences)
  - **Detailed summary**
  - **Bullet points**
- Copy summaries to clipboard
- Save your Gemini API key securely

## Installation

1. Download or clone this repo.
2. Go to `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this extension folder.

## How to Use

1. Click the QuickSum AI icon in your toolbar.
2. Go to **Options** and enter your Gemini API key.  
   → Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey).
3. Visit any page you want to summarize.
4. Open the popup, choose a summary type, and click **Summarize This Page**.
5. Copy your summary if needed!

## Permissions

- Tabs
- Scripting
- Active Tab
- Storage
- Access to all URLs

## Troubleshooting

- **No API key set?** → Go to Options and save your key.
- **No summary?** → Check that the page has readable text.
- **API errors?** → Check your key and quota in Google AI Studio.
