export const withComma = (target: number) => {
  const negative = target < 0;
  const num = `${Math.abs(target === undefined || target === null ? 0 : target)}`;
  const len = num.length;
  let point = len % 3;

  let str = num.substring(0, point);
  while (point < len) {
    if (str !== '') {
      str += ',';
    }
    str += num.substring(point, point + 3);
    point += 3;
  }
  return `${negative ? '-' : ''}${str}`;
};

export const toTimeText = (target: number) => {
  const time = target / 1000;
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time % 60);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
