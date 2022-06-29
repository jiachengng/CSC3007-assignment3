let width = 1000,
  height = 600;

let svg = d3.select("svg").attr("viewBox", "0 0 " + width + " " + height);

// Load external data
Promise.all([d3.json("sgmap.json"), d3.csv("population2021.csv")]).then((data) => {

    // Setting up population data
    populationData = [];
    data[0].features.forEach((element) => {
      data[1].forEach((element2) => {
        if (
          element.properties.Name.toLowerCase() ==
          element2.Subzone.toLowerCase()
        ) {
          populationData[element.properties.Name] = element2.Population;
        }
      });
    });

    // Map and projection
    var projection = d3.geoMercator()
      .center([103.851959, 1.29027])
      .fitExtent(
        [[20, 20],[980, 580]],data[0]);

    let geopath = d3.geoPath().projection(projection);

    let colorScale = d3
      .scaleOrdinal()
      .domain([0, 64000])
      .range(d3.schemePuBu[0,9]);

    let legendColour = d3
      .scaleOrdinal()
      .domain([0, 8000, 16000, 24000, 32000, 40000, 48000, 56000, 64000]).range(d3.schemePuBu[9]);

    // population legend
    var legend = d3
      .legendColor()
      .scale(legendColour)
      .shapeWidth(40)
      .orient("horizontal")
      .title("Population");

    svg
      .append("g")
      .attr("transform", "translate(1200,700)")
      .style("font-size", "12px")
      .call(legend);

    svg
      .append("g")
      .attr("id", "districts")
      .selectAll("path")
      .data(data[0].features)
      .enter()
      .append("path")
      .attr("d", geopath)
      .attr("fill", (d) =>
        colorScale(populationData[d.properties.Name])
      )
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        d3.select(".tooltip")
          .html(
            "<h4>" +
              d.properties.Name +
              "</h3>" +
              "Population: " +
              populationData[d.properties.Name]
          )
          .style("border", "solid")
                        .style("border-width", "1px")
                        .style("border-radius", "5px")
                        .style("opacity", 1)
                        .style("padding", "10px");

        let path = d3.select(event.currentTarget);
        path.style("stroke", "green").style("stroke-width", 4);
      })
      .on("mouseout", (event, d) => {
        d3.select(".tooltip").text("");

        let path = d3.select(event.currentTarget);
        path.style("stroke", "black").style("stroke-width", 4);
      });
  }
);