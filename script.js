const playButton = document.getElementById('play');
        const restartButton = document.getElementById('restart');
        const yearSlider = document.getElementById('yearSlider');
        const yearDisplay = document.getElementById('yearDisplay');
        let timer;

        function updateYearDisplay() {
            yearDisplay.textContent = yearSlider.value;
        }

        function startSlider() {
            let currentYear = +yearSlider.value;
            timer = setInterval(() => {
                if (currentYear <= +yearSlider.max) {
                    yearSlider.value = currentYear;
                    updateYearDisplay();
                    currentYear++;
                } else {
                    clearInterval(timer);
                }
            }, 2000); // Adjust the interval as needed
        }

        function restartSlider() {
            clearInterval(timer);
            yearSlider.value = yearSlider.min;
            updateYearDisplay();
        }

        playButton.addEventListener('click', () => {
            clearInterval(timer);
            startSlider();
        });

        restartButton.addEventListener('click', restartSlider);
        yearSlider.addEventListener('input', updateYearDisplay);

        // Initialize the display
        updateYearDisplay();
// Data Arrays
// Data Arrays
const deathData = ['2.1K', '20.8K', '7.8K', '7.1K', '398'];
const confirmedData = ['115K', '2.65M', '2.30M', '203K', '57.2K'];
const activeData = ['23.6K', '41.2K', '12K', '26.9K', '9.4K'];
const recoveredData = ['88.9K', '2.6M', '2.3M', '187K', '74.7K'];

const years = [2020, 2021, 2022, 2023, 2024];
let currentIndex = 0;
let interval;

// Update Stats
function updateStats(index) {
    document.getElementById('death-number').textContent = deathData[index];
    document.getElementById('confirmed-number').textContent = confirmedData[index];
    document.getElementById('active-number').textContent = activeData[index];
    document.getElementById('recovered-number').textContent = recoveredData[index];
}

// Clear Stats
function clearStats() {
    document.getElementById('death-number').textContent = '';
    document.getElementById('confirmed-number').textContent = '';
    document.getElementById('active-number').textContent = '';
    document.getElementById('recovered-number').textContent = '';
}

// Event Listeners for Play and Restart
document.getElementById('play').addEventListener('click', () => {
    setTimeout(() => {
        interval = setInterval(() => {
            updateStats(currentIndex);
            currentIndex++;
            if (currentIndex >= deathData.length) {
                clearInterval(interval);
            }
        }, 2000);
    }, 1000);
});

document.getElementById('restart').addEventListener('click', () => {
    clearInterval(interval);
    currentIndex = 0;
    clearStats();
});

// Switch Views between Chart and Analytics
document.getElementById('chartButton').addEventListener('click', function () {
    document.getElementById('chart').classList.add('active');
    document.getElementById('analytics').classList.remove('active');
});

document.getElementById('analyticsButton').addEventListener('click', function () {
    document.getElementById('chart').classList.remove('active');
    document.getElementById('analytics').classList.add('active');
});

// Slider Event Listener
document.getElementById('yearSlider').addEventListener('input', function () {
    const yearIndex = years.indexOf(parseInt(this.value));
    updateStats(yearIndex);
    updateLollipopChart(yearIndex);
});

// Function to update Lollipop Chart
function updateLollipopChart(yearIndex) {
    const totals = [
        { year: 2020, total: 2173 },
        { year: 2021, total: 20798 },
        { year: 2022, total: 7831 },
        { year: 2023, total: 7121 },
        { year: 2024, total: 398 }
    ];

    const x = d3.scaleLinear()
        .domain([0, d3.max(totals, d => d.total)])
        .range([0, chartWidth - 200]);

    const lollipops = chartSvg.selectAll(".lollipop");

    lollipops.selectAll(".line")
        .transition()
        .duration(1000)
        .attr("x2", d => yearIndex >= years.indexOf(d.year) ? x(d.total) : 0);

    lollipops.selectAll(".circle")
        .transition()
        .duration(1000)
        .attr("cx", d => yearIndex >= years.indexOf(d.year) ? x(d.total) : 0);
}

