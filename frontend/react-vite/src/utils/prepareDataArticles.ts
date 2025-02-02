export const prepareData = (dates: string[]) => {
  const dataMap: { [key: string]: number } = {};

  dates.forEach((dateString) => {
    const year = new Date(dateString).getFullYear();
    dataMap[year] = (dataMap[year] || 0) + 1;
  });

  return Object.keys(dataMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((year) => ({
      year: Number(year),
      count: dataMap[year],
    }));
};
