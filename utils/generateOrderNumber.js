import { OrderCounter } from "../models/index.js";

const getFinancialYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  return `${startYear}-${String(endYear).slice(-2)}`;
};

export const generateOrderNumber = async () => {
  const financialYear = getFinancialYear();

  let counter = await OrderCounter.findOne({ financialYear });

  if (!counter) {
    counter = await OrderCounter.create({ financialYear, count: 1 });
  } else {
    counter.count += 1;
    await counter.save();
  }

  const paddedCount = String(counter.count).padStart(3, '0');
  return `MCS/${financialYear}/${paddedCount}`;
};
