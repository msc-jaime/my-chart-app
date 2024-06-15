// pages/api/generate-chart.js
import puppeteer from 'puppeteer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import GraphBW from '../../components/GraphBW';

function removeMetadata(imageSrc) {
  // Encontrar la posición de la primera coma
  let posicionComa = imageSrc.indexOf(',');
  
  // Verificar si se encontró una coma
  if (posicionComa !== -1) {
      // Extraer el texto después de la primera coma
      let image = imageSrc.substring(posicionComa + 1);
      return image.trim(); // Eliminar espacios en blanco adicionales al inicio y final
  } else {
      return "Error imageSrc";
  }
}

export default async function handler(req, res) {
  const { serviceId, epochStart, epochEnd } = req.query;

  // Render the chart to an HTML string with the provided parameters
  const chartHtml = renderToString(<GraphBW/>);
  //console.log(chartHtml.slice(0, 100));

  // Create a full HTML document with the rendered chart
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * {
            box-sizing: border-box;
          }
          body { margin: 0; }
        </style>
      </head>
      <body>
        <div id="chart" style="right: auto; left: auto">${chartHtml}</div>
        <script>
          window.onload = () => {
            const chartElement = document.getElementById('chart');
            htmlToImage.toSvg(chartElement)
              .then((dataUrl) => {
                const img = new Image();
                img.src = dataUrl;
                document.body.appendChild(img);
              })
              .catch((error) => {
                console.error('Error generating SVG:', error);
              });
          };
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.9.0/html-to-image.min.js"></script>
      </body>
    </html>
  `;
  
  // Launch puppeteer to render the HTML and capture the SVG
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  

  // Wait for the chart to be rendered and the image to be created
  await page.waitForSelector('body img');

  // Extract the data URL of the generated image
  const imageUrl = await page.evaluate(() => {
    const imgElement = document.querySelector('body img');
    return imgElement ? imgElement.src : '';
  });
  
  let image = decodeURIComponent(imageUrl);
  image = removeMetadata(image);
  console.log(image.slice(0, 100));

  await browser.close();
  
  if (image) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(image);
  } else {
    res.status(500).json({ error: 'Error generating SVG' });
  }
}