/**
 * Created by andres on 4/23/15.
 */

/**
 *
 * @param groups
 * @param w
 * @param h
 * @param className
 * @constructor
 */
function HealthGraph(groups, w, className){

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

        svg = d3.select("body")
            .append("div")
            .attr("class", className)
            .append("svg")
            .attr("width", w)
            .attr("height", w);

        return svg;
    }

    function createHGraph(svg){
        var hGraph;

        hGraph = svg.append("g")
            .attr("class", "hGraph-wrapper")
            .append("g")
            .attr("class", "hGraph");

        return hGraph;
    }

    function getMeasurementsInEachGroup(dataset){
        var group;
        var total = [];
        var measurements;

        for(var i = 0; i < dataset.length; i ++){
            group = dataset[i];
            measurements = group.measurements;
            total.push(measurements.length);
        }

        return total;
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
                //"stroke": "#74c476",
                "stroke-width": .75,
                "d": arc
            });

        return zones;
    }

    function getAllMeasurementsFromDataset(dataset){
        var group;
        var measurements;
        var total = [];

        for(var i = 0; i < dataset.length; i ++){
            group = dataset[i];
            measurements = group.measurements;
            total = total.concat(measurements);
            total.push({
                label: "empty"
            });
        }

        return total;
    }

    // how to update the polygon
    function updatePolygon(d3root, timestamp){
        polygonData = [];

        d3root.selectAll("g.activeGraph")
            .selectAll("g.measurement")
            .each(function (d) {
                polygonData.push(getArc(d.data, timestamp).centroid(d));
            });


        d3root.selectAll("g.activeGraph")
            .selectAll("g.polygon")
            .selectAll("polygon")
            .data(function () {
                return [polygonData];
            })
            .transition()
            .attr("points", function(d) {
                // compute the coordinates
                return [d].join(" ");
            });
    }

    // how to update the circles
    function updateMeasurements(d3root, timestamp){
        d3root.selectAll("g.activeGraph")
            .selectAll("g.measurement")
            .selectAll("circle")
            .transition()
            .attr("cx", function (d) {
                return getArc(d.data, timestamp).centroid(d)[0];
            })
            .attr("cy", function (d) {
                return getArc(d.data, timestamp).centroid(d)[1];
            })
            .attr("fill", function (d) {
                return getColor(d.data, timestamp);
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

    // get the arc object to calculate the centroid for the labels
    // this one needs to check the largest radius to avoid overlaps with the circles
    function getLabelArc(d3root, d, defaultRadius, timestamp){
        var arc;
        var radius;
        var margin = 30;

        if("samples" in d.data){
            radius = getMaxRadiusForMeasurementLabel(d3root, timestamp, defaultRadius, d.data.label, margin);
        } else {
            radius = getMaxRadiusForGroupLabel(defaultRadius);
        }

        arc = d3.svg.arc()
            .innerRadius(radius)
            .outerRadius(radius);

        return arc;
    }

    function getMaxRadiusForMeasurementLabel(d3root, timestamp, defaultRadius, label, margin){
        var radius = defaultRadius; // the default to start comparing

        d3root.selectAll("g.measurements")
            .selectAll("g.measurement")
            .filter(function (d) {
                return d.data.label === label;
            })
            .each(function (d) {
                // console.log("checking radius for label " + d.data.label);
                radius = Math.max(radius, getRadius(d.data, timestamp) + margin);

            });

        return radius;
    }

    function getMaxRadiusForMeasurement(d3root, timestamp, label){
        var radius = 0; // the default to start comparing

        d3root.selectAll("g.measurements")
            .selectAll("g.measurement")
            .filter(function (d) {
                return d.data.label === label;
            })
            .each(function (d) {
                // console.log("checking radius for label " + d.data.label);
                radius = Math.max(radius, getRadius(d.data, timestamp));

            });

        return radius;
    }

    function getMaxRadiusForGroupLabel(defaultRadius){

        // TODO: determine the radius using the measurements that might overlap with this label

        return defaultRadius;
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
    var verticalLabelMargin = 2;
    function moveLabelVertically(i, angle, height, y){

        var delta = i === 0 ? -1 * verticalLabelMargin: 0,
            upper = angle >= 3/2 * Math.PI || angle <= Math.PI/2;

        var collision = upper ?
        y + height + verticalLabelMargin >= verticalLabelLimit :
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
    function getLabelCoordinates(d, i, d3root, defaultRadius, timestamp){
        var arc;
        var coordinates;
        var y;
        var angle = d.startAngle + (d.endAngle - d.startAngle)/2; // preserve the previous angle to complete the circle

        // get the max radius from all the measurements plotted that have the same label
        // we can already add this to the datum

        arc = getLabelArc(d3root, d, defaultRadius, timestamp);
        coordinates = arc.centroid(d);

        // move the labels horizontally outside the radius (x)
        coordinates[0] = coordinates[0] + moveLabelHorizontally(d, angle);

        y = coordinates[1] - d.box.height *.8;

        /*d3root.append("circle")
            .attr("cx", coordinates[0])
            .attr("cy", y)
            .attr({
                "r": 0.5,
                "fill": "red",
                "stroke": "none"
            });


        d3root.append("circle")
            .attr("cx", coordinates[0])
            // .attr("cy", coordinates[1] + d.box.height *.2)
            .attr("cy", y + d.box.height)
            .attr({
                "r": 0.5,
                "fill": "red",
                "stroke": "none"
            });*/

        // move the labels vertically to avoid overlapping (y)
        // console.log( d.data.label + " " + d.box.height );

        coordinates[1] = coordinates[1] + moveLabelVertically(i, angle, d.box.height, y);

        //return the [x, y] coordinates
        return coordinates;
    }

    // selects the sample closest to the timestamp provided but before that not after
    function getSampleIndex(timestamp, samples){

        // TODO: get the actual index of the sample closest to the given timestamp

        return timestamp;
    }

    function getColor(measurement, timestamp){
        var color = "white"; // by default
        var yellowMin = "yellow_min";
        var yellowMax = "yellow_max";
        var redMin = "red_min";
        var redMax = "red_max";
        var samples = measurement.samples;
        var hasAdditionalRanges = false;
        var sample;
        var index;


        index = getSampleIndex(timestamp, samples);
        sample = measurement.samples[index];

        // checking now for less than the recommended
        if (typeof measurement[yellowMin] != 'undefined'){
            hasAdditionalRanges = true;
            if(sample.value <= measurement[yellowMin]){
                color = "gold";
            }
        }

        if (typeof measurement[redMin] != 'undefined'){
            hasAdditionalRanges = true;
            if(sample.value <= measurement[redMin]){
                color = "tomato";
            }
        }
        // checking for more than the recommended
        if (typeof measurement[yellowMax] != 'undefined'){
            hasAdditionalRanges = true;
            if(sample.value >= measurement[yellowMax]){
                color = "gold";
            }
        }

        if (typeof measurement[redMax] != 'undefined'){
            hasAdditionalRanges = true;
            if(sample.value >= measurement[redMax]){
                color = "tomato";
            }
        }

        if (hasAdditionalRanges && color === "white"){
            color = "#73D651";
        }

        return color;
    }

    function createSvgMeasurementGroups(d3target, data){
        var svgGroups;

        svgGroups = d3target.selectAll("g.measurement")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "measurement");

        return svgGroups;

    }

    function createSvgPolygon(d3target, data){
        var polygonGroup;

        polygonGroup = d3target.append("g")
            .attr("class", "polygon")
            .selectAll("polygon")
            .data(function () {
                return [data];
            })
            .enter()
            .append("polygon")
            .attr("points", function(d) {
                // compute the coordinates
                return d.join(" ");
            }).attr({
                "stroke": "#5b5b5b",
                "stroke-width": 1,
                "fill": "none",
                // "fill-opacity": 0.15,
                "vector-effect": "non-scaling-stroke"
            });

        return polygonGroup;
    }

    function createMeasurementCircles(d3target, circleRadius){
        var circles;

        circles = d3target.append("circle")
            .attr({
                "stroke": "black",
                "stroke-width": "1",
                "fill": "white",
                "r": circleRadius,
                "cx": 0,
                "cy": 0
            });

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
        d3root.selectAll("g.label")
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
        return getAngle(d) <= Math.PI/2;
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

    function moveLabels(d3root, anglePosition, sortFunction, timestamp){

        verticalLabelLimit = 0;

        d3root.selectAll("g.label")
            .filter(anglePosition)
            .sort(sortFunction)
            .transition()
            .attr("transform", function (d, i) {
                var coordinates = getLabelCoordinates(d, i, d3root, defaultLabelRadius, timestamp);
                return "translate (" + coordinates.join(",") + ")";
            });


    }

    function moveAllLabels(d3root, timestamp){


        // upper right corner
        moveLabels(d3root, angleUpperRight, descending, timestamp);

        // upper left corner
        moveLabels(d3root, angleUpperLeft, ascending, timestamp);

        // lower right corner
        moveLabels(d3root, angleLowerRight, ascending, timestamp);

        // lower left corner
        moveLabels(d3root, angleLowerLeft, descending, timestamp);


    }

    // update the label text
    function updateLabels(d3root, timestamp) {

        updateLabelText(d3root, timestamp);

        d3root.selectAll("g.label")
            .each(insertBoxToLabel);

        resizeBox(d3root);

        // move them to the default label radius

        // with all the translate coordinates
        // fix overlapping issues
        moveAllLabels(d3root, timestamp);

        // now the lines
        updateLabelLine(d3root, timestamp);

    }

    function updateLabelLine(d3root, timestamp){

        var lineFunction = d3.svg.line()
            .x(function(d) { return d.pathX; })
            .y(function(d) { return d.pathY; })
            .interpolate("linear");

        // TODO: subtract the deltas in the label groups with the measurement groups

        d3root.selectAll("g.label")
            .selectAll("path")
            .transition()
            .attr("d", function(d){
                var lineData = [];

                lineData.push({
                    "pathX": 0,
                    "pathY": 0
                });

                lineData.push({
                    "pathX": 5,
                    "pathY": 5
                });

                return lineFunction(lineData);

            });
    }

    function updateLabelText(d3root, timestamp){
        var selectedSample;

        d3root.selectAll("g.label")
            .selectAll("text")
            .text(function (d) {

                if("samples" in d.data){

                    selectedSample = getSelectedSample(d.data, timestamp);

                    return d.data.label + " " + selectedSample.value + " " + d.data.units;
                }

                return d.data.label;
            })
            .attr("font-size", function (d) {
                if("samples" in d.data){
                    return measurementLabelFontSize;
                }
                return groupLabelFontSize;
            });
    }

    function createSvgLabelGroups(d3root, data){
        var labelGroups;

        labelGroups = d3root.selectAll("g.labels")
            .selectAll("g.label")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "label");

        // create the lines
        createSvgLines(d3root);

        createSvgLabelTexts(d3root);

        // create the rectangle
        createSvgLabelRectangles(d3root);


        // move the text in front of the rectangles
        d3root.selectAll("g.label")
            .selectAll("text")
            .each(function (d) {
                d3.select(this).node().parentNode.appendChild(d3.select(this).node());
            });



        return labelGroups;
    }

    function createSvgLines(d3root){
        var lines;

        lines = d3root.selectAll("g.label")
            .append("path")
            .attr({
                "vector-effect": "non-scaling-stroke",
                // "fill": "#d5f5d5",
                "stroke-dasharray": "5, 5",
                "fill": "none",
                "stroke": "grey",
                "stroke-width": 1
            });

        return lines;
    }

    function createSvgLabelTexts(d3root){
        var textElements;

        textElements = d3root.selectAll("g.label")
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
            });

        return textElements;
    }

    function createSvgLabelRectangles(d3root){
        var rectangles;

        rectangles = d3root.selectAll("g.label")
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

    function createGroupDataObjects(groups, measurementsDataObjects){
        var startAngle;
        var endAngle;
        var groupIndex = 0;
        var firstMeasurementOfGroup = true;
        var groupDataObjects = [];

        for(var i = 0; i < measurementsDataObjects.length; i ++){

            if(firstMeasurementOfGroup){
                startAngle = measurementsDataObjects[i].startAngle;
                firstMeasurementOfGroup = false;
            }


            if(measurementsDataObjects[i].data.label === "empty"){
                endAngle = measurementsDataObjects[i].endAngle;
                firstMeasurementOfGroup = true;

                groupDataObjects.push({
                    "startAngle": startAngle,
                    "endAngle": endAngle,
                    "padAngle": 0,
                    "data": groups[groupIndex]
                });

                groupIndex++;
            }
        }
        return groupDataObjects;
    }

    /**
     * begin the main code
     */

    // Here we begin to build the hGraph instance
    // all the functions used are inside this scope.

    // TODO: adjust depending on the number of healthMeasurements along with the zoom and font size

    // Other options
    var outerRadius = w * 0.4; // check a scale function from d3
    var innerRadius = w * 0.3;
    var defaultLabelRadius = w * 0.45;

    var groupLabelFontSize = 32;
    var measurementLabelFontSize = 16;

    var circleRadius = 5;

    var svg;
    var hGraph; // and SVG group

    var arc;
    var pie;

    var measurementsDataObjects;
    var measurementsDataset;

    var polygonData = [];

    var timestamp = 0;

    var groupDataObjects;
    var labelDataObjects;

    svg = createSVG(className, w);
    hGraph = createHGraph(svg);

    arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // a pie chart for the measurements

    pie = d3.layout.pie()
        .value(function (d) {
            // all the measurements will have the same space of the donut
            if(d.label === "empty")
                return 1;
            return 2;
        })
        .sort(null); // no ordering to preserve the order from the data source

    // pie.padAngle(padAngle);

    measurementsDataset = getAllMeasurementsFromDataset(groups);
    measurementsDataObjects = pie(measurementsDataset);
    // console.log(measurementsDataObjects);

    createZones(hGraph, measurementsDataObjects, arc);

    groupDataObjects = createGroupDataObjects(groups, measurementsDataObjects);

    // measurementsDataObjects need to exclude the empty sections
    for(var i = measurementsDataObjects.length - 1; i > -1; i--){

        if(measurementsDataObjects[i].data.label === "empty"){
            measurementsDataObjects.splice(i, 1);
        }
    }



    // create the graph container
    hGraph.append("g")
        .attr("class", "graphs");

    // create the active graph
    hGraph.selectAll("g.graphs")
        .append("g")
        .attr("class", "graph activeGraph");

    // create the measurements container
    // create each measurement with the data
    hGraph.selectAll("g.activeGraph")
        .append("g")
        .attr("class", "measurements");

    // create the measurement groups
    createSvgMeasurementGroups(hGraph.selectAll("g.measurements"), measurementsDataObjects)
        .each(function (d) {
            // allows the polygon animation from the center
            polygonData.push([0, 0]);
        })
        .on("mouseover", function() {
            console.log("mouse on");
        })
        .on("mouseout", function() {
            console.log("mouse out");
        });

    // create the circles in each of the SVG group with the class "measurement"

    createMeasurementCircles(
        hGraph.selectAll("g.activeGraph")
            .selectAll("g.measurement"), circleRadius);

    // create a polygon
    createSvgPolygon(hGraph.selectAll("g.activeGraph"), polygonData);

    // move the circles and their containing groups to the front
    // appending them to the parent makes them go to the bottom of the list
    // thus moving them to the front
    hGraph.selectAll("g.activeGraph")
        .selectAll("g.measurements")
        .each(function () {
            d3.select(this).node().parentNode.appendChild(d3.select(this).node());
        });

    // now the labels

    // create label container
    hGraph.append("g")
        .attr("class", "labels");


    //measurementsDataObjects.concat(zonesDataObjects)

    labelDataObjects = measurementsDataObjects.concat(groupDataObjects);

    createSvgLabelGroups(hGraph, labelDataObjects)
        .on("mouseover", function(d) {
            d3.select(this).select('text')
                .attr("fill", "black");
            d3.select(this).select('rect')
                .attr("stroke", "black")
                .attr("fill", "ivory");

        })
        .on("mouseout", function(d) {
            d3.select(this).select('text')
                .attr("fill", "grey");
            d3.select(this).select('rect')
                .attr("stroke", "grey")
                .attr("fill", "none");
        });

    // move the graphs container to the front
    hGraph.selectAll("g.graphs")
        .each(function () {
            d3.select(this).node().parentNode.appendChild(d3.select(this).node());
        });

    // here we can call the update functions
    updatePolygon(hGraph, 0); // testing the methods
    updateMeasurements(hGraph, 0); // testing the methods
    updateLabels(hGraph, 0); // testing the labels

    // test the update action


    setTimeout(function () {
        updatePolygon(hGraph, 1); // testing the methods
        updateMeasurements(hGraph, 1); // testing the methods
        updateLabels(hGraph, 1); // testing the labels
    }, 3000);

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
    // move the hGraph

    var translate = "translate(" + (w * 1) + ", " + (w * 0.55) + ")";
    hGraph.attr("transform", translate);

}


/**
 *
 * @param measurements
 * @param startAngle
 * @param endAngle
 * @param innerRadius
 * @param outerRadius
 * @param measurementCircleRadius
 * @param measurementGroupName
 * @returns {Array}
 */
HealthGraph.prototype.createHealthMeasurementsFromDataGroup = function(
    measurements,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    measurementCircleRadius,
    measurementGroupName) {

    var angleIncrement;
    var angleForHealthMeasurement, measurementFromData;
    var healthMeasurements = [];
    var healthMeasurement;

    angleIncrement = (endAngle - startAngle) / measurements.length;


    for(var j = 0; j < measurements.length; j ++){

        measurementFromData = measurements[j];

        angleForHealthMeasurement = startAngle + (j * angleIncrement) + (angleIncrement / 2);

        // move the result so it goes clockwise
        angleForHealthMeasurement = Math.PI / 2 - angleForHealthMeasurement;

        healthMeasurement = new HealthMeasurement(
            measurementFromData,
            angleForHealthMeasurement,
            innerRadius,
            outerRadius,
            measurementCircleRadius,
            measurementGroupName);

        healthMeasurements.push(healthMeasurement);
    }

    // return the points in the whole section as an array
    return healthMeasurements;
};

/**
 *
 * @param d
 */
HealthGraph.prototype.labelFrameBox = function(d){

    var box;
    d.frameBox = {};
    d.offset = {};

    box = this.getBBox();

    // add the extra space to the frameBox
    d.frameBox.x = box.x - 10;
    d.frameBox.y = box.y - 2;
    d.frameBox.width = box.width + 20;
    d.frameBox.height = box.height + 4;

    d.offset.x = (Math.cos(d.angle) > 0)? d.frameBox.width/2: -d.frameBox.width/2;
    d.offset.y = 0;

};


/**
 *
 * @param labelData
 * @returns {D3._Selection<U>}
 */
HealthGraph.prototype.plotLabels = function(labelData){

    var labelGroups;
    var textElements;
    var rectElements;
    var labelOverlappingFixer;
    var lines;
    var groupLines;
    var measurementLines;
    var self = this;

    labelGroups = this.labelGroupContainer.selectAll("g")
        .data(labelData)
        .enter()
        .append("g");


    textElements = labelGroups.append("text")
        .text(function(d) {
            return d.text;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d){
            return Math.cos(d.angle) * d.r1;
        })
        .attr("y", function(d){
            return (Math.sin(d.angle) * d.r1 * -1);
        })
        .attr("font-size", function(d){
            return d.fontSize;
        });

    textElements.each(self.labelFrameBox);

    // add the frame around
    rectElements = labelGroups.append("rect")
        .attr("x", function(d){
            return d.frameBox.x;
        })
        .attr("y", function (d) {
            return d.frameBox.y;
        })
        .attr("height", function (d) {
            return d.frameBox.height;
        })
        .attr("width", function (d) {
            return d.frameBox.width;
        })
        .attr({
            "vector-effect": "non-scaling-stroke",
            "rx": 0.5,
            "ry": 0.5,
            // "fill": "#d5f5d5",
            "fill": "white"
        })
        .attr("stroke", function(d){
            return d.lineColor;
        })
        .attr("stroke-width", 1);

    // fix the overlapping labels
    labelOverlappingFixer = new HealthGraphLabelFix(3, 0);
    labelOverlappingFixer.adjustOverlappingLabels(labelGroups);

    // move the labels
    labelGroups.attr("transform", function(d){
        return "translate(" + d.offset.x + ", " + d.offset.y + ")";
    });

    // append a line to each label group
    lines = labelGroups.append("line")
        .attr({
            "vector-effect": "non-scaling-stroke",
            "stroke-width": 1,
            "stroke-dasharray": "10, 5"
        })
        .attr("stroke", function(d){
            return d.lineColor;
        })
        .attr("x1", function (d) {
            d.x1 = Math.cos(d.angle) > 0 ? d.frameBox.x: d.frameBox.x + d.frameBox.width;
            return d.x1;
        })
        .attr("y1", function (d) {

            d.y1 = d.frameBox.y + d.frameBox.height/2;

            if(d.angle > Math.PI / 2 - 1/3 * Math.PI || d.angle < Math.PI / 2 - Math.PI - 2/3 * Math.PI)
                d.y1 = d.frameBox.y + d.frameBox.height;

            if(d.angle < Math.PI / 2 - 2/3 * Math.PI && d.angle > Math.PI / 2 - Math.PI - 1/3 * Math.PI)
                d.y1 = d.frameBox.y;

            return d.y1;
        })
        .attr("x2", function (d) {
            return d.x1;
        })
        .attr("y2", function (d) {
            return d.y1;
        });

    groupLines = lines.filter(function (d) {
        return d.className == "groupLabel";
    });

    groupLines
        .attr("x2", function (d) {
            return Math.cos(d.angle) * (d.r0 + d.r) - d.offset.x;
        })
        .attr("y2", function (d) {
            return (Math.sin(d.angle) * (d.r0 + d.r) * - 1) - d.offset.y;
        })
        .attr("stroke-width", 2)
        .attr("opacity", 0.3);

    measurementLines = lines.filter(function (d) {
        return d.className == "measurementLabel";
    });

    measurementLines.transition()
        .attr("x2", function (d) {
            return Math.cos(d.angle) * (d.r0 + d.r) - d.offset.x;
        })
        .attr("y2", function (d) {
            return (Math.sin(d.angle) * (d.r0 + d.r) * - 1) - d.offset.y;
        });


    // move to lines to the front
    lines.each(function(){
        this.parentNode.appendChild(d3.select(this).node());
    });

    // then move to frames to the front
    rectElements.each(function(){
        this.parentNode.appendChild(d3.select(this).node());
    });

    // finally move the text to the front
    textElements.each(function(){
        this.parentNode.appendChild(d3.select(this).node());
    });

    return labelGroups;
};


HealthGraph.prototype.moveLabels = function () {
    var healthMeasurements;
    var d3MeasurementLabelGroups;
    var healthMeasurement;
    var selectedSample;
    var self = this;
    var labelOverlappingFixer;
    var labelGroups;

    healthMeasurements = this.healthMeasurements;
    labelGroups = this.labelGroupContainer.selectAll("g");
    d3MeasurementLabelGroups = this.labelGroupContainer.selectAll("g.measurementLabel");

    function getHealthMeasurementByLabel(label){
        for(var i = 0; i < healthMeasurements.length; i ++){
            if(healthMeasurements[i].label === label)
                return healthMeasurements[i];
        }
        return null;
    }


    d3MeasurementLabelGroups.selectAll("text")
        .text(function (d) {

            healthMeasurement = getHealthMeasurementByLabel(d.label);
            selectedSample = healthMeasurement.samples[healthMeasurement.sample];

            d.r1 = Math.max(healthMeasurement.radius + 20, self.labelRadius);

            return healthMeasurement.label + ": " + selectedSample.value + " " + healthMeasurement.units;

        })
        .attr("x", function(d){
            return Math.cos(d.angle) * d.r1;
        })
        .attr("y", function(d){
            return (Math.sin(d.angle) * d.r1 * -1);
        })
        .each(self.labelFrameBox);

    d3MeasurementLabelGroups.selectAll("rect")
        .attr("x", function(d){
            return d.frameBox.x;
        })
        .attr("y", function (d) {
            return d.frameBox.y;
        })
        .attr("height", function (d) {
            return d.frameBox.height;
        })
        .attr("width", function (d) {
            return d.frameBox.width;
        });


    //


    // fix the overlapping labels
    labelOverlappingFixer = new HealthGraphLabelFix(3, 0);
    labelOverlappingFixer.adjustOverlappingLabels(labelGroups);

    // move the labels
    labelGroups.attr("transform", function(d){
        return "translate(" + d.offset.x + ", " + d.offset.y + ")";
    });
    /*
    // append a line to each label group
    labelGroups.selectAll("line")
        .attr("x1", function (d) {
            d.x1 = Math.cos(d.angle) > 0 ? d.frameBox.x: d.frameBox.x + d.frameBox.width;
            return d.x1;
        })
        .attr("y1", function (d) {

            d.y1 = d.frameBox.y + d.frameBox.height/2;

            if(d.angle > Math.PI / 2 - 1/3 * Math.PI || d.angle < Math.PI / 2 - Math.PI - 2/3 * Math.PI)
                d.y1 = d.frameBox.y + d.frameBox.height;

            if(d.angle < Math.PI / 2 - 2/3 * Math.PI && d.angle > Math.PI / 2 - Math.PI - 1/3 * Math.PI)
                d.y1 = d.frameBox.y;

            return d.y1;
        })
        .attr("x2", function (d) {
            return d.x1;
        })
        .attr("y2", function (d) {
            return d.y1;
        });

    */

};

/**
 *
 * @param margin
 * @param border
 * @constructor
 */
function HealthGraphLabelFix(margin, border){
    this.margin = margin;
    this.border = border;
}

/**
 *
 * @param i
 * @param angle
 * @param y
 * @param height
 * @param yOffset
 * @returns {number|*}
 */
HealthGraphLabelFix.prototype.fixOverlappingLabels = function(i, angle, y, height, yOffset){
    var delta = i === 0 ? this.margin: 0,
        upper = Math.sin(angle) >= 0;

    var collision = upper ?
        y + height + this.margin >= this.border :
        y <= this.border;

    if(collision && i > 0)
        delta = upper ?
            this.border - y - height - this.margin : // negative to move it up
            this.border - y; // positive to move it down

    yOffset += delta;

    this.border = upper ?
        y + delta :
        y + height + this.margin + delta; // add the height and the margin plus possible delta

    return yOffset;
};

/**
 *
 * @param labels {D3._Selection}
 */
HealthGraphLabelFix.prototype.adjustOverlappingLabels = function(labels){

    var angle;
    var groupRoot;
    var quadrants = [];
    var self = this;

    // fetch all the labels
    groupRoot = d3.select(".labels");


    labels.attr("class", function(d){
        // since we shift the angles as a clock 12 o'clock we begin from there it is clockwise
        // so 1st quadrant begins from 12 o'clock then quadrant 4rd, 3rd and we end in the 2nd.
        angle = Math.PI / 2 - d.angle;
        return (angle >= 0 && angle <= Math.PI/2) ? "quadrantI" :
            (angle > Math.PI/2 && angle <= Math.PI) ? "quadrantIV" :
            (angle > Math.PI && angle <= 3/2*Math.PI) ? "quadrantIII" : "quadrantII";
    });

    // ascending
    quadrants.push(groupRoot.selectAll("g.quadrantI").sort(function (a, b) {
        return a.angle - b.angle;
    }));
    quadrants.push(groupRoot.selectAll("g.quadrantIII").sort(function (a, b) {
        return a.angle - b.angle;
    }));

    // descending
    quadrants.push(groupRoot.selectAll("g.quadrantII").sort(function (a, b) {
        return b.angle - a.angle;
    }));
    quadrants.push(groupRoot.selectAll("g.quadrantIV").sort(function (a, b) {
        return b.angle - a.angle;
    }));

    for(var i = 0; i < quadrants.length; i ++){
        quadrants[i].each(function (d, i) {
            d.offset.y = self.fixOverlappingLabels(i, d.angle, d.frameBox.y, d.frameBox.height, d.offset.y);
        });
    }

    // restore the class of the selection
    labels.attr("class", function(d){ return d.className; }); // reset the style
};

/**
 * Update the labels by changing the data value and then removing them from the plot
 * in order to plot them again
 */
HealthGraph.prototype.updateLabelPosition = function () {

    var measurements = this.healthMeasurements;

    function getLabelDatum(label){
        var datum;
        for(var i = 0; i < labelData.length; i++){
            datum = labelData[i];
            if(datum.label === label){
                return datum;
            }
        }
        return null;
    }

    var labelRadius = this.labelRadius;
    // save opacity properties for labels
    var measurementLabelsOpacity = this.labelGroupContainer.selectAll("g.measurementLabel").attr("opacity");
    var groupLabelsOpacity = this.labelGroupContainer.selectAll("g.groupLabel").attr("opacity");

    this.labelGroupContainer.selectAll("g").remove();
    var labelData = this.labelData;

    var measurement, datum;
    var circles;
    var maxRadiusForGroupLabels = 0;

    for(var i = 0; i < measurements.length; i ++){
        measurement = measurements[i];
        datum = getLabelDatum(measurement.label);

        datum.text = measurement.label + ": " + measurement.samples[measurement.sample].value + " " + measurement.units;

        // get all the radii from the circles associated to this measurement
        /*
        circles = this.getCircleMeasurement(measurement.label);

        circles.each(function (d) {

            // console.log(d.radius);

            datum.r1 = Math.max(d.radius + 30, labelRadius);

            maxRadiusForGroupLabels = Math.max(datum.r1, maxRadiusForGroupLabels);

        });
        */

        datum.r1 = Math.max(measurement.radius + 20, labelRadius); // TODO: extend this to the label creation
        datum.r0 = measurement.radius;
    }

    // adjust group labels as well
    this.labelGroupContainer
        .selectAll("g.groupLabel")
        .each(function (d) {

            // TODO: Find why the hell I am not getting the max radius

            d.r1 = maxRadiusForGroupLabels + 20;

        });

    var self = this;
    this.mouseHighlight(self.plotLabels(labelData));
    // set the opacity to the previous value
    this.labelGroupContainer.selectAll("g.measurementLabel").attr("opacity", measurementLabelsOpacity);
    this.labelGroupContainer.selectAll("g.groupLabel").attr("opacity", groupLabelsOpacity);

};

/**
 * Select a sample to plot
 * @param index
 */
HealthGraph.prototype.plotSamplesAt = function(index){
    var graphContainerDOM;
    var graph;

    graph = this.graphs.select("g.graph");

    this.selectSample(index);
    this.updatePolygonAndCircles(graph);
    // this.updateLabelPosition();

    this.moveLabels();

    graphContainerDOM = this.graphs.node();
    graphContainerDOM.parentNode.appendChild(graphContainerDOM);
};

/**
 * Plot an additional sample in the background
 * @param index
 * @returns {D3._Selection}
 */
HealthGraph.prototype.interpolateSamplesAt = function(index){
    // var originalSample;
    var hGraphMeasurements;
    var graphs;
    var d3Selection;
    var recentlyAddedGraph;
    var hCircles;

    // originalSample = this.healthMeasurements[0].sample;
    hGraphMeasurements = this.selectSample(index);

    graphs = this.graphs;
    d3Selection = graphs.selectAll("g.graph");

    recentlyAddedGraph = this.renderPolygonAndCircles(hGraphMeasurements);

    graphs.node().appendChild(recentlyAddedGraph.node());
    // move the previously existing graphs to the front
    d3Selection.each(function (d) {
        this.parentNode.appendChild(d3.select(this).node());
    });

    hCircles = recentlyAddedGraph.selectAll("circle");

    this.mouseHighlight(hCircles);

    this.updateLabelPosition();

    // restore the original sample
    // this.selectSample(originalSample);

    return recentlyAddedGraph;
};



/**
 * Sets all the healthMeasurements to the selected index or the last one if not found.
 * @param index
 * @returns {Array}
 */
HealthGraph.prototype.selectSample = function (index) {
    var hGraphMeasurement;
    var samples;
    var hGraphMeasurements = [];

    for(var i = 0; i < this.healthMeasurements.length; i ++){
        hGraphMeasurement = this.healthMeasurements[i];
        samples = hGraphMeasurement.samples;
        hGraphMeasurement.sample = index < samples.length? index: samples.length - 1;
        hGraphMeasurement.calculatePosition();
        hGraphMeasurements.push(hGraphMeasurement);
    }

    return hGraphMeasurements;
};


/**
 * Builds a distance string for svg elements.
 * @param measurements [HealthMeasurement]
 * @returns {*[]}
 */
HealthGraph.prototype.toDistanceString = function(measurements){
    var arr = [];
    for(var i = 0; i < measurements.length; i ++){
        arr.push([measurements[i].x, measurements[i].y]);
    }
    return [arr];
};

/**
 *
 * @param label {string}
 * @returns {D3._UpdateSelection}
 */
HealthGraph.prototype.getLabelGroup = function(label){
    return this.hGraphWrapper
        .select("g.hGraph")
        .select("g.labels")
        .selectAll("g.measurementLabel")
        .filter(function (d) {
            return d.label == label;
        });
};

/**
 *
 * @param label
 * @returns {D3._UpdateSelection}
 */
HealthGraph.prototype.getCircleMeasurement = function(label){
    return this.graphs
        .selectAll("g.hGraphMeasurements circle")
        .filter(function (d) {
            if(d) return d.label == label;
            return false;
        });
};


/**
 * Render the polygon and the circles representing the healthMeasurements.
 * @param measurementDataModels
 * @returns {D3._Selection<T>|*}
 */
HealthGraph.prototype.renderPolygonAndCircles = function(measurementDataModels){
    var graph;
    var distanceString;


    graph = this.svg.append("g")
        .attr("class", "graph");

    // add the polygon in a group
    distanceString = this.toDistanceString(measurementDataModels);

    // create group and add polygon
    graph.append("g")
        .attr("class", "polygon")
        .selectAll("polygon")
        .data(function () {
            return [distanceString];
        })
        .enter()
        .append("polygon")
        .attr("points", function(d) {
            // compute the coordinates
            return d.join(" ");
        }).attr({
            "stroke": "#5b5b5b",
            "stroke-width": 1,
            "fill": "none",
            // "fill-opacity": 0.15,
            "vector-effect": "non-scaling-stroke"
        });

    // add all the circles representing the healthMeasurements in a group
    graph.append("g")
        .attr("class", "hGraphMeasurements")
        .selectAll("circle")
        .data(measurementDataModels)
        .enter()
        .append("circle")
        .attr("r", function(d){
            return d.r;
        })
        .attr("cx", function(d){
            return d.x;
        })
        .attr("cy", function(d){
            return d.y;
        })
        .attr("fill", function(d){
            return d.color;
        })
        .attr({
            "stroke": "#5b5b5b",
            "stroke-width": 1,
            "vector-effect": "non-scaling-stroke"
        });

    // return the graph group containing the circles and the polygon
    return graph;
};
/**
 *
 * @param graph
 * @returns {*}
 */
HealthGraph.prototype.updatePolygonAndCircles = function(graph){

    var distanceString;
    var measurements;


    distanceString = this.toDistanceString(this.healthMeasurements);
    measurements = this.healthMeasurements;

    graph.selectAll("polygon")
        .data(function () {
            return [distanceString];
        })
        .transition()
        .attr("points", function(d) {
            // compute the coordinates
            return d.join(" ");
        });


    graph.selectAll("circle")
        .data(measurements)
        .transition()
        .attr("r", function(d){
            return d.r;
        })
        .attr("cx", function(d){
            return d.x;
        })
        .attr("cy", function(d){
            return d.y;
        })
        .attr("fill", function(d){
            return d.color;
        })
        .attr({
            "stroke": "#5b5b5b",
            "stroke-width": 1,
            "vector-effect": "non-scaling-stroke"
        });

    return graph;
};

/**
 *
 * @param {D3._Selection<U>} d3Selection
 */
HealthGraph.prototype.mouseHighlight = function (d3Selection) {
    var self = this;
    d3Selection.on("mouseover", function(d) {



        // d3.select(this).attr("stroke-width", 4); // redundant since now we are selecting all circles
        var g = self.getLabelGroup(d.label);
        g.select("line").attr("stroke-width", 3);
        g.select("rect").attr("stroke-width", 3);

        // console.log(d3.select(this).selectAll("text"));

        // g.select("text").attr("font-size", 8.5);

        d3.select(this).selectAll("text")

        var c = self.getCircleMeasurement(d.label);
        c.attr("stroke-width", 3);
        c.attr("r", 6);

    }).on("mouseout", function(d) {

        // d3.select(this).attr("stroke-width", 1);
        var g = self.getLabelGroup(d.label);
        g.select("line").attr("stroke-width", 1);
        g.select("rect").attr("stroke-width", 1);
        g.select("rect").attr("r", 4);
        // g.select("text").attr("font-size", 8);


        var c = self.getCircleMeasurement(d.label);
        c.attr("stroke-width", 1);
        c.attr("r", 4);

    });
};