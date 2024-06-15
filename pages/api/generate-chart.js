// pages/api/generate-chart.js
import puppeteer from 'puppeteer';
import { renderToString } from 'react-dom/server';
import MyChart from '../../components/MyChart';

export default async function handler(req, res) {
  // Render the chart to an HTML string
  const chartHtml = renderToString(<MyChart />);

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
      </body>
    </html>
  `;

  // Launch puppeteer to render the HTML and capture a screenshot
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml);

  // Wait for the chart to be rendered
  await page.waitForSelector('#chart');

  // Capture a screenshot
  const imageBuffer = await page.screenshot();

  await browser.close();

  // Set the response type and send the image buffer
  res.setHeader('Content-Type', 'image/png');
  res.send(imageBuffer);
}
