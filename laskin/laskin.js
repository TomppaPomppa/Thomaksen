const Laskin = function () {};

/**
 * Funktioiden dokumentaatio luotu JSDoc'lla
 * Lue lisää https://jsdoc.app/
 */

/**
 * Laskee yhteen a + b ja palauttaa summan tulos
 * @param {number} a
 * @param {number} b
 * @return {number} a + b summa
 */
Laskin.prototype.plusLasku = function (a, b) {
  const tulos = a + b;
  const tuloste = `${a} + ${b} = ${tulos}`;
  console.log(tuloste);
  return tulos;
};
/**
 * Vähentää a - b ja palauttaa erotuksen tulos
 * @param {number} a
 * @param {number} b
 * @return {number} a - b erotus
 */
Laskin.prototype.miinusLasku = function (a, b) {
  const tulos = a - b;
  const tuloste = `${a} - ${b} = ${tulos}`;
  console.log(tuloste);
  return tulos;
};

const laskin = new Laskin();

export default laskin;
