function sortStringsByConsonants(array) {
  let consonantCounts = {};

  for (let idx = 0; idx < array.length; idx += 1) {
    let word = array[idx];
    if (!(word in consonantCounts)) {
      consonantCounts[word] = countMaxAdjacentConsonants(word);
    }
  }
  const sortedKeys = Object.keys(consonantCounts).sort((a, b) => consonantCounts[b] - consonantCounts[a]);

  return sortedKeys;
}

function countMaxAdjacentConsonants(string) {
  string = string.replace(' ', '');
  let count = 0;
  let tempStr = '';
  let consonants = 'bcdfghjklmnpqrstvwxyz';
  let vowels = 'aeiou';

  for (let idx = 0; idx < string.length; idx += 1) {
    if (consonants.includes(string[idx])){
      tempStr += string[idx];
      if (tempStr.length > 1 && tempStr.length > count) {
        count = tempStr.length;
      }
    } else if (vowels.includes(string[idx])) {
      if (tempStr.length > 1 && tempStr.length > count) {
        count = tempStr.length;
      }
      tempStr = '';
    }
  }

  return count;
}

console.log(countMaxAdjacentConsonants('dddaa')); // 3
console.log(countMaxAdjacentConsonants('ccaa')); // 2
console.log(countMaxAdjacentConsonants('day')); // 0
console.log(countMaxAdjacentConsonants('month')); // 3

console.log(sortStringsByConsonants(['aa', 'baa', 'ccaa', 'dddaa'])); // ['dddaa', 'ccaa', 'aa', 'baa']
console.log(sortStringsByConsonants(['can can', 'toucan', 'batman', 'salt pan'])); // ['salt pan', 'can can', 'batman', 'toucan']
console.log(sortStringsByConsonants(['bar', 'car', 'far', 'jar'])); // ['bar', 'car', 'far', 'jar']
console.log(sortStringsByConsonants(['day', 'week', 'month', 'year'])); // ['month', 'day', 'week', 'year']