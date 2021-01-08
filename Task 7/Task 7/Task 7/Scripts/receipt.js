const request = require('request-promise');
const fs = require("fs");

module.exports = function (apiKey) {
    return new Client(apiKey)
}



function Client(apiKey) {
    this.apiKey = apiKey;
}

Client.prototype.predict = function (options) {
    modelType = options.modelType
    modelId = options.modelId
    filePath = options.filePath || ''
    fileURL = options.fileURL
    fileName = filePath ? filePath.split('/')[filePath.split('/').length - 1] : ''

    let urlNanoNets = "http://app.nanonets.com/api/v2/${ocr}/Model/${193b6af5-7858-4a27-b6c4-645fa2904f8d}/LabelFile/"
    var urlOptions = {
        'method': 'POST',
        'url': urlNanoNets,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': "Basic " + Buffer.from(this.apiKey + ":").toString("base64")
        },
        'formData': {
            'modelId': modelId,
        }
    }

    if (fileURL) {
        urlOptions.formData = {
            'urls': fileURL,
            'modelId': modelId
        }
    }
    if (filePath) {
        urlOptions.formData = {
            'modelId': modelId,
            'file': {
                'value': fs.createReadStream(filePath),
                'options': {
                    'filename': fileName,
                    'contentType': null
                }
            }
        }
    }

    return request(urlOptions)

}