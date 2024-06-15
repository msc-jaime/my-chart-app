// pages/api/generate-chart.js
import puppeteer from 'puppeteer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import GraphBW from '../../components/GraphBW';

export default async function handler(req, res) {
  // Render the chart to an HTML string
  //const chartHtml = renderToString(<GraphBW />);

  // Create a full HTML document with the rendered chart
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; }
        </style>
      </head>
      <body>
        <div id="chart">${chartHtml}</div>
        <script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/recharts/umd/Recharts.min.js"></script>
      </body>
    </html>
  `;

  // Launch puppeteer to render the HTML and capture the SVG
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

  // Wait for the chart to be rendered
  await page.waitForSelector('#chart svg');

  // Extract the bounding box of the chart
  const chartBoundingBox = await page.evaluate(() => {
    const svgElement = document.querySelector('#chart div');
    
    const { x, y, width, height } = svgElement.getBoundingClientRect();
    return { x, y, width, height };
  });

  // Screenshot the chart element
  console.log(chartBoundingBox);
  await page.setViewport({ width: 550, height: Math.ceil(chartBoundingBox.height) });

  const screenshotBuffer = await page.screenshot({
    clip: {
      x: chartBoundingBox.x,
      y: chartBoundingBox.y,
      width: 550,
      height: chartBoundingBox.height,
    },
    omitBackground: true,
  });

  await browser.close();

  if (screenshotBuffer) {
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } else {
    res.status(500).json({ error: 'Error generating image' });
  }
}
