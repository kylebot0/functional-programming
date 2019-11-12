const url =
  "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-30/sparql";
const query = `
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?materialLabel (COUNT(?materialLabel) AS ?countMaterialLabel) 
WHERE {
  ?cho dct:medium ?medium .
  ?medium skos:prefLabel ?materialLabel .
}ORDER BY DESC(?countMaterialLabel)
LIMIT 10
        `;

function runQuery(url, query) {
     fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
        .then(res => res.json())
        .then(json => {
            let results = json.results.bindings;
            let newArray = [];
            results.forEach(e => {
                let currentObject = {
                    name: e.materialLabel.value,
                    value: e.countMaterialLabel.value
                }
                newArray.push(currentObject);
            })
           makeSVG(newArray)
        })
};  
runQuery(url, query)

function makeSVG(nodeData) {
    console.log(nodeData);
  const width = 500;
  const height = 500;
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(
      d3.schemeSet3
    // d3.quantize(d3.interpolateRainbow, nodeData.children.length + 1)
  );

  // Create primary <g> element
  const g = d3
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Data strucure
  const partition = d3.partition().size([2 * Math.PI, radius]);

  // Find data root
  const root = d3.hierarchy(nodeData).sum(d => {
          return d.value;
  });

  // Size arcs
  partition(root);
  const arc = d3
    .arc()
    .startAngle(d => {
      return d.x0;
    })
    .endAngle(d => {
      return d.x1;
    })
    .innerRadius(d => {
      return d.y0;
    })
    .outerRadius(d => {
      return d.y1;
    });

  // Put it all together
  g.selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .append("path")
    .attr("display", d => {
      return d.depth ? null : "none";
    })
    .attr("d", arc)
    .style("stroke", "#fff")
    .style("fill",  d => {
        return color((d.children ? d : d.parent).data.name);
    });

  g.selectAll(".node")
    .append("text")
    .attr("transform", d => {
      return (
        "translate(" +
        arc.centroid(d) +
        ")rotate(" +
        computeTextRotation(d) +
        ")"
      );
    })
    .attr("dx", "-20")
    .attr("dy", ".5em")
    .text(d => {
      return d.parent ? d.data.name : "";
    });
  function computeTextRotation(d) {
    let angle = ((d.x0 + d.x1) / Math.PI) * 90;
    // Avoid upside-down labels
    return angle < 120 || angle > 270 ? angle : angle + 180; // labels as rims
    return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
  }
};


