const url =
    "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-40/sparql";
const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX edm: <http://www.europeana.eu/schemas/edm/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT ?title ?date ?imgUrl WHERE {
        ?cho dct:created ?date ;
        edm:isShownBy ?imgUrl ;
        dc:title ?title .
        FILTER (xsd:integer(?date)) .
        FILTER langMatches(lang(?title), "ned") .
        } 
        LIMIT 100
        `;


