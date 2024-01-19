const fs = require('fs');

fs.writeFileSync('./readme.md', `
# Hey everyone, my name is Alexander

And I am a Fullstack Javascript Engineer with more than 8 years of experience and wannbe indiehacker.
`, (err) => {
    if (err) {
        process.exit(1);
    }
});
