const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const axios = require('axios');

const TEMPLATE_FILENAME = './template.ejs';
const OUTPUT_FILENAME = './dist/readme.md';
const LICHESS_PROFILE_URL = 'https://lichess.org/api/user/lxchurbakov';
const LICHESS_CHALLENGE_LINK = 'https://lichess.org/?user=lxchurbakov#friend';
const LEETCODE_STATS_LINK = 'https://leetcodestats.cyclic.app/lxch';

const promisify = (predicate) => (...args) => new Promise((resolve, reject) => predicate(...args, (err, data) => err ? reject(err) : resolve(data)));

const readFile = promisify(fs.readFile.bind(fs));
const writeFile = promisify(fs.writeFile.bind(fs));
const makeDir = promisify(fs.mkdir.bind(fs));
const readDir = promisify(fs.readdir.bind(fs));
const copyFile = promisify(fs.copyFile.bind(fs));

const beautify = (name) => name.charAt(0).toUpperCase() + name.substr(1);

//
// Lichess related stuff
//

const fetchLichessRating = async (keys = ['blitz', 'rapid', 'puzzle']) => {
    const response = await axios.get(LICHESS_PROFILE_URL).then(({ data }) => data);

    return Object.entries(response.perfs)
        .filter(([key]) => keys.includes(key))
        .map(([key, value]) => ({ name: beautify(key), value: value.rating }));
};

const fetchLeetcodeCount = async () => {
    return axios.get(LEETCODE_STATS_LINK).then(({ data }) => data)
        .then(({ totalSolved }) => totalSolved);
};

;(async () => {
    const templatePath = path.resolve(process.cwd(), TEMPLATE_FILENAME);
    const outputPath = path.resolve(process.cwd(), OUTPUT_FILENAME);

    const template = await readFile(templatePath).then(($) => $.toString());

    const lichessRating = await fetchLichessRating();
    const leetcodeCount = await fetchLeetcodeCount();
    
    const content = ejs.render(template, {
        name: 'Alexander Churbakov',
        role: 'Fullstack JS/TS developer',
        experience_years: 'more than 8',
        lichessRating, lichessLink: LICHESS_CHALLENGE_LINK,
        tgUserName: 'lxchurbakov',
        calendlyLink: 'https://calendly.com/lxch/job-interview',
        cvLink: 'https://beryl-plume-b58.notion.site/c5df7d9f758c47229b046d34d1573a26',
        leetcodeCount,
    }, {});

    const dirname = path.parse(outputPath).dir;

    await makeDir(dirname).catch(() => null);
    await writeFile(outputPath, content);

    // Also I want to build a peeve script
    // For users to check my page out

    const peevedir = path.resolve(process.cwd(), './peeve');

    await Promise.all((await readDir(peevedir)).map((async (filename) => {
        // Copy file
        await copyFile(peevedir + '/' + filename, dirname + '/' + filename);
    })));
})().catch((err) => {
    console.log(err);
    process.exit(-1);
});