// GDP Line Area Chart with D3.js
document.addEventListener('DOMContentLoaded', function () {
    const margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    const parseYear = d3.timeParse("%Y");
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const area = d3.area()
        .x(d => x(d.year))
        .y0(height)
        .y1(d => y(d.gdp));

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.gdp));

    const svg = d3.select(".gdp-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select(".tooltip");
    const dottedLine = svg.append("line")
        .attr("class", "dotted-line")
        .attr("y1", 0)
        .attr("y2", height);

    let data;

    d3.csv("gdp_gni_annual_real.csv").then(rawData => {
        rawData.forEach(d => {
            d.year = parseYear(d.year);
            d.gdp = +d.gdp;
        });

        data = rawData.filter(d => d.year >= parseYear("2019") && d.year <= parseYear("2024"));

        const maxGdp = d3.max(data, d => d.gdp);
        const yMax = Math.ceil((maxGdp - 1300000) / 20000) * 20000 + 1300000;

        y.domain([1300000, yMax]);
        x.domain(d3.extent(data, d => d.year));

        drawInitialChart();

        document.getElementById("play").addEventListener("click", () => {
            setTimeout(animateCharts, 2000);
        });
        document.getElementById("restart").addEventListener("click", reverseAnimateChart);

        document.getElementById("yearSlider").addEventListener("input", function () {
            const year = this.value;
            updateMapYear(year);
            updateChartYear(year);
        });
    });

    function drawInitialChart() {
        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y)
                .tickValues([1300000, 1400000, 1500000, 1600000])
                .tickFormat(d => (d / 1000) + "k"));

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mousemove", function (event) {
                const mouse = d3.pointer(event);
                const mouseX = mouse[0];
                const year = x.invert(mouseX);
                const bisect = d3.bisector(d => d.year).left;
                const index = bisect(data, year);
                const d = data[index];

                dottedLine.attr("x1", x(d.year))
                    .attr("x2", x(d.year))
                    .style("opacity", 1);

                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Year: ${d.year.getFullYear()}<br>GDP: ${d.gdp}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
                dottedLine.style("opacity", 0);
            });
    }

    function drawChart() {
        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    }

    function animateCharts() {
        drawChart();
        animateLine();
    }

    function animateLine() {
        const totalLengthLine = svg.selectAll(".line").node().getTotalLength();
        const totalLengthArea = svg.selectAll(".area").node().getTotalLength();

        svg.selectAll(".line")
            .attr("stroke-dasharray", totalLengthLine + " " + totalLengthLine)
            .attr("stroke-dashoffset", totalLengthLine)
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        svg.selectAll(".area")
            .attr("fill-opacity", 0)
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("fill-opacity", 0.5);
    }

    function reverseAnimateChart() {
        const totalLengthLine = svg.selectAll(".line").node().getTotalLength();
        const totalLengthArea = svg.selectAll(".area").node().getTotalLength();

        svg.selectAll(".line")
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", totalLengthLine)
            .remove();

        svg.selectAll(".area")
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("fill-opacity", 0)
            .remove();
    }

    function updateMapYear(year) {
        // Update the map visualization based on the selected year
        // Implement this function to filter and update the map circles
    }

    function updateChartYear(year) {
        // Update the GDP chart based on the selected year
        // Implement this function to filter and update the chart
    }
});

// Map and Lollipop Chart Code
const mapWidth = 1800;
const mapHeight = 600;
const chartWidth = 600;
const chartHeight = 250;

const mapSvg = d3.select('.map');
const chartSvg = d3.select('.lollipop-chart');
const radarSvg = d3.select('.radar-chart')
    .attr('width', 600)
    .attr('height', 600)
    .append('g')
    .attr('transform', 'translate(300,300)');

const projection = d3.geoMercator()
    .center([112, 2])
    .scale(2500)
    .translate([mapWidth / 2, mapHeight / 2]);

const path = d3.geoPath().projection(projection);

