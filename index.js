const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const TEMPLATE_FILENAME = './template.ejs';
const OUTPUT_FILENAME = './readme.md';

const promisify = (predicate) => (...args) => new Promise((resolve, reject) => predicate(...args, (err, data) => err ? reject(err) : resolve(data)));

const readFile = promisify(fs.readFile.bind(fs));
const writeFile = promisify(fs.writeFile.bind(fs));

;(async () => {
    const templatePath = path.resolve(process.cwd(), TEMPLATE_FILENAME);
    const outputPath = path.resolve(process.cwd(), OUTPUT_FILENAME);

    const template = await readFile(templatePath).then(($) => $.toString());
    
    const content = ejs.render(template, {
        name: 'Александр Чурбаков',
        role: 'Fullstack JS/TS developer',
        experience_years: 'более чем 8',
    }, {});

    await writeFile(outputPath, content);
})().catch((err) => {
    // TODO notify about error and exit -1
});
