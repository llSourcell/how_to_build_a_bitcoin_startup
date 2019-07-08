/**
 * Created by andres on 4/23/15.
 */

/**
 *
 * @param groups
 * @param w
 * @param className
 * @constructor
 */
function HealthFigure(groups, w, className, options){

    /*
     function angle(startAngle, endAngle) {
     var centroidAngle = (startAngle + endAngle)/2;
     // Math.PI (rad) = 180 (deg)
     // centroidAngle (rad) = x (deg)
     // return a > 90 ? a - 180 : a;
     return (centroidAngle * 180) / Math.PI;
     }
     */


    // each circle has
    // name of the measurement
    // angle
    // optimal range
    // yellow ?
    // red ?
    // array of samples
    // selected sample
    // given a timestamp
    // each circle computes: radius, x, y, color
    // functions: first, last, next, previous, goto(timestamp)


    function createSVG(className, w){
        var svg;

        svg = d3.select("div." + className)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

        return svg;
    }

    function createHFigure(svg){
        var hFigure;

        hFigure = svg.append("g")
            .attr("class", "hFigure-wrapper")
            .append("g")
            .attr("class", "hFigure");

        return hFigure;
    }

    function createZones(d3target, measurementsDataObjects, arc){

        var zones;

        zones = d3target.append("g")
            .attr("class", "arcs")
            .selectAll("path.arc")
            .data(measurementsDataObjects)
            .enter()
            .append("path")
            .attr("fill", function (d) {
                return (d.data.label === "empty")? "none" : "#D4ECD5";
            })
            .attr("stroke", function (d) {
                return (d.data.label === "empty")? "none" : "grey";
            })
            .attr({
                "class": "measurementArc",
                // "stroke": "#74c476",
                // "stroke-width": .75,
                "d": arc
            });

        return zones;
    }

    function extractMeasurements(groupedMeasurements){
        var group;
        var total = [];

        for(var i = 0; i < groupedMeasurements.length; i ++){
            group = groupedMeasurements[i];

            total = total.concat(group.measurements);

            // at the end of each group insert an empty space
            // marked with the label property with the value "empty"

            total.push({
                label: "empty"
            });

        }

        return total;
    }

    // how to update the polygon
    function updatePolygon(d3root, timestamp, polygon){
        polygonData = [];

        d3root.selectAll("g.activeFigure")
            .selectAll("g.measurement")
            .each(function (d) {
                polygonData.push(getArc(d.data, timestamp).centroid(d));
            });

        polygon.transition()
            .attr("points", [polygonData].join(" "));
    }

    // how to update the circles
    function updateMeasurements(circles, timestamp){

        circles.on('mouseover', function(d){

            var selectedSample = getSelectedSample(d.data, timestamp);
            console.log(d.data.label + " : " + selectedSample.value);

        });
        circles.on('mouseout', function(d){

        });

        circles.transition()
            .attr("cx", function (d) {
                return getArc(d.data, timestamp).centroid(d)[0];
            })
            .attr("cy", function (d) {
                return getArc(d.data, timestamp).centroid(d)[1];
            })
            .attr("fill", function (d) {
                return getColor(d.data, timestamp, d3.select(this).attr("class"));
            });
    }

    // get the arc object to calculate the centroid
    function getArc(measurement, timestamp){
        var arc;
        var radius;

        // needs a radius that is calculated using the scale
        radius = getRadius(measurement, timestamp);

        arc = d3.svg.arc()
            .innerRadius(radius)
            .outerRadius(radius);

        return arc;
    }

    // creates the radius using the scale of min and max
    function getRadius(measurement, timestamp){

        var scale;
        var selectedSample;
        var radius;

        scale = d3.scale.linear()
            .domain([measurement.min, measurement.max])
            .range([innerRadius, outerRadius]);

        selectedSample = getSelectedSample(measurement, timestamp)

        radius = scale(selectedSample.value);

        return radius;
    }

    function getSelectedSample(measurement, timestamp){
        var samples = measurement.samples;
        var index = getSampleIndex(timestamp, samples);

        return measurement.samples[index];
    }

    // move the labels outside the calculated radius
    function moveLabelHorizontally(d, angle){
        var offset;

        offset = d.box.width/2;

        // clockwise the 12 o'clock is 0 and 6 o'clock is PI

        offset *= (angle <= Math.PI) ? 1 : -1;

        return offset;
    }

    // move the labels so they do not overlap
    var verticalLabelLimit = 0;
    var verticalLabelMargin = 5;
    function moveLabelVertically(i, angle, height, y){

        var delta = i === 0 ? -1 * verticalLabelMargin: 0,
            upper = angle >= 3/2 * Math.PI || angle <= Math.PI/2;

        var collision = upper ?
            (y + height + verticalLabelMargin) >= verticalLabelLimit :
            y <= verticalLabelLimit;

        if(collision && i > 0)
            delta = upper ?
                verticalLabelLimit - (y + height + verticalLabelMargin) : // negative to move it up
                verticalLabelLimit - y; // positive to move it down


        verticalLabelLimit = upper ?
            y + delta :
            y + height + verticalLabelMargin + delta; // add the height and the margin plus possible delta

        return delta;

    }

    // get the final x and y for the label groups
    function getLabelCoordinates(d, i, timestamps){

        var timestamp;
        var marginLabelMeasurement = 50;
        var arc;
        var measurementRadius;
        var finalRadius = 0;
        var coordinates;
        var y;
        var angle = d.startAngle + (d.endAngle - d.startAngle)/2; // preserve the previous angle to complete the circle

        for(var j = 0; j < timestamps.length; j ++){
            timestamp = timestamps[j];
            measurementRadius = getRadius(d.data, timestamp);
            finalRadius = Math.max(measurementRadius + marginLabelMeasurement, defaultLabelRadius, finalRadius);
        }




        arc = d3.svg.arc()
            .innerRadius(finalRadius)
            .outerRadius(finalRadius);

        coordinates = arc.centroid(d);

        // move the labels horizontally outside the radius (x)
        coordinates[0] = coordinates[0] + moveLabelHorizontally(d, angle);

        y = coordinates[1] - d.box.height *.825;

        /*
        hFigure.append("circle")
            .attr("cx", coordinates[0])
            .attr("cy", y)
            .attr({
                "r": 0.5,
                "fill": "red",
                "stroke": "none"
            });


        hFigure.append("circle")
            .attr("cx", coordinates[0])
            // .attr("cy", coordinates[1] + d.box.height *.2)
            .attr("cy", y + d.box.height)
            .attr({
                "r": 0.5,
                "fill": "red",
                "stroke": "none"
            });
        */

        // move the labels vertically to avoid overlapping (y)
        // console.log( d.data.label + " " + d.box.height );

        coordinates[1] = coordinates[1] + moveLabelVertically(i, angle, d.box.height, y);

        d.offset.x = coordinates[0];
        d.offset.y = coordinates[1];

        //return the [x, y] coordinates
        return coordinates;
    }

    function getGroupLabelCoordinates(d, i, timestamps){

        var timestamp;
        var marginLabelMeasurement = 50;
        var numberOfClosestMeasurementsToCheck = 3;
        var arc;
        var measurementRadius;
        var finalRadius = 0;
        var coordinates;
        var y;
        var closestMeasurement;
        var angle = d.startAngle + (d.endAngle - d.startAngle)/2; // preserve the previous angle to complete the circle

        d.data.measurements.sort(function (a, b) {
            var angleA = a.startAngle + (a.endAngle - a.startAngle)/2;
            var angleB = b.startAngle + (b.endAngle - b.startAngle)/2;
            var diffA = Math.abs(angleA - angle);
            var diffB = Math.abs(angleB - angle);

            return diffA - diffB;

        });


        // we need to get the measurement closer to this angle

        for(var j = 0; j < Math.min(numberOfClosestMeasurementsToCheck, d.data.measurements.length); j++){
            closestMeasurement = d.data.measurements[j].data;
            for(var k = 0; k < timestamps.length; k++){
                timestamp = timestamps[k];
                measurementRadius = getRadius(closestMeasurement, timestamp);
                finalRadius = Math.max(measurementRadius + marginLabelMeasurement, defaultLabelRadius, finalRadius);
            }

        }

        // measurementRadius = getRadius(d.data, timestamp);

        // finalRadius = Math.max(measurementRadius + marginLabelMeasurement, defaultLabelRadius);

        arc = d3.svg.arc()
            .innerRadius(finalRadius)
            .outerRadius(finalRadius);

        coordinates = arc.centroid(d);

        // move the labels horizontally outside the radius (x)
        coordinates[0] = coordinates[0] + moveLabelHorizontally(d, angle);

        y = coordinates[1] - d.box.height *.825;

        // move the labels vertically to avoid overlapping (y)
        // console.log( d.data.label + " " + d.box.height );

        coordinates[1] = coordinates[1] + moveLabelVertically(i, angle, d.box.height, y);

        d.offset.x = coordinates[0];
        d.offset.y = coordinates[1];

        //return the [x, y] coordinates
        return coordinates;
    }



    // selects the sample closest to the timestamp provided but before that not after
    function getSampleIndex(timestamp, samples){
        var i;

        samples.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });

        for(i = 0; i < samples.length; i++){
            if(samples[i].timestamp === timestamp){
                return i;
            }
            else if (samples[i].timestamp > timestamp){
                break;
            }
        }

        --i; // return the index of the sample that is either at the exact time or before
        return i < 0 ? 0: i;
    }

    // get next and previous samples
    function getNext(){

        // from the referenceTimestamp we find the closest following timestamp
        // we return that timestamp
        var referenceTimestamp = this.timestamp;
        var closestNextTimestamp = -1;
        var samples;
        var timestampToCompare;
        for(var i = 0; i < measurementsArray.length; i ++){
            if(measurementsArray[i].label === "empty") continue; // discard the group label elements
            samples = measurementsArray[i].samples;
            samples.sort(function (a, b) { return a.timestamp - b.timestamp; }); // ascending order by timestamp

            for(var j = 0; j < samples.length; j++){
                timestampToCompare = samples[j].timestamp;
                if(referenceTimestamp < timestampToCompare){
                    if(closestNextTimestamp === -1){ // check if there is any value given to closestNextTimestamp
                        closestNextTimestamp = timestampToCompare;
                        // stop checking samples of this measurement because they are in ascending order
                        break;
                    }
                    else if(closestNextTimestamp > timestampToCompare){ // we found a closer timestamp
                        closestNextTimestamp = timestampToCompare;
                        break;
                    }
                }
            }
        }

        return closestNextTimestamp === -1 ? referenceTimestamp: closestNextTimestamp;

    }

    function getColor(measurement, timestamp, className){
        var color = "white"; // by default
        var yellowMin = "yellow_min";
        var yellowMax = "yellow_max";
        var redMin = "red_min";
        var redMax = "red_max";
        var samples = measurement.samples;
        var hasAdditionalRanges = false;
        var sample;
        var index;

        var yellow = className === "active" ? "gold": "#FFEF99";
        var red = className === "active" ? "tomato": "#FFC1B5";
        var green = className === "active" ? "#73D651": "#9DE285";


        index = getSampleIndex(timestamp, samples);
        sample = measurement.samples[index];

        // checking now for less than the recommended
        if (typeof measurement[yellowMin] != 'undefined'){
            hasAdditionalRanges = true;
            if(sample.value <= measurement[yellowMin]){
                color = yellow;
            }
        }

        if (typeof measurement[redMin] != 'undefined'){
            hasAdditionalRanges = true;
            if(sample.value <= measurement[redMin]){
                color = red;
            }
        }
        // checking for more than the recommended
        if (typeof measurement[yellowMax] != 'undefined'){
            hasAdditionalRanges = true;
            if(sample.value >= measurement[yellowMax]){
                color = yellow;
            }
        }

        if (typeof measurement[redMax] != 'undefined'){
            hasAdditionalRanges = true;
            if(sample.value >= measurement[redMax]){
                color = red;
            }
        }

        if (hasAdditionalRanges && color === "white"){
            color = green;
        }

        return color;
    }

    function createSvgMeasurementGroups(d3root, data){
        var svgGroups;

        svgGroups = d3root.selectAll("g.measurement")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "measurement hasLabel");

        return svgGroups;

    }

    function createSvgPolygon(d3root, data, className){
        var polygon;

        polygon = d3root.selectAll("g.polygons")
            .append("polygon")
            .attr("points", [data].join(" ")).attr({
                "stroke-width": 1,
                "fill": "none",
                // "fill-opacity": 0.15,
                "vector-effect": "non-scaling-stroke",
                "class": className
            })
            .attr("stroke", className === "active" ? "#5b5b5b": "#BFBFBF");

        // previous color #5b5b5b

        return polygon;
    }

    function createMeasurementCircles(d3root, circleRadius, className){
        var circles = d3root.selectAll("g.measurement")
            .append("circle")
            .attr({
                "stroke": "black",
                "stroke-width": "1",
                "fill": "white",
                "r": circleRadius,
                "cx": 0,
                "cy": 0,
                "class": className
            })
            .attr("stroke", className === "active" ? "#5b5b5b": "#BFBFBF");;


        return circles;
    }

    function insertBoxToLabel(d){
        // IMPORTANT: we need to add here the size of the text for the rectangle's dimensions!
        var box = this.getBBox();

        d.box = {};

        d.box.x = box.x - 5;
        d.box.width = box.width + 10;

        d.box.y = box.y;
        d.box.height = box.height;

        // d.box.y -= 2;
        // d.box.height += 4;
    }

    function insertOffset(d){
        // IMPORTANT: we need to add here the size of the text for the rectangle's dimensions!

        d.offset = {};

        d.offset.x = 0;
        d.offset.y = 0;
    }

    function resizeBox(d3root){
        d3root.selectAll("g.hasLabel")
            .selectAll("g.label")
            .selectAll("rect")
            .attr("x", function(d){
                return d.box.x;
            })
            .attr("y", function (d) {
                return d.box.y;
            })
            .attr("height", function (d) {
                return d.box.height;
            })
            .attr("width", function (d) {
                return d.box.width;
            })
    }

    function ascending (a, b) {
        var angleA = getAngle(a);
        var angleB = getAngle(b);

        return angleA - angleB;
    }

    function descending (a, b) {
        var angleA = getAngle(a);
        var angleB = getAngle(b);

        return angleB - angleA;
    }

    function getAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    function angleUpperRight (d){
        var angle = getAngle(d);

        return angle <= Math.PI/2;
    }

    function angleUpperLeft (d){
        var angle = getAngle(d);

        return angle >= 3/2 * Math.PI;
    }

    function angleLowerRight (d){
        var angle = getAngle(d);
        return angle > Math.PI/2 && angle <= Math.PI;
    }

    function angleLowerLeft (d){
        var angle = getAngle(d);

        return angle < 3/2*Math.PI && angle >= Math.PI;
    }

    function moveLabels(d3root, anglePosition, sortFunction, timestamps){

        var i = 0; // variable i from d3 does not work for this case

        verticalLabelLimit = 0;

        /**
         * http://stackoverflow.com/questions/13203897/d3-nested-appends-and-data-flow
         * https://github.com/mbostock/d3/wiki/Selections
         * http://bocoup.com/weblog/reusability-with-d3/
         * http://bost.ocks.org/mike/nest/
         * http://bl.ocks.org/phoebebright/raw/3176159/
         */

        // I have to sort the parent but that will destroy the polygon
        // unless we restore the order after the new coordinates have been computed

        d3root
            .selectAll("g.hasLabel")
            .filter(anglePosition)
            .sort(sortFunction)
            .selectAll("g.label")
            .transition()
            .attr("transform", function (d) {
                var coordinates = [];
                var className = d3.select(this.parentNode).attr("class");
                var searchResult = className.search("measurement");

                if(searchResult > -1){
                    // console.log(d.data.label + ": " + angle);
                    coordinates = getLabelCoordinates(d, i, timestamps);
                } else{
                    // console.log("* " + d.data.label + ": " + angle);
                    coordinates = getGroupLabelCoordinates(d, i, timestamps);
                }

                i++;
                return "translate (" + coordinates.join(",") + ")";
            });
    }

    function moveLabelsWrapper(d3root, timestamps){

        // upper right corner
        moveLabels(d3root, angleUpperRight, descending, timestamps);

        // upper left corner
        moveLabels(d3root, angleUpperLeft, ascending, timestamps);

        // lower right corner
        moveLabels(d3root, angleLowerRight, ascending, timestamps);

        // lower left corner
        moveLabels(d3root, angleLowerLeft, descending, timestamps);

        d3root.selectAll("g.measurement")
            .sort(ascending);

        // put the groups back into their container
        d3root.selectAll("g.groupLabel")
            .each(function (d) {
                d3.select("g.groupLabels").node().appendChild(this);
            });


        // now the lines
        updateLabelLine(d3root, timestamps);

    }

    // update the label text
    function updateLabels(d3root, timestamp) {

        updateLabelText(d3root, timestamp);

        d3root.selectAll("g.groupLabel g.label text")
            .text(function (d) {
                return d.data.label;
            });

        d3root.selectAll("g.hasLabel g.label text")
            .each(insertBoxToLabel)
            .each(insertOffset);

        resizeBox(d3root);

    }

    function endAll(transition, callback) {
        var n = 0;
        transition.each(function() { ++n; })
            .each('end', function() {
                if (!--n) callback.apply(this, arguments);
            });
    }

    function updateLabelLine(d3root, timestamps){

        var lineFunction = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("linear");

        d3root.selectAll("g.measurement")
            .selectAll("path")
            .transition()
            .attr("d", function(d){
                return getLabelLinePath(lineFunction, timestamps, d);
            });
    }

    function getLabelLinePath(lineFunction, timestamps, d){

        var timestamp;
        var radii = [];
        var lineData = [];
        var measurementRadius;
        var measurementCoordinates;
        var arc;
        var angle;
        var labelOffset = {};
        labelOffset.x = 0;
        labelOffset.y = 0;

        for(var i = 0; i < timestamps.length; i ++){

            timestamp = timestamps[i];
            measurementRadius = getRadius(d.data, timestamp);
            radii.push(measurementRadius);

        }

        radii.sort(function (a, b) {
            return a-b;
        });

        for(var i = 0; i < radii.length; i ++){

            arc = d3.svg.arc()
                .innerRadius(radii[i])
                .outerRadius(radii[i]);

            measurementCoordinates = arc.centroid(d);

            lineData.push({
                "x": measurementCoordinates[0],
                "y": measurementCoordinates[1]
            });

        }

        angle = getAngle(d);

        labelOffset.x = angle <= Math.PI ? -1: 1;
        labelOffset.x *= d.box.width * 0.49;


        labelOffset.y -= d.box.height * 0.35;

        lineData.push({
            "x": d.offset.x + labelOffset.x,
            "y": d.offset.y + labelOffset.y
        });

        return lineFunction(lineData);
    }

    function updateLabelText(d3root, timestamp){
        var selectedSample;

        d3root.selectAll("g.measurement")
            .selectAll("g.label")
            .selectAll("text")
            .text(function (d) {
                selectedSample = getSelectedSample(d.data, timestamp);
                return d.data.label + " " + selectedSample.value + " " + d.data.units;
            });
    }

    function createSvgLabelGroups(d3root){
        var labelGroups;

        // create the lines
        createSvgLabelLines(d3root);

        labelGroups = d3root.selectAll("g.hasLabel")
            .append("g")
            .attr("class", "label");

        createSvgLabelTexts(d3root);

        // create the rectangle
        createSvgLabelRectangles(d3root);


        // move the text in front of the rectangles
        d3root.selectAll("g.hasLabel")
            .selectAll("g.label")
            .selectAll("text")
            .each(function (d) {
                d3.select(this).node().parentNode.appendChild(d3.select(this).node());
            });



        return labelGroups;
    }

    function createSvgLabelLines(d3root){
        var lines;

        lines = d3root.selectAll("g.measurement")
            .append("path")
            .attr({
                "vector-effect": "non-scaling-stroke",
                // "fill": "#d5f5d5",
                "stroke-dasharray": "5, 5",
                "fill": "none",
                "stroke": "grey",
                "stroke-width": 1,
                "d": "M0,0L0,0"
            });

        return lines;
    }

    function createSvgLabelTexts(d3root){
        var textElements;

        textElements = d3root.selectAll("g.hasLabel")
            .selectAll("g.label")
            .append("text")
            .text(function (d) {
                // use the timestamp to fetch the value from the samples
                return "";
            })
            .attr({
                "text-anchor": "middle",
                "x": 0,
                "y": 0,
                "fill": "grey"
            })
            .attr("font-size", function (d) {
                var className = d3.select(this.parentNode.parentNode).attr("class");
                var searchResult = className.search("measurement");
                return searchResult > -1? measurementLabelFontSize: groupLabelFontSize;
            });

        return textElements;
    }

    function createSvgLabelRectangles(d3root){
        var rectangles;

        rectangles = d3root.selectAll("g.hasLabel")
            .selectAll("g.label")
            .append("rect")
            .attr({
                "vector-effect": "non-scaling-stroke",
                "rx": 0.5,
                "ry": 0.5,
                // "fill": "#d5f5d5",
                "fill": "white"
            })
            .attr("stroke", "grey")
            .attr("stroke-width", 1);

        return rectangles;
    }

    /**
     * creates the d3 data array to draw/plot the group labels
     * @param groups
     * @param measurementsDataObjects
     * @returns {Array}
     */
    function createGroupLabelDataObjects(groups, measurementsDataObjects){

        var startAngle = 0;
        var endAngle = 0;
        var groupIndex = 0;
        var firstMeasurementOfGroup = true;
        var groupDataObjects = [];
        var measurementsDataObjectsArray = []; // holds the measurementsDataObjects of each group
        var groupData = {};

        for(var i = 0; i < measurementsDataObjects.length; i ++){

            // Only insert those that are not empty labels
            if(measurementsDataObjects[i].data.label != "empty")
                measurementsDataObjectsArray.push(measurementsDataObjects[i]);

            if(firstMeasurementOfGroup){
                startAngle = measurementsDataObjects[i].startAngle;
                firstMeasurementOfGroup = false;
            }
            else if(measurementsDataObjects[i].data.label === "empty"){
                endAngle = measurementsDataObjects[i].endAngle;
                firstMeasurementOfGroup = true;

                groupData.label = groups[groupIndex].label;
                groupData.measurements = measurementsDataObjectsArray;

                groupDataObjects.push({
                    "startAngle": startAngle,
                    "endAngle": endAngle,
                    "padAngle": 0,
                    "data": groupData
                });

                groupIndex++;
                groupData = {};
                measurementsDataObjectsArray = [];
            }
        }
        return groupDataObjects;
    }

    /**
     * Create an additional figure
     * @param d3root
     * @param timestamp
     * @returns {Figure}
     */
    function plotAt(d3root, timestamp){
        var polygon;
        var circles;

        polygon = createSvgPolygon(hFigure, initialPolygonData, "passive");

        circles = createMeasurementCircles(d3root, circleRadius, "passive");

        d3root.selectAll("circle.active")
            .each(function (d) {
                this.parentNode.appendChild(this);
            });

        updatePlottedFigure(d3root, timestamp, polygon, circles);

        var plottedFigure = new Figure(circles, timestamp, polygon);

        /**
         * Pass only the update as a publicly accessible method
         */
        plottedFigure.update = function(newTimestamp){
            updateFromInstance.apply(plottedFigure, [newTimestamp]);
        };

        return plottedFigure;
    }

    /**
     * Update an existing figure to a given timestamp
     * @param d3root
     * @param timestamp
     * @param polygon
     * @param circles
     */
    function updatePlottedFigure(d3root, timestamp, polygon, circles){

        plottedTimestamps.push(timestamp); // add the timestamp to the array of plotted timestamps for detecting label collision

        updatePolygon(d3root, timestamp, polygon); // polygon

        updateMeasurements(circles, timestamp); // circles

        moveLabelsWrapper(d3root, plottedTimestamps); // adjust overlapping labels

    }

    /**
     * Zoom
     */

    function zoomIn(scale1, scale2){
        return scale1 > threshold && scale1 > scale2 && !zoomedIn;
    }

    function zoomOut(scale1, scale2){
        return scale1 <= threshold && scale1 < scale2 && zoomedIn;
    }

    function toggleZoom(){
        zoomedIn = !zoomedIn;

        hFigure.selectAll("g.measurement").selectAll("g.label").attr("opacity", zoomedIn ? 1: 0);
        hFigure.selectAll("g.measurement").selectAll("path").attr("opacity", zoomedIn ? 1: 0);

        hFigure.selectAll("g.groupLabel").selectAll("g.label").attr("opacity", zoomedIn ? 0.5: 1);
    }


    function zoomed() {
        // uncomment to enable zoom in and out callbacks

        if(zoomIn(d3.event.scale, prevScale) || zoomOut(d3.event.scale, prevScale)) toggleZoom();

        svg.select("g.hFigure-wrapper")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

        prevScale = d3.event.scale;

    }

    function prepareZooming(){
        svg.selectAll("g.measurement").selectAll("g.label").attr("opacity", 0);
        svg.selectAll("g.measurement").selectAll("path").attr("opacity", 0);

        svg.selectAll("g.groupLabel").selectAll("g.label").attr("opacity", 1);
    }

    // we need to know the polygon
    // the circles
    // the existing plotted timestamp
    // the new timestamp to plot

    function updateFromInstance (newTimestamp) {

        var oldTimestamp = this.timestamp;
        var polygon = this.polygon;
        var i = plottedTimestamps.indexOf(oldTimestamp);
        var circles = this.circles;

        plottedTimestamps[i] = newTimestamp;

        updatePolygon(hFigure, newTimestamp, polygon);
        updateMeasurements(circles, newTimestamp);

        if(circles.attr("class") === "active")
            updateLabels(hFigure, newTimestamp);

        moveLabelsWrapper(hFigure, plottedTimestamps);

        this.timestamp = newTimestamp;
    }

    /**
     *
     * @param circles
     * @param timestamp
     * @param polygon
     * @constructor
     */
    function Figure (circles, timestamp, polygon){
        this.circles = circles;
        this.timestamp = timestamp;
        this.polygon = polygon;
    }


    /**
     * on mouse over we change the style of the measurement circles and label (text and frame)
     * @param group
     * @param mouseOver
     */
    function toggleMeasurementGroups(group, mouseOver){

        group.select("rect")
            .transition()
            .attr("fill", mouseOver ? "#FFFF66": "white")
            .attr("stroke", mouseOver ? "black": "grey");

        group.select("text")
            .transition()
            .attr("fill", mouseOver ? "black": "grey");

        group.selectAll("circle")
            .transition()
            .attr("r", mouseOver ? circleRadius * 1.85: circleRadius);

        group.select("path")
            .transition()
            .attr("stroke-width", mouseOver ? 2.75: 1);

    }

    /**
     * begin the main code
     */

    // Here we begin to build the hFigure instance
    // all the functions used are inside this scope.

    var options = options || {};

    // Other options
    var outerRadius = w * 0.4; // check a scale function from d3
    var innerRadius = w * 0.3;
    var defaultLabelRadius = w * 0.45;

    var groupLabelFontSize = 24;
    var measurementLabelFontSize = 16;

    var circleRadius = 8;

    var svg;
    var hFigure; // and SVG group

    var timestampToPlot = new Date().getTime();
    var plottedTimestamps = [];

    var arc;
    var pie;

    var measurementsObjects;
    var measurementsArray;
    var groupsObjects;

    var polygonData = [];
    var initialPolygonData = [];
    var activePolygon;
    var activeCircles;

    var animationsComplete = false;
    var callbacks = [];


    var prevScale = 1;
    var threshold = 1;
    var zoomedIn = false;

    var minScale = options.minScale || 0.5;
    var maxScale = options.maxScale || 2.0;

    svg = createSVG(className, w);
    hFigure = createHFigure(svg);

    arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // a pie chart for the measurements

    pie = d3.layout.pie()
        .value(function (d) {
            // all the measurements will have the same space of the donut
            return d.label === "empty" ? 1: 2;
        })
        .sort(null); // no ordering to preserve the order from the data source

    // pie.padAngle(padAngle);

    measurementsArray = extractMeasurements(groups);
    measurementsObjects = pie(measurementsArray); // add the start and end of the angle
    // console.log(measurementsDataObjects);

    createZones(hFigure, measurementsObjects, arc);

    groupsObjects = createGroupLabelDataObjects(groups, measurementsObjects);

    // measurementsDataObjects need to exclude the empty sections
    measurementsObjects = measurementsObjects.filter(function (d) {
        return d.data.label != "empty";
    });

    // create a polygon
    for(var i = 0; i < measurementsObjects.length; i ++){
        initialPolygonData.push([0, 0]);
    }

    polygonData = initialPolygonData;

    hFigure.append("g")
        .attr("class", "groupLabels");

    hFigure.selectAll("g.groupLabels")
        .selectAll("g.groupLabel")
        .data(groupsObjects)
        .enter()
        .append("g")
        .attr("class", "groupLabel hasLabel");


    // create the figure container
    hFigure.append("g")
        .attr("class", "figures");

    // create the active figure
    hFigure.selectAll("g.figures")
        .append("g")
        .attr("class", "figure activeFigure");

    hFigure.selectAll("g.activeFigure")
        .append("g")
        .attr("class", "polygons");

    activePolygon = createSvgPolygon(hFigure, polygonData, "active");

    var activeMeasurements = hFigure.selectAll("g.activeFigure")
        .append("g")
        .attr("class", "measurements"); // wrapper for all measurements

    var svgMeasurementGroups = createSvgMeasurementGroups(activeMeasurements, measurementsObjects); // create a svg group for each measurement

    //measurementsDataObjects.concat(zonesDataObjects)

    // label groups and required elements
    createSvgLabelGroups(hFigure);
    // create the circles in each of the SVG group with the class "measurement"
    activeCircles = createMeasurementCircles(activeMeasurements, circleRadius, "active");

    svgMeasurementGroups.on("mouseover", function(d){
        toggleMeasurementGroups(d3.select(this), true);
    }).on("mouseout", function(d){
        toggleMeasurementGroups(d3.select(this), false);
    });

    // here we can call the update functions

    updateLabels(hFigure, timestampToPlot);
    updatePlottedFigure(hFigure, timestampToPlot, activePolygon, activeCircles);


    // test the update action
    /*
    setTimeout(function () {
        updatePolygon(hFigure, 1); // testing the methods
        updateMeasurements(hFigure, 1); // testing the methods
        updateLabels(hFigure, 1);
    }, 3000);
    */

    // flip the y axis
    // var scale = "scale(1, -1)";
    // rotate
    // var rotate = "rotate(90)";
    // all the transformations
    // var transformations = [scale, rotate];
    // apply
    // arcs.attr("transform", transformations.join(" "));
    // pointsGroup.attr("transform", scale + " " + rotate);
    // polygon.attr("transform", scale + " " + rotate);
    // move the hFigure

    var maxWidth = 0;
    var maxHeight = 0;
    hFigure.selectAll("g.groupLabel")
        .each(function (d) {
            maxWidth  = Math.max(maxWidth,  Math.abs(d.offset.x) + d.box.width);
            maxHeight = Math.max(maxHeight, Math.abs(d.offset.y) + (d.box.height * 2));
        });

    maxWidth  *= minScale;
    maxHeight *= minScale;

    var zoom = d3.behavior.zoom()
        .scaleExtent([minScale, maxScale])
        .on("zoom", zoomed)
        .translate([maxWidth, maxHeight]).scale(minScale);

    svg.select("g.hFigure-wrapper")
        .attr("transform", "translate(" + maxWidth + ", " + maxHeight + ") scale(" + minScale + ")");

    // activate the zoom

    svg.call(zoom);

    // show and hide labels
    prepareZooming();

    /**
     * class instantiation happens only inside this whole component
     * @type {Figure}
     */
    var initialFigure = new Figure(activeCircles, timestampToPlot, activePolygon);
    
    // activeMeasurements
    
    var activeMeasurementsParent = d3.select("g.measurements").node();
    
    d3.selectAll("g.measurement").each(function(){
        activeMeasurementsParent.appendChild(this);
    });

    /**
     * Expose only the methods needed by the user
     * This is a facade paradigm
     */
    initialFigure.update = function(newTimestamp){
        updateFromInstance.apply(initialFigure, [newTimestamp]);
    };

    initialFigure.next = function(){
        return getNext.apply(initialFigure);
    };

    initialFigure.plotAt = function (timestamp) {
        return plotAt(hFigure, timestamp);

    };

    return initialFigure;

}

