export const delay = async (delayTime: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayTime * 1000));
};