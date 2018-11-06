function insertCommas(num: number) {
  const split = num.toString().split('.');
  function dec(text: string) {
    if (split.length === 2) {
      let decimal = split[1].slice(0, 2);
      if (decimal.length === 1) {
        return `${text}.0${decimal}`;
      } else {
        return `${text}.${decimal}`;
      }
    }
    return text;
  }
  let str = split[0];
  if (str.length === 4) {
    const firstChar = str.charAt(0),
          nextChars = str.slice(1);
    return dec(`${firstChar},${nextChars}`);
  } else if (str.length === 5) {
    const firstChars = str.slice(0, 2),
          nextChars = str.slice(2);
    return dec(`${firstChars},${nextChars}`);
  } else if (str.length === 6) {
    const firstChars = str.slice(0, 3),
          nextChars = str.slice(3);
    return dec(`${firstChars},${nextChars}`);
  } else if (str.length === 7) {
    const firstChar = str.charAt(0),
          secondChars = str.slice(1, 4),
          nextChars = str.slice(4);
    return dec(`${firstChar},${secondChars},${nextChars}`);
  } else if (str.length === 8) {
    const firstChars = str.slice(0, 2),
          secondChars = str.slice(2, 5),
          nextChars = str.slice(5);
    return dec(`${firstChars},${secondChars},${nextChars}`);
  } else if (str.length === 9) {
    const firstChars = str.slice(0, 3),
          secondChars = str.slice(3, 6),
          nextChars = str.slice(6);
    return dec(`${firstChars},${secondChars},${nextChars}`);
  } else {
    return dec(str);
  }
}

export function roundDecimal(value: number) {
  let split = value.toString().split('.');
  if (split.length > 1) {
    split = value.toFixed(2).toString().split('.');
    return `${insertCommas(parseInt(split[0]))}.${split[1]}`;
  }
  return insertCommas(value);
}