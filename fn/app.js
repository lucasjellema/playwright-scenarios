const { translate } = require("./translate");
const f = async (input) => {
    const i = JSON.parse(input)
    const translation = await translate(i.text, i.sourceLanguage, i.targetLanguage)
    return JSON.stringify(Object.assign({"translation": translation}, i))
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
rl.on('line', function (line) {
    f(line).then((value) => {
        console.log(value);
    }
    )
})