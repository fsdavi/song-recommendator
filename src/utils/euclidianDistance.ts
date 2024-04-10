const euclidianDistance = function (vetor1: number[], vetor2: number[]) {
  let total = 0;
  vetor1.forEach((value, index) => {
    if (value != 0) total += Math.pow(vetor2[index] - vetor1[index], 2);
  });

  return Math.sqrt(total);
};

export default euclidianDistance;