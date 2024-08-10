const getMMRRatio = (mmr: number, positive = true) => {
  const minMMR = 0;
  const maxMMR = 2000;

  const minAdd = 25;
  const maxAdd = 1;

  if (positive) return minAdd + (mmr * (maxAdd - minAdd)) / (maxMMR - minMMR);
  else return maxAdd - (mmr * (maxAdd - minAdd)) / (maxMMR - minMMR);
};

export { getMMRRatio };
