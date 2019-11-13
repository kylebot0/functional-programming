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
    .then(data => {
        
        setTimeout(() => {
            console.dir(data);
            makeSVG(data);
        }, 300);
      
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

function changeJsonChildren(broadArray) {
  console.log(broadArray);
  for (let i = 0; i < broadArray[0].children.length; i++) {
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
     fetch(
      url + "?query=" + encodeURIComponent(queryNarrow) + "&format=json"
    )
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
      
  }
    return Promise.all(broadArray).then( ()=> {
        console.log(broadArray)
        return broadArray
    });
}

runQuery(url, queryBroad);

function makeSVG(nodeData) {
  console.log(nodeData);
  const width = screen.width / 1.5;
  const height = screen.height / 1.5;
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(
    d3.schemeSet3
    // d3.quantize(d3.interpolateRainbow, nodeData[0].children.length + 1)
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
  const root = d3.hierarchy(nodeData[0]).sum(d => {
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
    .style("fill", d => {
      // Krijg de kleur van parents of children
      return color((d.children ? d : d.parent).data.name);
    });

  g.selectAll(".node")
    .append("text")
    .attr("class", "nodeText")
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
    return angle < 200 ? angle - 90 : angle + 90; 
  }
}