const tooltip = d3.select('.tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('background-color', 'white')
    .style('border', '1px solid #ccc')
    .style('padding', '5px')
    .style('border-radius', '5px');

d3.json('malaysia.geojson').then(geojson => {
    mapSvg.selectAll('path')
        .data(geojson.features)
        .enter().append('path')
        .attr('d', path)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .on('mouseover', function (event, d) {
            d3.select(this).attr('fill', 'lightcoral');
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(d.properties.name)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function () {
            d3.select(this).attr('fill', 'white');
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
});

d3.csv('newcases.csv').then(data => {
    const parseTime = d3.timeParse("%Y");
    data.forEach(d => {
        d.date = parseTime(d.date);
        d.cases_new = +d.cases_new;
        d.Latitude = +d.Latitude;
        d.Longitude = +d.Longitude;
    });

    const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.cases_new)])
    .range([0, 20]);

let year = 2020;
let intervalMap;

const updateMap = () => {
    const filteredData = data.filter(d => d.date.getFullYear() <= year);
    const circles = mapSvg.selectAll('circle')
        .data(filteredData, d => d.state);

    circles.enter().append('circle')
        .merge(circles)
        .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
        .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
        .attr('r', 0)
        .attr('fill', 'rgba(240,128,128,0.7)')
        .attr('stroke', 'rgba(178,34,34,0.9)')
        .attr('stroke-width', 2)
        .on('mouseover', function (event, d) {
            d3.select(this).attr('fill', 'red');
            d3.select(this).attr('stroke', 'darkred');

            let tooltipContent = `<strong>${d.state}</strong><br>`;
            for (let currentYear = 2020; currentYear < year; currentYear++) {
                const yearlyCases = filteredData.find(e => e.state === d.state && e.date.getFullYear() === currentYear);
                if (yearlyCases) {
                    tooltipContent += `Year ${currentYear}: ${yearlyCases.cases_new}<br>`;
                } else {
                    tooltipContent += `Year ${currentYear}: 0<br>`;
                }
            }

            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(tooltipContent)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function (event, d) {
            d3.select(this).attr('fill', 'rgba(240,128,128,0.7)');
            d3.select(this).attr('stroke', 'rgba(178,34,34,0.9)');
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .transition().duration(1000)
        .attr('r', d => radiusScale(d.cases_new));

    circles.exit().remove(); // Remove circles that are no longer needed
};

const startAnimationMap = () => {
    intervalMap = setInterval(() => {
        if (year > 2024) {
            clearInterval(intervalMap);
        } else {
            updateMap();
            document.getElementById('yearSlider').value = year; // Update slider value
            year++;
        }
    }, 2000);
};

const resetMap = () => {
    year = 2020;
    mapSvg.selectAll('circle').remove();
    document.getElementById('yearSlider').value = year; // Reset slider value
};


    document.getElementById('play').addEventListener('click', () => {
        startAnimationMap();
        playAnimationChart();
        playAnimationRadar();
        startAnimationDiverging();
    });

    document.getElementById('restart').addEventListener('click', () => {
        clearInterval(intervalMap);
        resetMap();
        resetChart();
        resetRadar();
        restartChart();
    });

    document.getElementById('yearSlider').addEventListener("input", function () {
        clearInterval(intervalMap); // Stop the ongoing animation
        year = +this.value;
        updateMap();
    });
});
d3.csv('newdeath.csv').then(data => {
    const years = ["2020", "2021", "2022", "2023", "2024"];
    const totals = years.map(year => {
        return {
            year: year,
            total: d3.sum(data, d => +d[`total death ${year}`] || 0)
        };
    });

    const y = d3.scaleBand()
        .domain(totals.map(d => d.year))
        .range([0, chartHeight])
        .padding(0.1);

    const x = d3.scaleLinear()
        .domain([0, d3.max(totals, d => d.total)])
        .nice()
        .range([0, chartWidth - 200]);

    const chartG = chartSvg.append("g")
        .attr("transform", `translate(100,0)`);

    chartG.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => d));

    chartG.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y));

    const lollipopRadius = 8;

    const lollipops = chartG.selectAll(".lollipop")
        .data(totals)
        .enter().append("g")
        .attr("class", "lollipop");

    lollipops.append("line")
        .attr("class", "line")
        .attr("y1", d => y(d.year) + y.bandwidth() / 2)
        .attr("y2", d => y(d.year) + y.bandwidth() / 2)
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    lollipops.append("circle")
        .attr("class", "circle")
        .attr("cy", d => y(d.year) + y.bandwidth() / 2)
        .attr("cx", x(0))
        .attr("r", lollipopRadius)
        .attr("fill", "red")
        .on('mouseover', function (event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`${d.year}: ${d.total} total deaths`)
                .style('left', (event.pageX + 20) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function () {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    const updateChart = (yearIndex) => {
        lollipops.selectAll(".line")
            .transition()
            .duration(1000)
            .attr("x2", d => yearIndex >= years.indexOf(d.year) ? x(d.total) : 0);

        lollipops.selectAll(".circle")
            .transition()
            .duration(1000)
            .attr("cx", d => yearIndex >= years.indexOf(d.year) ? x(d.total) : 0);
    };

    const resetChart = () => {
        clearInterval(intervalChart);
        currentYearIndex = 0;

        lollipops.selectAll(".line")
            .transition()
            .duration(500)
            .attr("x2", x(0));

        lollipops.selectAll(".circle")
            .transition()
            .duration(500)
            .attr("cx", x(0));
    };

    let currentYearIndex = 0;
    let intervalChart;

    const playAnimationChart = () => {
        currentYearIndex = 0;
        intervalChart = setInterval(() => {
            updateChart(currentYearIndex);
            currentYearIndex++;
            if (currentYearIndex >= years.length) {
                clearInterval(intervalChart);
            }
        }, 2000);
    };

    let currentTransform = d3.zoomIdentity;
    let zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            const { transform } = event;
            currentTransform = transform;
            mapSvg.selectAll("path").attr("transform", transform);
            mapSvg.selectAll("circle").attr("transform", transform);
        });

    mapSvg.call(zoom);

    document.getElementById('zoomIn').addEventListener('click', () => {
        zoom.scaleBy(mapSvg, 1.2);
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        zoom.scaleBy(mapSvg, 0.8);
    });

    window.playAnimationChart = playAnimationChart;
    window.resetChart = resetChart;
    document.getElementById('restart').addEventListener('click', () => {
        clearInterval(intervalMap);
        resetMap();
        resetChart();
        resetRadar();
        restartDiverging();
    });

    document.getElementById('yearSlider').addEventListener("input", function () {
        const year = this.value;
        currentYearIndex = years.indexOf(year.toString());
        updateChart(currentYearIndex);
    });
});

function createBarChart(data) {
    const margin = { top: 20, right: 20, bottom: 30, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#chart-content").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([31500000, 35000000])
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y)
            .tickValues([0, 32000000, 33000000, 34000000, 35000000])
            .tickFormat(d => {
                if (d === 0) return 0;
                return d3.format(".2s")(d).replace('G', 'M');
            })
        );

    const bars = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Year: ${d.year}<br/>Population: ${d3.format(",")(d.population)}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    function animateBarsSequentially() {
        let index = 0;
        const animateBar = () => {
            if (index < bars.size()) {
                d3.select(bars.nodes()[index])
                    .transition()
                    .duration(1900)
                    .attr("y", d => y(d.population))
                    .attr("height", d => height - y(d.population))
                    .on('end', animateBar);
                index++;
            }
        };
        animateBar();
    }

    document.getElementById('play').addEventListener('click', () => {
        setTimeout(() => {
            animateBarsSequentially();
        }, 2000);
    });

    document.getElementById('restart').addEventListener('click', () => {
        bars.transition()
            .duration(500)
            .attr("y", height)
            .attr("height", 0);
    });
}

