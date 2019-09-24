export default function(num: number, pad: number = 2) {
  const enablePads = (10 ** (pad - 1)).toString().length - num.toString().length;

  return '0'.repeat(Math.max(enablePads, 0)) + num.toString();
}
