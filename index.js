const fs = require('fs');

fs.writeFileSync('./readme.md', `
    # LXCH
`, (err) => {
    if (err) {
        process.exit(1);
    }
});
