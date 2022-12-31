const fs = require('fs');
const path = require('path')

const fileList = () => {
    fs.readdir('/tmp/', async (err, files) => {
        if (err) {
            console.error(err);
        } else {
            console.log('This are files in tmp')
            for (const file of files) {
                console.log(path.parse(file).name);
            }
        }
    }
    );
}


module.exports = {
    fileList,
}