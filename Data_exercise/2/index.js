const url =
  "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-30/sparql";
const queryBroad = `
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?medium ?materialLabel (COUNT(?materialLabel) AS ?countMaterialLabel) 
WHERE {
  ?cho dct:medium ?medium .
  ?medium skos:prefLabel ?materialLabel .
}ORDER BY DESC(?countMaterialLabel)
LIMIT 10
        `;

function runQuery(url, queryBroad) {
  fetch(url + "?query=" + encodeURIComponent(queryBroad) + "&format=json")
    .then(res => res.json())
    .then(json => {
      return changeJsonParent(json.results.bindings);
    })
    .then(broadArray => {
      return changeJsonChildren(broadArray);
    })
    .then(narrowArray => {
      setTimeout(() => {
        changeJsonChildrenOfChildren(narrowArray);
      }, 1000);
      return narrowArray;
    })
    .then(data => {
      setTimeout(() => {
        console.dir(data);
        makeSVG(data);
      }, 3000);
    });
}
function changeJsonParent(results) {
  let newArray = [{ name: "Materials", children: [] }];
  results.forEach(e => {
    let currentObject = {
      uri: e.medium.value,
      name: e.materialLabel.value,
      //   value: e.countMaterialLabel.value,
      children: []
    };
    newArray[0].children.push(currentObject);
  });
  return newArray;
}

function changeJsonChildrenOfChildren(narrowArray) {
  console.log(narrowArray);
  console.log(narrowArray[0].children.length);
  narrowArray[0].children.forEach((item, itemDescendant) => {
    narrowArray[0].children[itemDescendant].children.forEach((item, i) => {
      let uri = narrowArray[0].children[itemDescendant].children[i].uri;
      const queryNarrow = `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

        SELECT  ?materialNarrow ?materialLabel (COUNT(?materialLabel) AS ?countMaterialLabel) 
        WHERE {
        VALUES ?term  {<${uri}>}
        ?term skos:narrower ?materialNarrow .
        #?materialNarrow skos:narrower ?materialNarrow2 .
        ?materialNarrow skos:prefLabel ?materialLabel .
        }ORDER BY DESC(?countMaterialLabel)
        LIMIT 100
        `;
      fetch(url + "?query=" + encodeURIComponent(queryNarrow) + "&format=json")
        .then(res => res.json())
        .then(json => {
          let childrenArray = json.results.bindings;
          childrenArray.forEach(e => {
            let currentObject = {
              uri: e.materialNarrow.value,
              name: e.materialLabel.value,
              value: e.countMaterialLabel.value,
              children: []
            };
            narrowArray[0].children[itemDescendant].children[i].children.push(
              currentObject
            );
          });
          console.log(narrowArray);
          return narrowArray;
        });
    });
  });
}

function changeJsonChildren(broadArray) {
  console.log(broadArray);
  broadArray[0].children.forEach((item, i) => {
    //   console.log(i);
    let uri = broadArray[0].children[i].uri;
    const queryNarrow = `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

        SELECT  ?materialNarrow ?materialLabel (COUNT(?materialLabel) AS ?countMaterialLabel) 
        WHERE {
        VALUES ?term  {<${uri}>}
        ?term skos:narrower ?materialNarrow .
        #?materialNarrow skos:narrower ?materialNarrow2 .
        ?materialNarrow skos:prefLabel ?materialLabel .
        }ORDER BY DESC(?countMaterialLabel)
        LIMIT 100
`;
    fetch(url + "?query=" + encodeURIComponent(queryNarrow) + "&format=json")
      .then(res => res.json())
      .then(json => {
        let childrenArray = json.results.bindings;
        childrenArray.forEach(e => {
          let currentObject = {
            uri: e.materialNarrow.value,
            name: e.materialLabel.value,
            value: e.countMaterialLabel.value,
            children: []
          };
          broadArray[0].children[i].children.push(currentObject);
        });
        return broadArray;
      });
  });
  return Promise.all(broadArray).then(() => {
    console.log(broadArray);
    return broadArray;
  });
}

runQuery(url, queryBroad);

function makeSVG(nodeData) {
  console.log(nodeData);
  const width = screen.width;
  const height = screen.height / 1.3 ;
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(
    //   d3.schemeSet3
      d3.quantize(d3.interpolateRainbow, nodeData[0].children.length + 1)
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

  // Find data root and sets hierarchy
  const root = d3.hierarchy(nodeData[0]).sum(d => {
    return d.value;
  });

  console.log(root);
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
      console.log(d.depth);
      // Make the root node invisible
      return d.depth ? null : "none";
    })
    .attr("d", arc)
    .style("stroke", "#fff")
    .style("fill", d => {
      // Krijg de kleur van parents of children
        while (d.depth > 1) d = d.parent; return color(d.data.name);
    })
    .style("fill-opacity", 0.8)
    .on("mouseover", function() {
      d3.select(this).style("fill-opacity", 1);
    })
    .on("mouseout", function() {
      d3.select(this).style("fill-opacity", 0.8);
    });

  //Insert text
  g.selectAll(".node")
    .append("text")
    .attr("class", "nodeText")
    .attr("transform", d => {
      return "translate(" + arc.centroid(d) + ")rotate(" + rotateText(d) + ")";
    })
    .attr("dx", "-20")
    .attr("dy", ".5em")
    .text(d => {
      return d.parent ? d.data.name : "";
    });

  function rotateText(d) {
    let angle = ((d.x0 + d.x1) / Math.PI) * 90;
    return angle < 180 ? angle - 90 : angle + 90;
  }
}
