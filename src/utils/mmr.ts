import { Rank } from "@prisma/client";

const getMMRRatio = (mmr: number, positive = true) => {
  const minMMR = 0;
  const maxMMR = 2000;

  const minAdd = 25;
  const maxAdd = 1;

  if (positive) return minAdd + (mmr * (maxAdd - minAdd)) / (maxMMR - minMMR);
  else return maxAdd - (mmr * (maxAdd - minAdd)) / (maxMMR - minMMR);
};

const getRankFromMMR = (mmr: number) => {
  let rank: Rank = Rank.BRONZE;

  if (mmr >= 100) rank = Rank.SILVER;
  if (mmr >= 250) rank = Rank.GOLD;
  if (mmr >= 500) rank = Rank.PLATINUM;
  if (mmr >= 750) rank = Rank.DIAMOND;
  if (mmr >= 1000) rank = Rank.CHAMPION;
  if (mmr >= 1250) rank = Rank.GRAND_CHAMPION;
  if (mmr >= 1500) rank = Rank.SUPER_SONIC_LEGEND;

  return rank;
};

export { getMMRRatio, getRankFromMMR };
