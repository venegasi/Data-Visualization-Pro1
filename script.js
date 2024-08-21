// Configuración inicial
const width = 800;
const height = 400;
const padding = 50;

const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

// Cargar datos
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(data => {
        const dataset = data.data;

        // Escalas
        const xScale = d3.scaleBand()
            .domain(dataset.map(d => d[0]))
            .range([padding, width - padding])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[1])])
            .range([height - padding, padding]);

        // Ejes
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d => new Date(d).getFullYear());
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - padding})`)
            .call(xAxis);

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);

        // Barras
        svg.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - padding - yScale(d[1]))
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1]);
    });
// Tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip");

svg.selectAll(".bar")
    .on("mouseover", (event, d) => {
        tooltip
            .style("visibility", "visible")
            .attr("data-date", d[0])
            .html(`Fecha: ${d[0]}<br>PIB: $${d[1].toFixed(2)} Billion`)
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
    });
