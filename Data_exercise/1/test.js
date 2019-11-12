let dataString = `Kleur haar (HEX code)
#915B05
#955f20
#3D2314
#cb9a49
#513723
#B0780D
#EBDBC7
a88473
#2e0707

#3C2B1C
faf0be
1a1b16
#5F5D43
#faf0be
cecb9f
#AF9239
#8B4513
#ffd700

#79553d
#45322e
ffc108
FAF0BE
Bruin
#151410
#653616
#5B4844
#764D33 & #36E3CB
#3D2314
#75621f
654321
Blond
#cc8e35
#000000
EDDDE9
#faf0be
#907155
#1b0d03
#f3ffc7
a85418
3c3200
#bc8753
#fff5b7
873D2C
0b0b0b
#E8D664
#000000
674b40
#c5a165
#2b2523
#5e1414
96745C
#c68948
#8F6F50
#755109

#29231A
#503c31
#9c7135
#000000
baa689
#180C0C
#A52A2A
#faf0be
#660000
FAF0BE
Ff60bb
#654321
#A5682A
#634e34
#a47c53
8B572A
#1c1605
000000
#000000
693E2A
#70634a
#332621
#ae7256
#301c0f
#8b4513
`;

let stringArray = dataString.split("\n");
let newStringArray = [];

function parseStringsInArrayToHexcode(stringArray) {
  //Eerste entry verwijderen
  stringArray.shift();
  for (let hexCode of stringArray) {
    hexCode = hexCode.toUpperCase();
    if (checkHexcodeMatch(hexCode)) {
      pushToNewArray(hexCode);
    } else if (hexCode.length < 6 || hexCode.length > 7) {
      console.log(hexCode.length);
      hexCode = null;
      pushToNewArray(hexCode);
    } else if (hexCode.length == 6) {
      hexCode = "#" + hexCode;
      pushToNewArray(hexCode);
    }
  }
  return newStringArray;
}

function pushToNewArray(hexCode) {
  return newStringArray.push(hexCode);
}

function checkHexcodeMatch(hexCode) {
  if (hexCode.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) {
    return true;
  } else {
    return false;
  }
}

console.log(parseStringsInArrayToHexcode(stringArray));
