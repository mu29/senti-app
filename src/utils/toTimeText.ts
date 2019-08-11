export default (target: number) => {
  const time = target / 1000;
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time % 60);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
