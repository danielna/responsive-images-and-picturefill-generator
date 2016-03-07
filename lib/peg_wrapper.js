var fs = require('fs');
var path = require('path');
var PictureElementGenerator = require('./picture_element_generator');

var args = process.argv.slice(2);

// src, remoteFolderName, outputDir
var peg = new PictureElementGenerator(args[0], args[1], args[2]);

try {
    peg.generate();
} catch(e) {
    console.log('Error generating picture elements: ' + e);
}
