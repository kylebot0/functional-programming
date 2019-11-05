
const url =
  "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-40/sparql";
const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dct: <http://purl.org/dc/terms/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX edm: <http://www.europeana.eu/schemas/edm/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>

        SELECT ?title ?date ?imgUrl ?materialLabel ?medium WHERE {
        ?cho dct:created ?date ;
        edm:isShownBy ?imgUrl ;
        dct:medium ?medium ;
        dc:title ?title .
        ?medium skos:broader ?materialBroad .
        ?materialBroad skos:broader ?materialBroad2 .
        ?materialBroad2 skos:prefLabel ?materialLabel .
} LIMIT 10000
        `;
const runQuery = (url, query) => {
  // Call the url with the query attached, output data
  fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
    .then(res => res.json())
    .then(json => {
      console.table(json.results.bindings);
      return json.results.bindings;xw
    });
};
runQuery(url, query);
