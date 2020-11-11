const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * Transform an input into a pdf considering the input in the body
 * of an HTML page.
 * @param outputDir output folder path
 * @param outputFile output filename
 * @param inputContent content to be rendered
 */

const DEFAULT_PDF_OPTIONS = {
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  margin: {
    top: '2cm',
    bottom: '2cm',
    left: '1cm',
    right: '1cm',
  }
}
module.exports = (htmlInput, pdfOptions = {}) => {
  
  return new Promise(async (resolve, reject) => {
    try {
      // start a browser with puppeter
      const browser = await puppeteer.launch({
      });
      const page = await browser.newPage();
      page.setViewport({
        width: 1280,
        height: 1000,
      })
      const frame = page.mainFrame()
      await frame.setContent(htmlInput, { waitUntil: 'networkidle2' })
      await page.setJavaScriptEnabled(true);
      // we assume, the input received externally, only have the body
      // so here, we have a template in order to apply styles
      // now, go to page
      // await page.goto(`file://${outputHTMLFilePath}`, { waitUntil: 'networkidle2' });
      await page.emulateMediaType('print');
      // generate the pdf
      const pdfBuffer = await page.pdf({ 
        format: 'A4', 
        ...DEFAULT_PDF_OPTIONS, 
        marginTop: "100px",
        marginBottom: "100px",
        // footerTemplate: '<div style="font-size: 12px"><div class="pageNumber">hi</div><div>hi</div></div>',
        ...pdfOptions,
      });
      // close the browser
      await browser.close();
      resolve(pdfBuffer);
    } catch (e) {
      reject(e);
    }
    resolve(0);
  });
}