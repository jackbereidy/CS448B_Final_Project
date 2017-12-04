
    let plotWidth = 500;
    let plotHeight = 500;
    let plotMargin = 100;
    let outerWidth = plotWidth + 2 * plotMargin;
    let outerHeight = plotHeight + 2 * plotMargin;

    let chartMinX = 0;
    let chartMaxX = 10;
    let chartMinY = 0;
    let chartMaxY = 10;

    let wholePlot = d3.select('#plot-container').append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .attr('id', 'whole-chart');

    let plot = wholePlot.append('g')
        .attr('id', 'plot')
        .attr('transform', `translate(${plotMargin},${plotMargin})`);

    let points = plot.append('g')
        .attr('id', 'points');

    let xScale = d3.scaleLinear()
        .domain([chartMinX, chartMaxX])
        .range([0, plotWidth]);
    let yScale = d3.scaleLinear()
        .domain([chartMinY, chartMaxY])
        .range([plotHeight, 0]);

    let xAxis = plot.append('g')
        .attr('transform', `translate(0,${plotHeight})`)
        .attr('id', 'x-axis')
        .attr('class', 'axis')
        .call(d3.axisBottom(xScale));
    let yAxis = plot.append('g')
        .attr('id', 'y-axis')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));

    let xQuartiles = plot.append('g')
        .attr('id', 'x-quartiles');
    let yQuartiles = plot.append('g')
        .attr('id', 'y-quartiles');

    let boxAndWhiskerElementsX = xQuartiles.append('g')
        .attr('transform', `translate(0, 40)`)
        .attr('class', 'boxAndWhiskerElements');
    let boxAndWhiskerElementsY = yQuartiles.append('g')
        .attr('transform', `translate(-40,0)`)
        .attr('class', 'boxAndWhiskerElements');

    let lowExtremeX = createQuartilePlotElement(boxAndWhiskerElementsX, true, true, false, false, "");
    let highExtremeX = createQuartilePlotElement(boxAndWhiskerElementsX, true, true, false, false, "");
    let lowerQuartileX = createQuartilePlotElement(boxAndWhiskerElementsX, true, false, false, true, "x-box-1");
    let upperQuartileX = createQuartilePlotElement(boxAndWhiskerElementsX, true, false, false, false, "");
    let medianX = createQuartilePlotElement(boxAndWhiskerElementsX, true, false, true, true, "x-box-2");

    let lowExtremeY = createQuartilePlotElement(boxAndWhiskerElementsY, false, true, false, false, "");
    let highExtremeY = createQuartilePlotElement(boxAndWhiskerElementsY, false, true, false, false, "");
    let lowerQuartileY = createQuartilePlotElement(boxAndWhiskerElementsY, false, false, false, false, "");
    let upperQuartileY = createQuartilePlotElement(boxAndWhiskerElementsY, false, false, false, true, "y-box-2");
    let medianY = createQuartilePlotElement(boxAndWhiskerElementsY, false, false, true, true, "y-box-1");

    let minimalElementsX = xQuartiles.append('g')
        .attr('class', 'minimalElements');
    minimalElementsX.append('line')
        .attr("class", "quartile-minimal line-0");
    minimalElementsX.append('line')
        .attr("class", "quartile-minimal line-1");
    minimalElementsX.append('line')
        .attr("class", "quartile-minimal line-2");
    minimalElementsX.append('line')
        .attr("class", "quartile-minimal line-3");

    let minimalElementsY = yQuartiles.append('g')
        .attr('class', 'minimalElements');
    minimalElementsY.append('line')
        .attr("class", "quartile-minimal line-0");
    minimalElementsY.append('line')
        .attr("class", "quartile-minimal line-1");
    minimalElementsY.append('line')
        .attr("class", "quartile-minimal line-2");
    minimalElementsY.append('line')
        .attr("class", "quartile-minimal line-3");

    let boxAndWhiskerLineX = lowExtremeX.append('line')
        .attr('id', 'box-and-whisker-line-x')
        .attr('class', 'quartile-line')
        .attr('y1', '0')
        .attr('y2', '0');

    let boxAndWhiskerLineY = lowExtremeY.append('line')
        .attr('id', 'box-and-whisker-line-y')
        .attr('class', 'quartile-line')
        .attr('x1', '0')
        .attr('x2', '0');

    let xBox1 = d3.select('#x-box-1');
    let xBox2 = d3.select('#x-box-2');
    let yBox1 = d3.select('#y-box-1');
    let yBox2 = d3.select('#y-box-2');



    let currentQuartileMode = 0;

    let pointData;

    let trendLineActive;
    let chartLinesActive;
    let quartileActive;

    function createMinimalQuartilePlotElement(group, isOuter) {
        let minimalGroup = quartile.append('g')
            .attr('class', 'minimalElement');
        let minimalLine = minimalGroup.append('line')
            .attr('class', 'minimal-line')
            .attr('x1', 0)
            .attr('x2', 1)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', '#100');
    }

    function createQuartilePlotElement(group, isHorizontal, isExtreme, isMedian, hasBox, boxAndWhiskerString) {
        let boxAndWhisker = group.append('g')
            .attr('transform', `translate(0,${plotHeight})`)
            .attr('class', 'boxAndWhiskerElement');
        let line = boxAndWhisker.append('line')
            .attr('class', 'quartile-line')
            .attr('x1', -6.25)
            .attr('x2', 6.25)
            .attr('y1', 0)
            .attr('y2', 0);
        if (hasBox) {
            let box = boxAndWhisker.append('rect')
                .attr('x', 0)
                .attr('y', -12.5)
                .attr('width', 10)
                .attr('height', 25)
                .attr('class', 'quartile-box')
                .attr('id', boxAndWhiskerString);
            if (!isHorizontal) box.attr('transform', `rotate(90)`);
        }
        if (isHorizontal) line.attr('transform', `rotate(90)`);
        if (isMedian) line.attr('class', 'quartile-line-median');

        if (!isExtreme) {
            line.attr('x1', -12.5)
                .attr('x2', 12.5);
        }
        return boxAndWhisker;
    }

    d3.csv('animals.csv', parseInputRow, loadData);

    function parseInputRow(d) {
        return {
            id: +d.id,
            animal: d.animal,
            x: +d.weight,
            y: +d.height,
            name: d.name
        };
    }

    function loadData(error, data) {
        if (error) throw error;
        pointData = data;
        drawUpdatedScatterPlot(pointData);
        drawSecondaryPlotElements(pointData);
        setUpInputBar();
    }

    function drawUpdatedScatterPlot(data) {

        let circles = points.selectAll('circle.point');

        let updatedCircles = circles.data(data, d => d.id);

        let enterSelection = updatedCircles.enter();
        let newCircles = enterSelection.append('g')
            .attr('id', function (d) { return 'point-group-' + d.id; })
            .attr('class', 'point-group');
        newCircles.append('circle')
            .attr('class', 'point')
            .attr('r', 5)
            .attr('cx', function (d) { return xScale(d.x); })
            .attr('cy', function (d) { return yScale(d.y); })
            .call(d3.drag()
                .subject(function () {
                    var t = d3.select(this);
                    return { x: t.attr('cx'), y: t.attr('cy') };
                })
                .on('start', onPointDrag)
                .on('drag', onPointDrag)
                .on('end', function (d) { updatePointInfoVisibility(d, false); }))
            .on('mouseover', function (d) { updatePointInfoVisibility(d, true); })
            .on('mouseout', function (d) { updatePointInfoVisibility(d, false); });

        let text = newCircles.append('text')
            .attr('class', 'x-text')
            .attr('class', 'point-value-text')
            .attr('x', function (d) { return xScale(d.x); })
            .attr('y', function (d) { return yScale(d.y) - 15; })
            .text(function (d) { return getPointValueText(d) });

        let textRect = newCircles.append('rect')
            .attr('class', 'text-rect')
            .attr('x', function (d) { return xScale(d.x) - 17.5; })
            .attr('y', function (d) { return yScale(d.y) - 40; })
            .attr('width', 35)
            .attr('height', 25)
            .moveToBack();

        text.attr('visibility', 'hidden');
        textRect.attr('visibility', 'hidden');

        let unselectedCircles = updatedCircles.exit();

        updatedCircles.exit().remove();

        xAxis.moveToBack();
        yAxis.moveToBack();
    }

    function drawSecondaryPlotElements(pointData) {
        let sortedDataX = pointData.slice(0).sort(function (a, b) {
            return d3.ascending(a.x, b.x);
        });
        let sortedDataY = pointData.slice(0).sort(function (a, b) {
            return d3.ascending(a.y, b.y);
        });
        drawUpdatedQuartiles(pointData, sortedDataX, sortedDataY);
        drawUpdatedTrendLine(pointData, sortedDataX, sortedDataY);
        drawUpdatedChartLines(pointData, sortedDataX, sortedDataY);
    }
    function updatePointInfoVisibility(d, isVisible) {
        let pointGroup = plot.select('#point-group-' + d.id);
        let text = pointGroup.select('.point-value-text')
            .text(getPointValueText(d))

        let dim = text.node().getBBox();
        text.attr('x', function (d) { return xScale(d.x) - (dim.width) / 2; })
            .attr('y', function (d) { return yScale(d.y) - (dim.height + 20 + 10 - 5) / 2; });
        let textRect = pointGroup.select('.text-rect')
            .attr('width', dim.width + 20)
            .attr('height', dim.height + 20)
            .attr('x', function (d) { return xScale(d.x) - (dim.width + 20) / 2; })
            .attr('y', function (d) { return yScale(d.y) - (dim.height + 20 + 10); })
        if (isVisible) {
            pointGroup.select('.point-value-text').attr('visibility', 'visible');
            pointGroup.select('.text-rect').attr('visibility', 'visible');
        } else {
            pointGroup.select('.point-value-text').attr('visibility', 'hidden');
            pointGroup.select('.text-rect').attr('visibility', 'hidden');
        }

    }
    function onPointDrag(d) {
        let pointGroup = plot.select('#point-group-' + d.id);
        pointGroup.moveToFront();
        let dragPoint = pointGroup.select('.point');
        dragPoint.attr('cy',
            function (d) {
                if (yScale.invert(d3.event.y) < chartMinY) {
                    d.y = chartMinY;
                    return yScale(chartMinY);
                } else if (yScale.invert(d3.event.y) > chartMaxY) {
                    d.y = chartMaxY;
                    return yScale(chartMaxY);
                } else {
                    d.y = yScale.invert(d3.event.y);
                    return d3.event.y;
                }
            })
            .attr('cx', function (d) {
                if (xScale.invert(d3.event.x) < chartMinX) {
                    d.x = chartMinX;
                    return xScale(chartMinX);
                } else if (xScale.invert(d3.event.x) > chartMaxX) {
                    d.x = chartMaxX;
                    return xScale(chartMaxX);
                } else {
                    d.x = xScale.invert(d3.event.x);
                    return d3.event.x;
                }
            })
        updatePointInfoVisibility(d, true);

        drawSecondaryPlotElements(pointData);
    }
    function getPointValueText(d) {
        let string = d.x.toFixed(2) + ", " + d.y.toFixed(2);
        return string;
    }
    var line = d3.line()
        .x(function (d) { return xScale(d.x) })
        .y(function (d) { return yScale(d.y) });
    function drawUpdatedTrendLine(data, sortedDataX, sortedDataY) {
        plot.select("#trend-line").remove();
        if (trendLineActive) {
            let sumX = 0;
            let sumY = 0;
            let sumXY = 0;
            let sumXSquare = 0;
            let sumYSquare = 0;
            let n = data.length;

            for (i = 0; i < sortedDataX.length; i++) {
                sumX += sortedDataX[i].x;
                sumY += sortedDataX[i].y;
                sumXY += sortedDataX[i].x * sortedDataX[i].y;
                sumXSquare += sortedDataX[i].x * sortedDataX[i].x;
                sumYSquare += sortedDataX[i].y * sortedDataX[i].y;
            }

            let a = ((sumY * sumXSquare) - (sumX * sumXY)) / ((n * sumXSquare) - (sumX * sumX));
            let b = ((n * sumXY) - (sumX * sumY)) / ((n * sumXSquare) - (sumX * sumX));
            //console.log("a: " + a + ", b: " + b);

            let trendLine = plot.append("line")
                .attr('x1', xScale(sortedDataX[0].x))
                .attr('y1', yScale(sortedDataX[0].x * b + a))
                .attr('x2', xScale(sortedDataX[sortedDataX.length - 1].x))
                .attr('y2', yScale(sortedDataX[sortedDataX.length - 1].x * b + a))
                .attr('id', 'trend-line')
                .attr('class', 'trend-line');

            trendLine.moveToBack();

            let pccNumerator = (n * sumXY) - (sumX * sumY);
            let pccDenominator = Math.sqrt(((n * sumXSquare) - (sumX * sumX)) * ((n * sumYSquare) - (sumY * sumY)));
            let pcc = pccNumerator / pccDenominator;

            document.getElementById("pcc-text").textContent = 'Pearson correlation coefficient (r): ' + pcc.toFixed(3);
        } else {
            document.getElementById("pcc-text").textContent = '';
        }
    }

    function drawUpdatedChartLines(data, sortedDataX, sortedDataY) {

        plot.select("g#chart-lines").remove();

        if (chartLinesActive) {
            let lines = plot.append('g')
                .attr('id', 'chart-lines');

            lines.append("path")
                .datum(sortedDataX)
                .attr("class", "chart-line")
                .attr("d", line);

            lines.moveToBack();
        }

    }

    function updateQuartileVisibility() {
        if (quartileActive) {
            xQuartiles.attr('visibility', 'visible');
            yQuartiles.attr('visibility', 'visible');
            switch (currentQuartileMode) {
                case 3:
                    xAxis.attr('visibility', 'visible');
                    yAxis.attr('visibility', 'visible');
                    yQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'visible');
                    xQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'visible');
                    yQuartiles.select('.minimalElements').attr('visibility', 'hidden');
                    xQuartiles.select('.minimalElements').attr('visibility', 'hidden');
                    break;
                case 2:
                    xAxis.attr('visibility', 'visible');
                    yAxis.attr('visibility', 'visible');
                    yQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'visible');
                    xQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'hidden');
                    yQuartiles.select('.minimalElements').attr('visibility', 'hidden');
                    xQuartiles.select('.minimalElements').attr('visibility', 'hidden');
                    break;
                case 1:
                    xAxis.attr('visibility', 'visible');
                    yAxis.attr('visibility', 'visible');
                    yQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'hidden');
                    xQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'visible');
                    yQuartiles.select('.minimalElements').attr('visibility', 'hidden');
                    xQuartiles.select('.minimalElements').attr('visibility', 'hidden');
                    break;
                case 0:
                default:
                    xAxis.attr('visibility', 'hidden');
                    yAxis.attr('visibility', 'hidden');
                    yQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'hidden');
                    xQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'hidden');
                    yQuartiles.select('.minimalElements').attr('visibility', 'visible');
                    xQuartiles.select('.minimalElements').attr('visibility', 'visible');
            }
        } else {
            xAxis.attr('visibility', 'visible');
            yAxis.attr('visibility', 'visible');
            xQuartiles.attr('visibility', 'hidden');
            yQuartiles.attr('visibility', 'hidden');
            yQuartiles.select('.minimalElements').attr('visibility', 'hidden');
            xQuartiles.select('.minimalElements').attr('visibility', 'hidden');
            yQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'hidden');
            xQuartiles.select('.boxAndWhiskerElements').attr('visibility', 'hidden');
        }

    }

    function drawUpdatedQuartiles(data, sortedDataX, sortedDataY) {
        if (quartileActive) {
            let medianXValue = xScale(getMedianValue(sortedDataX, true));
            let lowExtremeXValue = xScale(sortedDataX[0].x);
            let highExtremeXValue = xScale(sortedDataX[sortedDataX.length - 1].x);

            medianX.attr('transform', `translate(${medianXValue},${plotHeight})`);
            lowExtremeX.attr('transform', `translate(${lowExtremeXValue},${plotHeight})`);
            highExtremeX.attr('transform', `translate(${highExtremeXValue},${plotHeight})`);

            let lowerQuartileXValue = 0;
            let upperQuartileXValue = 0;
            if (data.length % 2 == 0) {
                lowerQuartileXValue = xScale(getMedianValue(sortedDataX.slice(0, sortedDataX.length / 2 - 1), true));
                upperQuartileXValue = xScale(getMedianValue(sortedDataX.slice(sortedDataX.length / 2 + 1, sortedDataX.length), true));
                lowerQuartileX.attr('transform', `translate(${lowerQuartileXValue},${plotHeight})`);
                upperQuartileX.attr('transform', `translate(${upperQuartileXValue},${plotHeight})`);
            } else {
                lowerQuartileXValue = xScale(getMedianValue(sortedDataX.slice(0, sortedDataX.length / 2), true));
                upperQuartileXValue = xScale(getMedianValue(sortedDataX.slice(sortedDataX.length / 2 + 1, sortedDataX.length), true));
                lowerQuartileX.attr('transform', `translate(${lowerQuartileXValue},${plotHeight})`);
                upperQuartileX.attr('transform', `translate(${upperQuartileXValue},${plotHeight})`);
            }

            minimalElementsX.select('line.line-0')
                .attr('x1', lowExtremeXValue)
                .attr('y1', yScale(0))
                .attr('x2', lowerQuartileXValue)
                .attr('y2', yScale(0));
            minimalElementsX.select('line.line-1')
                .attr('x1', lowerQuartileXValue)
                .attr('y1', yScale(0) - 3)
                .attr('x2', medianXValue - 3)
                .attr('y2', yScale(0) - 3);
            minimalElementsX.select('line.line-2')
                .attr('x1', medianXValue + 3)
                .attr('y1', yScale(0) - 3)
                .attr('x2', upperQuartileXValue)
                .attr('y2', yScale(0) - 3);
            minimalElementsX.select('line.line-3')
                .attr('x1', upperQuartileXValue)
                .attr('y1', yScale(0))
                .attr('x2', highExtremeXValue)
                .attr('y2', yScale(0));

            xBox1.attr('width', medianXValue - lowerQuartileXValue);
            xBox2.attr('width', upperQuartileXValue - medianXValue);

            boxAndWhiskerLineX.attr('x1', 0)
                .attr('x2', highExtremeXValue - lowExtremeXValue);

            let medianYValue = yScale(getMedianValue(sortedDataY, false));
            let lowExtremeYValue = yScale(sortedDataY[0].y);
            let highExtremeYValue = yScale(sortedDataY[sortedDataY.length - 1].y);

            medianY.attr('transform', `translate(0,${medianYValue})`);
            lowExtremeY.attr('transform', `translate(0,${lowExtremeYValue})`);
            highExtremeY.attr('transform', `translate(0,${highExtremeYValue})`);

            let lowerQuartileYValue = 0;
            let upperQuartileYValue = 0;
            if (data.length % 2 == 0) {
                lowerQuartileYValue = yScale(getMedianValue(sortedDataY.slice(0, sortedDataY.length / 2 - 1), false));
                upperQuartileYValue = yScale(getMedianValue(sortedDataY.slice(sortedDataY.length / 2 + 1, sortedDataY.length), false));
                lowerQuartileY.attr('transform', `translate(0,${lowerQuartileYValue})`);
                upperQuartileY.attr('transform', `translate(0,${upperQuartileYValue})`);
            } else {
                lowerQuartileYValue = yScale(getMedianValue(sortedDataY.slice(0, sortedDataY.length / 2), false));
                upperQuartileYValue = yScale(getMedianValue(sortedDataY.slice(sortedDataY.length / 2 + 1, sortedDataY.length), false));
                lowerQuartileY.attr('transform', `translate(0,${lowerQuartileYValue})`);
                upperQuartileY.attr('transform', `translate(0,${upperQuartileYValue})`);
            }

            minimalElementsY.select('line.line-0')
                .attr('y1', lowExtremeYValue)
                .attr('x1', xScale(0) + 1)
                .attr('y2', lowerQuartileYValue)
                .attr('x2', xScale(0) + 1);
            minimalElementsY.select('line.line-1')
                .attr('y1', lowerQuartileYValue)
                .attr('x1', xScale(0) + 3)
                .attr('y2', medianYValue + 3)
                .attr('x2', xScale(0) + 3);
            minimalElementsY.select('line.line-2')
                .attr('y1', medianYValue - 3)
                .attr('x1', xScale(0) + 3)
                .attr('y2', upperQuartileYValue)
                .attr('x2', xScale(0) + 3);
            minimalElementsY.select('line.line-3')
                .attr('y1', upperQuartileYValue)
                .attr('x1', xScale(0) + 1)
                .attr('y2', highExtremeYValue)
                .attr('x2', xScale(0) + 1);

            yBox1.attr('width', lowerQuartileYValue - medianYValue);
            yBox2.attr('width', medianYValue - upperQuartileYValue);

            boxAndWhiskerLineY.attr('y1', 0)
                .attr('y2', highExtremeYValue - lowExtremeYValue);

            xQuartiles.moveToBack();
            yQuartiles.moveToBack();
        }
    }

    function getMedianValue(data, isHorizontal) {
        if (data.length % 2 == 0) {
            let lower, higher = 0;
            if (isHorizontal) {
                lower = data[Math.floor(data.length / 2) - 1].x;
                higher = data[Math.floor(data.length / 2)].x;
            } else {
                lower = data[Math.floor(data.length / 2) - 1].y;
                higher = data[Math.floor(data.length / 2)].y;
            }
            return (lower + higher) / 2;
        } else {
            if (isHorizontal) {
                return data[Math.floor(data.length / 2)].x;
            } else {
                return data[Math.floor(data.length / 2)].y;
            }
        }
    }

    function setUpInputBar() {
        trendLineActive = false;
        d3.select('#trend-line-checkbox')
            .property('checked', trendLineActive)
            .on('change', function () {
                trendLineActive = this.checked;
                drawSecondaryPlotElements(pointData);
            });

        chartLinesActive = false;
        d3.select('#chart-lines-checkbox')
            .property('checked', chartLinesActive)
            .on('change', function () {
                chartLinesActive = this.checked;
                drawSecondaryPlotElements(pointData);
            });
        quartileActive = false;
        updateQuartileVisibility();
        selectBox = document.getElementById('quartile-mode');
        d3.select('#quartile-checkbox')
            .property('checked', quartileActive)
            .on('change', function () {
                quartileActive = this.checked;
                currentQuartileMode = parseInt(selectBox.options[selectBox.selectedIndex].value);
                updateQuartileVisibility();
                drawSecondaryPlotElements(pointData);
            });
        let quartileModeSelect = d3.select('#quartile-mode')
            .on('change', function () {
                currentQuartileMode = parseInt(this.options[this.selectedIndex].value);
                if (quartileActive) {
                    updateQuartileVisibility();
                }
            });
    }

    // moveToBack(), moveToFront() attribution: http://blockbuilder.org/eesur/4e0a69d57d3bfc8a82c2
    d3.selection.prototype.moveToBack = function () {
        return this.each(function () {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };
