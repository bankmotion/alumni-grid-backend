export const delay = async (delayTime: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayTime * 1000));
};

export const getRandNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + 1;
};
