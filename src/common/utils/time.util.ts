export const mapTimeToSecondFromStrDHM = (string: string, milisecond?: any): number => {
  const unit = 1000;
  if (string.includes('d')) return Number(string.split('d')[0]) * 24 * 3600 * unit;
  else if (string.includes('h')) return Number(string.split('h')[0]) * 3600 * unit;
  else if (string.includes('m')) return Number(string.split('m')[0]) * 60 * unit;
};

// export const mapTimeInSecondToDHM = (dhm: string): string => {
//   const unit = dhm ? dhm : 'm';
//   if(dhm = 'd')
//     return
// }
