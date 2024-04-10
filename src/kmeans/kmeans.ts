// tslint:disable
// @ts-nocheck
export function kmeans(vector, k, callback) {
  return new Kmeans(vector, k, callback);
}

// Algoritmo feito para apresentação em sala de aula disponível também em:
// https://replit.com/@DaviFreire/Kmeans

function Kmeans(vector, k, callback) {
  this.callback = callback;
  this.vector = vector;
  this.k = k;

  this.centroids = new Array(k);
  this.cluster = new Array(k);

  this.createCentroids();

  this.iterate();
}

const createCentroids = function () {
  const randomArray = this.vector.slice(0);
  const self = this;
  randomArray.sort(function () {
    return Math.floor(Math.random() * self.vector.length);
  });
  this.centroids = randomArray.slice(0, this.k);
};

const recursiveIterate = function (vetorArray) {
  this.cluster = new Array(this.k);

  const tempArray = [];
  for (let a = 0; a < this.vector[0].length; a++) {
    tempArray.push(0);
  }

  var vetorArray = [];
  for (let a = 0; a < this.k; a++) {
    vetorArray[a] = tempArray.slice(0);
  }

  this.vector.forEach((v) => {
    const copyV = v.slice(0);

    const centroidIndex = this.assignCentroid(copyV);

    if (!this.cluster[centroidIndex]) {
      this.cluster[centroidIndex] = [];
    }

    this.cluster[centroidIndex].push(copyV);

    vetorArray[centroidIndex].forEach((_, a) => {
      vetorArray[centroidIndex][a] += v[a];
    });
  });

  let distance,
    max = 0;

  for (let a = 0; a < this.k; a++) {
    let clusterSize = 0;
    if (this.cluster[a]) clusterSize = this.cluster[a].length;

    vetorArray[a].forEach(
      (_, index) => (vetorArray[a][index] = vetorArray[a][index] / clusterSize),
    );
    distance = this.distance(vetorArray[a], this.centroids[a]);
    if (distance > max) max = distance;
  }

  if (max <= 0.5) return this.callback(this.cluster, this.centroids);

  for (const z in vetorArray) {
    this.centroids[z] = vetorArray[z].slice(0);
  }
  this.iterate(vetorArray);
};

const assignNearstCentroid = function (point) {
  let min = Infinity,
    res = 0;

  this.centroids.forEach((centroid, index) => {
    const dist = this.distance(point, centroid);
    if (dist < min) {
      min = dist;
      res = index;
    }
  });
  return res;
};

const distanceFn = function (vetor1, vetor2) {
  let total = 0;
  vetor1.forEach((value, index) => {
    if (value != 0) total += Math.pow(vetor2[index] - vetor1[index], 2);
  });

  return Math.sqrt(total);
};

Kmeans.prototype.assignCentroid = assignNearstCentroid;
Kmeans.prototype.distance = distanceFn;
Kmeans.prototype.createCentroids = createCentroids;
Kmeans.prototype.iterate = recursiveIterate;