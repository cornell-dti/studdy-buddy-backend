const fs = require('fs');

fs.writeFileSync(
    './fa20-courses-simplified.json',
    JSON.stringify(require('./fa20-courses.json')
        .map(({
            courseId, subject, courseNumber, title
        }) => {
            return {
                courseId, subject, courseNumber, title
            };
        }), null, 4));