export const createExpirationDateForLink = (expTimeSeconds: number) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + expTimeSeconds);
  return date;
};
