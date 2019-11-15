# Material and technique sunburst
![preview](https://github.com/kylebot0/functional-programming/blob/master/Github_images/Schermafbeelding%202019-11-14%20om%2012.50.45.png)
## Table of Contents 🗃

- [Live demo](#Live-demo)
- [Description](#Description)
- [Features](#Features)
  - [API request](#API-request)
  - [Timeline features](#Timeline-features)
  - [Upcoming features](#Upcoming-features)
  - [Known Bugs](#Known-Bugs)
- [Functionality](#Functionality)
- [Installation](#Installation)
  - [Before you clone](#Before-you-clone)
  - [Install the app](#Install-the-app)
  - [Usage](#Usage)
  
## Live demo

[You can find the demo here](https://kylebot0.github.io/functional-programming/)

## Concept

My concept is that i'm going to show the most used materials throughout the collection. I'm going to do that with a sunburst diagram. Where the most inner circle describes the most basic materials from the thesaurus. And the outer circles describe more detailed versions of the thesaurus and their materials.

## Description 📝

During this course I created a datavisualisation with D3, my concept is that i'm going to show the most used materials throughout the collection. I'm going to do that with a sunburst diagram. Where the most inner circle describes the most basic materials from the thesaurus. And the outer circles describe more detailed versions of the thesaurus and their materials.

## Features 🛠️

### API request

The app starts with an API request to the NMVW collection API. It searches for a couple of things using a endpoint and a SparQL query. It collects a uri from an object, the amount it appears in the collection and the name of the word. It puts that data in a JSON style object array used throughout the application.


```json
{
  "name": "TOPICS",
  "children": [
    {
        {
          "name": "Sub A2",
          "count": 4
        }
      ]
    },
    {
      "name": "Topic B",
      "children": [
        {
          "name": "Sub B1",
          "count": 3
        },
        {
          "name": "Sub B2",
          "count": 3
        },
        {
          "name": "Sub B3",
          "count": 3
        }
      ]
    },
    {
      "name": "Topic C",
      "children": [
        {
          "name": "Sub A1",
          "count": 4
        },
        {
          "name": "Sub A2",
          "count": 4
        }
      ]
    }
  ]
}
```

For the real geeks, this is the SparQL query i used.

```sparql
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

    SELECT ?medium ?materialLabel (COUNT(?materialLabel) AS ?countMaterialLabel) 
    WHERE {
      ?cho dct:medium ?medium .
      ?medium skos:prefLabel ?materialLabel .
    }ORDER BY DESC(?countMaterialLabel)
    LIMIT 10
```

### Sunburst features

- [x] Dynamically renders data
- [x] request via an api
- [x] Ability to size correctly
- [x] Change text degrees on axis
- [x] Use an SVG


### Known Bugs

- The only bug that is there comes from the database, it counts subjects wrong.

### Upcoming features

- [ ] Change category


## Installation 🔍

### Before you clone

- [x] Install a Code Editor
- [x] Start up your CLI

### Install the app
```
git clone https://github.com/kylebot0/frontend-applications.git
```
Get into the right folder
```
cd frontend-applications/client
```
Then just start the application

### Gitignore
My .gitignore contains all of the files and maps you dont want in your application, use this if you're going to commit and push to your own repo.
```
# dependencies
/node_modules
/config
/scripts

# testing
/coverage

# production
/build

# misc
.DS_Store
.env
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### Usage

Start the application
```
Open it up in your finder / explorer
```

Then it should fire up a localhost in your browser, if that's not the case use this in your address bar.
```
localhost:3000
```

## Credits

I followed a tutorial from: https://bl.ocks.org/denjn5/e1cdbbe586ac31747b4a304f8f86efa5 . It shows step by step on how to make a sunburst diagram. Most of my D3 code comes from there.


## License
Find the license [here](https://github.com/kylebot0/functional-programming/blob/master/LICENSE)


