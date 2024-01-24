const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const TEMPLATE_FILENAME = './template.ejs';
const OUTPUT_FILENAME = './readme.md';

const promisify = (predicate) => (...args) => new Promise((resolve, reject) => predicate(...args, (err, data) => err ? reject(err) : resolve(data)));

const readFile = promisify(fs.readFile.bind(fs));

;(async () => {
    const templatePath = path.resolve(process.cwd(), TEMPLATE_FILENAME);

    const template = await readFile(templatePath).then(($) => $.toString());
    
    const content = ejs.render(template, {
        name: 'Александр Чурбаков',
        role: 'Fullstack JS/TS developer',
        experience_years: 'более чем 8',
    }, {});

    console.log(content);
})();

// const template = fs

// console.log(
//     ejs.render('<%= name %>', { name: 'Alex' }, {})
// );

// fs.writeFileSync('./readme.md', `
// # Hey everyone, my name is Alexander

// And I am a Fullstack Javascript Engineer with more than 8 years of experience and wannbe indiehacker.
// `, (err) => {
//     if (err) {
//         process.exit(1);
//     }
// });
