const http = require('http');
const url = require('url');
const { translate } = require("./translate");


var port = 3000;
var host = 'localhost';

// https://dev.to/sachinsarawgi/basic-http-server-using-nodejs-from-scratch-2p6k
var server = http.createServer(async function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    let sourceText = "Hello World"
    let sourceLanguage = "en"
    let targetLanguage = "it"
    if (req.method == 'GET') {
        const queryObject = url.parse(req.url, true).query;
        sourceLanguage = queryObject.sourceLanguage
        targetLanguage = queryObject.targetLanguage
        sourceText = decodeURI(queryObject.sourceText)
        if (!queryObject || !queryObject.sourceText) {
            res.end(JSON.stringify({ "error": "No Source Text was provided" }));
        }
        const data = { "sourceText": sourceText, "sourceLanguage": sourceLanguage, "targetLanguage": targetLanguage }
        const translation = await translate(sourceText, sourceLanguage, targetLanguage)
        data['translation'] = translation
        res.end(JSON.stringify(data));

    }
    if (req.method == 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const data = JSON.parse(body);
            const translation = await translate(data.sourceText, data.sourceLanguage, data.targetLanguage)
            data['translation'] = translation
            console.log(`POST - Translate ${JSON.stringify(data)}`)
            res.end(JSON.stringify(data));
        })
    }

}
);


server.listen(port, host, function () {
    console.log(`Listening at http://${host}:${port}`);
})