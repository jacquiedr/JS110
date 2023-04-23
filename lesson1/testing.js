const NUM_CHARS = 32;
function uuid() {
  let hex = '0123456789abcdef';
  let uuidStr = '';
  for (let idx = 0; idx < NUM_CHARS; idx += 1) {
    uuidStr += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return uuidStr.slice(0, 8) + '-' + uuidStr.slice(8, 12) + '-' + uuidStr.slice(12, 16) + '-' + uuidStr.slice(16, 20) + '-' + uuidStr.slice(20, 32);
}

console.log(uuid());