function createRadarChart() {
    const width = 600,
        height = 600;

    const svg = d3.select(".radar-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const radius = Math.min(width, height) / 2 * 0.5;
    const levels = 5,
        maxValue = 145;
    const angleSlice = Math.PI * 2 / 5;

    const radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(d => radiusScale(d.value))
        .angle((d, i) => i * angleSlice);

    let data;
    let currentIndex = 0;
    let interval;

    const tooltip = d3.select(".tooltip");

    d3.csv("ppi.csv").then((csvData) => {
        data = csvData.map(d => ({
            date: d.date,
            agriculture: +d.agriculture,
            mining: +d.mining,
            manufacturing: +d.manufacturing,
            electricity: +d.electricity,
            water: +d.water
        })).filter(d => ["2019-01-01", "2020-01-01", "2021-01-01", "2022-01-01", "2023-01-01", "2024-01-01"].includes(d.date));
        update(blankData());
    });

    const radiusScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    const axisGrid = svg.append("g").attr("class", "axisWrapper");

    axisGrid.selectAll(".levels")
        .data(d3.range(1, (levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => radius / levels * d)
        .style("fill", "none")
        .style("stroke", "grey")
        .style("stroke-opacity", 0.5);

    const axes = svg.selectAll(".axis")
        .data(["agriculture", "mining", "manufacturing", "electricity", "water"])
        .enter()
        .append("g")
        .attr("class", "axis");

    axes.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "2px");

    axes.append("text")
        .attr("class", "legend")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d)
        .style("font-size", "14px");

    function blankData() {
        return {
            agriculture: 0,
            mining: 0,
            manufacturing: 0,
            electricity: 0,
            water: 0
        };
    }

    function update(data) {
        const radarData = [
            { axis: "agriculture", value: data.agriculture },
            { axis: "mining", value: data.mining },
            { axis: "manufacturing", value: data.manufacturing },
            { axis: "electricity", value: data.electricity },
            { axis: "water", value: data.water }
        ];

        const blobWrapper = svg.selectAll(".radarWrapper")
            .data([radarData]);

        const blobUpdate = blobWrapper.enter().append("g")
            .attr("class", "radarWrapper");

        blobUpdate.append("path")
            .attr("class", "radarArea")
            .attr("d", radarLine)
            .style("fill", "lightcoral")
            .style("fill-opacity", 0.7)
            .style("stroke-width", "2px")
            .style("stroke", "red");

        blobWrapper.select(".radarArea")
            .transition().duration(1000)
            .attr("d", radarLine);

        const circles = blobUpdate.selectAll(".radarCircle")
            .data(radarData)
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", 4)
            .attr("cx", d => radiusScale(d.value) * Math.cos(angleSlice * radarData.indexOf(d) - Math.PI / 2))
            .attr("cy", d => radiusScale(d.value) * Math.sin(angleSlice * radarData.indexOf(d) - Math.PI / 2))
            .style("fill", "lightcoral")
            .style("fill-opacity", 0.8)
            .style("stroke", "lightcoral")
            .style("stroke-width", "2px")
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`${d.axis}: ${d.value}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        blobWrapper.selectAll(".radarCircle")
            .data(radarData)
            .transition().duration(2000)
            .attr("r", 4)
            .attr("cx", d => radiusScale(d.value) * Math.cos(angleSlice * radarData.indexOf(d) - Math.PI / 2))
            .attr("cy", d => radiusScale(d.value) * Math.sin(angleSlice * radarData.indexOf(d) - Math.PI / 2));
    }

    document.getElementById("play").addEventListener("click", () => {
        if (interval) {
            clearInterval(interval);
        }
        currentIndex = 0;
        interval = setInterval(() => {
            if (currentIndex < data.length) {
                update(data[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 2000);
    });

    document.getElementById("restart").addEventListener('click', () => {
        clearInterval(interval);
        currentIndex = 0;
        update(blankData());
    });
}

d3.csv("Malaysia-population.csv").then(data => {
    data.forEach(d => {
        d.year = +d.date;
        d.population = +d[' Population'];
    });

    const filteredData = data.filter(d => d.year >= 2019 && d.year <= 2024);

    createBarChart(filteredData);
});

createRadarChart();

// Diverging Bar Chart
const tooltipDiv = d3.select(".tooltip");

const marginDiverging = { top: 20, right: 20, bottom: 60, left: 50 },
    widthDiverging = 600 - marginDiverging.left - marginDiverging.right,
    heightDiverging = 400 - marginDiverging.top - marginDiverging.bottom;

const svgDiverging = d3.select(".diverging-chart")
    .attr("width", widthDiverging + marginDiverging.left + marginDiverging.right)
    .attr("height", heightDiverging + marginDiverging.top + marginDiverging.bottom)
    .append("g")
    .attr("transform", `translate(${marginDiverging.left},${marginDiverging.top})`);

let xDiverging, yDiverging, xAxisDiverging, yAxisDiverging;

let dataDiverging;
let intervalIdDiverging;

d3.csv("death.csv").then(deaths => {
    d3.csv("birth.csv").then(births => {
        const parseDate = d3.timeParse("%Y-%m-%d");
        dataDiverging = births.map(birth => {
            const date = parseDate(birth.date);
            const deathEntry = deaths.find(d => parseDate(d.date).getTime() === date.getTime());
            return {
                year: date.getFullYear(),
                birth: +birth.abs,
                death: deathEntry ? +deathEntry.abs : 0
            };
        }).filter(d => d.year >= 2017);

        initializeChartDiverging();
        updateChartDiverging(dataDiverging.filter(d => d.year === dataDiverging[0].year));
    }).catch(error => {
        console.error("Error loading data:", error);
    });
});

function initializeChartDiverging() {
    xDiverging = d3.scaleLinear()
        .domain([-d3.max(dataDiverging, d => d.death), 550000])
        .range([0, widthDiverging]);

    yDiverging = d3.scaleBand()
        .domain(dataDiverging.map(d => d.year))
        .range([0, heightDiverging])
        .padding(0.1);

    xAxisDiverging = d3.axisBottom(xDiverging)
        .tickFormat(d => {
            const absValue = Math.abs(d);
            if (absValue >= 1e6) {
                return `${(absValue / 1e6).toFixed(1)}M`;
            } else if (absValue >= 1e3) {
                return `${(absValue / 1e3).toFixed(0)}k`;
            } else {
                return absValue.toLocaleString();
            }
        })
        .tickSizeOuter(0);

    yAxisDiverging = d3.axisLeft(yDiverging).tickSize(0);

    svgDiverging.append("g")
        .attr("class", "x-axisDiverging")
        .attr("transform", `translate(0,${heightDiverging})`)
        .call(xAxisDiverging);

    svgDiverging.append("g")
        .attr("class", "y-axisDiverging")
        .call(yAxisDiverging);

    const legendData = [
        { label: "Death", color: "rgb(255, 0, 0)" },
        { label: "Birth", color: "rgb(56, 87, 200)" }
    ];

    const legendItemWidth = 70;
    const legendSpacing = 10;
    const legendTop = heightDiverging + 20; // Position below the chart

    const legend = svgDiverging.append("g")
        .attr("transform", `translate(${widthDiverging / 2 - (legendData.length * legendItemWidth + (legendData.length - 1) * legendSpacing) / 2}, ${legendTop})`);

    const legendItems = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * (legendItemWidth + legendSpacing)}, 0)`);

    legendItems.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => d.color);

    legendItems.append("text") // Append text AFTER the rect
        .attr("x", 25)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d.label); 
}

