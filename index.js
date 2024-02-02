import open from 'open';
import axios from 'axios';
import tkit from 'terminal-kit';

const term = tkit.terminal;

const GITHUB_USERNAME = 'lxchurbakov';
const GITHUB_REPOS_COUNT = 3;

const WEBSITE_LINK = 'https://lxch.io';
const CALENDLY_LINK = 'https://calendly.com/lxch/job-interview';

term.white('👋 Hello fellow dev!\n\n');

term.white('I am');
term.cyan(' Alexander')
term.white(' aka')
term.cyan(' @lxchurbakov')
term.white(', a JS/TS dev \nwith more than 8 years of productioin experience\n');
term.white('and I am looking for a job right now!\n');

const select = (items) => {
    return new Promise((resolve, reject) => {
        term.singleColumnMenu( items , (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response.selectedIndex);
            }
        });
    });
};

;(async () => {

    await (async () => {
        const repos = await axios
            .get(`http://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=${GITHUB_REPOS_COUNT}&sort=updated`)
            .then(({ data }) => data);

        term.white('\n🛠️ in the meantime I build useless stuff like:\n\n');

        repos.forEach((repo) => {
            term.white( `○ ${repo.full_name} - ${repo.stargazers_count} ⭐\n`);
            term.italic(`  ${repo.description}\n  `);
            term.underline.dim(`${repo.url}\n`);
        });
    })().catch((err) => {
        // Can't fetch repos
    });

    // Here we fetch game status
    const { playing } = await axios.get('https://lichess.org/api/user/lxchurbakov').then(({ data }) => data)

    if (playing) {
        term.white('\n♖ Looks like I play chess now!\n');
        term.white('  Visit this link to watch: ');
        term.underline.dim(playing);
    }

    // Here we proceed to the options
    // of what to do with this peeve page

    term.white('\n👀 What do you want to do now?\n');

    const action = await select([
        'Book an interview meeting on calendly',
        'Visit my website',
    ]);

    if (action === 0) {
        open(CALENDLY_LINK);
    }

    if (action === 1) {
        open(WEBSITE_LINK);
    }

    process.exit();
})().catch((err) => {
    process.exit(-1);
});
