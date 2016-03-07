var path = require('path');
var fs = require('fs');

/**
 * picture_element_generator.js
 *
 * For each .jpg file in a srcImageDir, create a pictureElements.html file in the
 * that contains the pictureElement HTML for those images.
 *
 * This should happen before the files are actually resized.
 *
 * @param srcImageDir           Directory to look for the source .jpg files
 * @param remoteFolderName      Directory in `/assets/img/` containing the remote image
 * @param outputDir             Directory to output the PictureElement HTML file
 */
function PictureElementGenerator(srcImageDir, remoteFolderName, outputDir) {
    if (!srcImageDir || !remoteFolderName) {
        throw new Error('srcImageDir and/or remoteFolderName must be provided.');
    }
    this.srcImageDir = srcImageDir;
    this.remoteImageDirectory = path.join('/assets/img/', remoteFolderName);
    var outputFile = '_pictureElements.txt';
    if (outputDir) {
        this.outputFile = path.join(outputDir, outputFile);
    } else {
        this.outputFile = path.join(this.srcImageDir, outputFile);
    }
}

PictureElementGenerator.prototype.getJpgFilenames = function(cb) {
    fs.readdir(this.srcImageDir, function(err, files) {
        if (err) {
            throw err;
        }
        return cb(files);
    });
};

PictureElementGenerator.prototype.generate = function() {
    function removeDuplicates(filesArray) {
        var uniques = [];
        for (var i = 0; i < filesArray.length; i++) {
            var file = filesArray[i];
            if (uniques.indexOf(file) < 0 && file.indexOf('pictureElement') === -1) {
                uniques.push(file);
            }
        }
        return uniques;
    }

    this.getJpgFilenames(function(files) {
        var filenames = files.filter(function(f) {
            return path.extname(f) === '.jpg';
        }).map(function(f) {
            return path.basename(f, '.jpg'); 
        });

        filenames = removeDuplicates(filenames);

        var output = [];
        for (var i = 0; i < filenames.length; i++) {
            output.push(this.createPictureElement(filenames[i]));
        }

        fs.writeFileSync(this.outputFile, output.join('\n\n'), 'utf8');
        console.log('Wrote ' + filenames.length + ' <picture> elements to ' + this.outputFile);
    }.bind(this));
};

PictureElementGenerator.prototype.createPictureElement = function(filename) {
    var imagePath = path.join(this.remoteImageDirectory, filename);
    var output = [];
    //output.push('<a href="' + imagePath + '_l.jpg" target="_blank">');
    output.push('<picture>');
    output.push('    <source srcset="' + imagePath + '_l.jpg" media="(min-width: 1224px)">');
    output.push('    <source srcset="' + imagePath + '_m.jpg" media="(min-width: 768px)">');
    output.push('    <img class="main-content__img" srcset="' + imagePath + '_s.jpg">');
    output.push('</picture>');
    //output.push('</a>');
    return output.join('\n');
};

module.exports = PictureElementGenerator;