function startAnimationDiverging() {
    let currentIndex = 0;
    const years = dataDiverging.map(d => d.year);

    function displayNextYear() {
        if (currentIndex >= years.length) {
            clearInterval(intervalIdDiverging);
            updateChartDiverging(dataDiverging);
            return;
        }

        const currentYear = years[currentIndex];
        const filteredData = dataDiverging.filter(d => d.year <= currentYear);

        updateChartDiverging(filteredData);

        currentIndex++;
    }

    svgDiverging.selectAll(".bar-group").remove();

    intervalIdDiverging = setInterval(displayNextYear, 2000);

    displayNextYear();
}

function updateChartDiverging(dataToShow) {
    const barGroups = svgDiverging.selectAll(".bar-group")
        .data(dataToShow, d => d.year);

    const barGroupEnter = barGroups.enter().append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(0,${yDiverging(d.year)})`);

    barGroupEnter.append("rect")
        .attr("class", "bar death")
        .attr("x", xDiverging(0))
        .attr("width", 0)
        .attr("height", yDiverging.bandwidth() / 1.5)
        .style("fill", "rgb(255, 0, 0)");

    barGroupEnter.append("rect")
        .attr("class", "bar birth")
        .attr("x", xDiverging(0))
        .attr("width", 0)
        .attr("height", yDiverging.bandwidth() / 1.5)
        .style("fill", "rgb(56, 87, 200)");

    barGroups.select(".bar.death")
        .transition()
        .duration(2000)
        .attr("x", d => xDiverging(-d.death))
        .attr("width", d => xDiverging(d.death) - xDiverging(0));

    barGroups.select(".bar.birth")
        .transition()
        .duration(2000)
        .attr("x", xDiverging(0))
        .attr("width", d => xDiverging(d.birth) - xDiverging(0));

    svgDiverging.select(".y-axisDiverging")
        .transition()
        .duration(500)
        .call(yAxisDiverging);

    svgDiverging.selectAll(".bar")
        .on("mouseover", function (event, d) {
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", .9);
            tooltipDiv.html("Year: " + d.year + "<br/>Births: " + d.birth + "<br/>Deaths: " + d.death)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

document.getElementById('play').addEventListener('click', function () {
    clearInterval(intervalIdDiverging);
    startAnimationDiverging();
    startAnimationMap();
    playAnimationChart();
    playAnimationRadar();
});

document.getElementById('restart').addEventListener('click', () => {
    clearInterval(intervalIdDiverging);

    const barGroups = svgDiverging.selectAll(".bar-group");

    barGroups.select(".bar.birth")
        .transition()
        .duration(1000)
        .attr("x", xDiverging(0))
        .attr("width", 0);

    barGroups.select(".bar.death")
        .transition()
        .duration(1000)
        .attr("x", xDiverging(0))
        .attr("width", 0);
});
