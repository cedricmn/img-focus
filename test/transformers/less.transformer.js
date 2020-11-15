var less = require('less');

module.exports = {
    process: (src) => {
        let css = '';

        less.render(
            src, { sync: true }, (err, result) => {
                css = result.css;
            }

        );

        return "module.exports = " + JSON.stringify(css);
    }
}