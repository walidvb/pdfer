# PDFER 2000

This is a micro service that simply returns a pdf file from an html string.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## API

POST `/create-pdf` with parameters:

| `html` | An html string, potentially containing external stylesheets and scripts |
| `filename` | Name of the file to be returned |
| `pdfOptions` | an object containing any options available to [https://github.com/puppeteer/puppeteer/blob/v5.4.1/docs/api.md#pagepdfoptions](puppeteer's `.pdf` method) |

## TODO:

- add a secret key to only allow certain sources to access the servicce


### Example call

```
res = RestClient.post('http://localhost:3131/create-pdf', {
  html: body,
  filename: filename,
  pdfOptions: {
    footerTemplate: footer,
    headerTemplate: '',
  }
}.to_json, {content_type: :json})

return res.body
```