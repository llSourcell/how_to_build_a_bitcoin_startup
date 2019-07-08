Health Figures
==============
Inspired by the hGraph, hFigures is a javascript library that aims to deliver a starting point for interactive health data visualization.

The file `simple.html` is an example using a small dataset comprising basic health measurements. It can also be navigated via the [live version, which can be found here](http://ledancs.github.io/hFigures/).

For a holistic visualization of a complex dataset, the file `complex.html` provides an overview of the library visualization capabilities.

The implementation and evaluation of this library has been published as a Software article in the BMC Medical Informatics and Decision Making journal. The article is available [online](http://bmcmedinformdecismak.biomedcentral.com/articles/10.1186/s12911-016-0275-6).

Please cite the article if you have used the library on your research work.
DOI: 10.1186/s12911-016-0275-6

### Requirements
hFigures was built with [d3.js](http://d3js.org/), a copy of the library is included in this repository. All rights and license terms apply to the d3.js library accordingly.

### How to navigate


Click and drag anywhere in the screen to pan along the figure.


Use the mouse wheel to zoom in and out of the figure.


When zooming in, the labels for each measurement will become visible.

### Visualization


The file `simple.html` is displayed in the following figure as a static PNG image.


![hFigures Example](img/figureHFiguresSimple.png?raw=true "hFigures Example")


### Live Demo

Currently we are working on having a permanent site were everyone could use a live demo of hFigures. At the moment, Petteri Ponsimaa from University of Oulu has applied the visualization to the frequent shopper dataset obtained from one of Finland's biggest retailers. He based the groups of measurements according to the Findiet 2012 survey. The recommended targets are according to the recommendations from the National Nutrition Council.

[Click here to see Petteri's live demo](http://interact.oulu.fi/hFigures/nutrition.html).

Acknowledgements
----------------
This research was supported jointly by TEKES (the Finnish Funding Agency for Technology and Innovation) as part of the Digital Health Revolution and by the European Commission and TEKES under the ARTEMIS-JU WithMe project.
