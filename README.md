# responsive-images-and-picturefill-generator

This solves my annoyances of making responsive images to be served at different media queries.
This generator takes three file sizes, specified in a relative CONFIG file, and uses imagemagick
to convert files in a `src/` folder structure (currently configured only for Large/Medium/Small
because that's what I need). Given those generated files, a `_pictureElements.txt` will be generated
within an output folder with the pictureElement HTML for each file. The source file folder
will be the URL for the output image sourc, relative from "/assets/img" (again,
based on what I need).

After this conversion step I optimize the output files via ImageOptim, which AFAICT
is only a desktop application. ImageOptim is awesome.

**Links**

* [picturefill](https://github.com/scottjehl/picturefill)
* [imagemagick](http://www.imagemagick.org/script/index.php)
* [ImageOptim](https://imageoptim.com/)

**Requirements**

* node
* imagemagick
* ImageOptim Desktop app (kind of)

**Warning**

This isn't intended to be any more robust than for my explicit needs. It's a relatively 
simple concept and straightforward to extend, but I don't expect to contribute 
anything else to this repo until my use cases change. 

For example, to change the class applied to the generated pictureFill HTML, change the output
snippet in `lib/picture_element_generator.js`. Ideally this would be configurable.

## A more thorough background

Command to run: `./start input-folder output-folder`

Given an input folder of images in an expected structure: 

```
input-folder
   folder-1/
       src/
           CONFIG
           1.jpg
   folder-2/
       src/
           CONFIG
           2.jpg
   folder-3/
       src/
           CONFIG
           3.jpg
```

with CONFIG files at each folder specifying an imagemagick-compliant image dimension
in a specific format (note the 'x' indicates resize the height but maintain the
aspect ratio for the width):

```
L 950x
M 730x
S 355x
```

This output is generated:

```
output-folder
   folder-1/
       _pictureElements.txt
       1_s.jpg
       1_m.jpg
       1_l.jpg
   folder-2/
       _pictureElements.txt
       2_s.jpg
       2_m.jpg
       2_l.jpg
   folder-3/
       _pictureElements.txt
       3_s.jpg
       3_m.jpg
       3_l.jpg
```

In `output-folder/folder-1/_pictureElements.txt`:

```
<picture>
    <source srcset="/assets/img/folder-1/1_l.jpg" media="(min-width: 1224px)">
    <source srcset="/assets/img/folder-1/1_m.jpg" media="(min-width: 768px)">
    <img class="main-content__img" srcset="/assets/img/folder-1/1_s.jpg">
</picture>
```

You can then:

1. Run the generated images through ImageOptim;
2. Copy the generated image folders/files into the `/assets/img/` folder of your 
site;
3. Copy the generated pictureElement HTML int your HTML file as necessary;
4. Be a responsive image wizard.

Enjoy!
