const randomNumber = (max = 10000000000, min = 1) => {
  return Math.round(Math.random() * (max - min) + min);
};

module.exports = randomNumber;
