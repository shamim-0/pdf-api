const express = require('express');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/invoice', express.static(path.join(__dirname, 'invoice')));

app.get('/', (req, res)=>{
    res.send('new Server is running')
})


app.post('/genarate-pdf', async (req, res) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = req.body.url;

  const filename = Date.now();
  const filePath = path.join(__dirname, 'invoice', `${filename}.pdf`);

  // Ensure the invoice directory exists
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.pdf({ path: filePath, format: 'A4', printBackground: true });
  await browser.close();

  res.send(`success url: http://localhost:${port}/invoice/${filename}.pdf`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
