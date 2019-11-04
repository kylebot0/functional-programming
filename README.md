# Time Guesser
![preview](https://github.com/kylebot0/frontend-applications/blob/master/client/public/images/github-images/Schermafbeelding%202019-10-29%20om%2012.35.45.png)
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

[You can find the demo here]. (https://functional--programming.herokuapp.com/)

## Concept

The user has the ability to play a game where they have to guess from which time the object comes from. The item page shows an object with a title and picture along with a timeline aswell, where they can place a marker. The closer the user is to the correct time, the more points they get. I don't want it to be only time specific, but also to mix things up certain options that can tell if an object is for example before or after Napoleon. That was it is less hard to actually get the full amount of points, but i still want it to be competitive so most of the time it will show a timeline.

## Description 📝

During this course I created a frontend app with React. The data I use comes from the NMVW Collection API. The user has the ability to play a game where they have to guess from which time the object comes from. The item page shows an object with a title and picture along with a timeline aswell, where they can place a marker. The closer the user is to the correct time, the more points they get.

## Features 🛠️

### API request

The app starts with an API request to the NMVW collection API. It searches for 3 things using a endpoint and a SparQL query. It collects a title from an object, the date and the image URL. It puts that data in a data or render object and is used throughout the application.


```javascript
render: {
  title: string,
  date: string,
  imgUrl: string,
 }
 
data: {
  title: string,
  date: string,
  imgUrl: string,
 }
```

For the real geeks, this is the SparQL query i used.

```sparql
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dct: <http://purl.org/dc/terms/>
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
```

### Timeline features

- [x] Searches for a random collection.
- [x] Offsets the original date and creates a timeline with it.
- [x] Able to select a timestamp.
- [x] Change data depending on the state.


### Known Bugs

- If the year is close to 2000 it automatically sets the offset to 2019.
- Sometimes contains same years.
- First click on the timeline doesnt register well.

### Upcoming features

- [ ] Able to search a specific country's collection.
- [ ] Earn points if your close to the correct answer.


## Installation 🔍

### Before you clone

- [x] Install Node.js
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
Install npm packages
```
npm install
```
Run the application
```
npm run start
```
If you wanna build the app use
```
npm run build
```
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
npm run start
```

Then it should fire up a localhost in your browser, if that's not the case use this in your address bar.
```
localhost:3000
```

## Credits

The processing of the query is made by Laurens, you can find him [here](https://github.com/razpudding) on github.
Thanks Giovanni for this part in the query.
```javascript
FILTER (xsd:integer(?date)) .
```

## License
Find the license [here](https://github.com/kylebot0/frontend-applications/blob/master/LICENSE)


