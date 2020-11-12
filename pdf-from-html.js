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
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      page.setViewport({
        width: 1280,
        height: 1000,
      })
      const frame = page.mainFrame()
      console.log('setting content')
      await frame.setContent(htmlInput, { waitUntil: 'networkidle2' })
      console.log('content set')
      await page.setJavaScriptEnabled(true);
      // we assume, the input received externally, only have the body
      // so here, we have a template in order to apply styles
      // now, go to page
      // await page.goto(`file://${outputHTMLFilePath}`, { waitUntil: 'networkidle2' });
      await page.emulateMediaType('print');
      // generate the pdf
      console.log('printing pdf')
      const pdfBuffer = await page.pdf({ 
        format: 'A4', 
        ...DEFAULT_PDF_OPTIONS, 
        marginTop: "100px",
        marginBottom: "100px",
        headerTemplate: '<span></span>',
        footerTemplate: '<div style="color: #738088;font-size: 10px; font-family: Roboto, Helvetica, Arial; text-align: center; width: 100% ">page <span class="pageNumber"></span> of <span class="totalPages">hi</span></div>',
        ...pdfOptions,
      });
      console.log('pdf printed')
      // close the browser
      browser.close();
      resolve(pdfBuffer);
    } catch (e) {
      reject(e);
    }
    resolve(0);
  });
}