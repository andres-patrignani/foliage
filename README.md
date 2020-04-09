# Foliage

Web-based green canopy cover analysis tool. Version 1.0.

[![DOI](https://zenodo.org/badge/233376575.svg)](https://zenodo.org/badge/latestdoi/233376575)


Foliage is a light-weight web application aimed at people that need to quantify green canopy cover from downward-facing digital images.

## Features

* Allow user to upload images from file system
* Allow user to upload images from camera in mobile devices
* Allow user to download tabular data in CSV format
* Allow user to download original and classified images in ZIP format
* Extract EXIF geo-location metadata from images

---

## Future considerations

* Add progress bar
* Integrate with Dropbox Saver
* Capture current geo-location
* For specific crops calculate Normalize Difference Vegetation Index (NDVI)
* Allow users to edit image table cells for individual images.
* Allow users to optionally send data and images to a database (e.g. Firebase) for citizen science applications.

---

## External packages

This project would not be possible without the following projects and libraries:

* [FileSaver.JS](https://www.npmjs.com/package/file-saver/v/1.3.2)
* [JSZip.js](https://stuk.github.io/jszip/)
* [p5.js](https://p5js.org/)
* [Bulma modern CSS framework](https://bulma.io/)
* [Exif.js](https://github.com/exif-js/exif-js)
* [Fontawesome](https://fontawesome.com/)
