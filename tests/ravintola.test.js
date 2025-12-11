import { assert, describe, expect, it } from 'vitest';
const Ravintola = require('../ravintola/ravintola.js');

describe('funktion testaus', () => {
  const ravintola = Ravintola;
  it('Tarkistetaan laskelasku-funktio', function () {
    const summa = ravintola.laskeLasku(true, true, false);
    expect(summa).toBe(14);
  });

  it('Tarkistetaan palautaTaulukonSatunnainenArvo-funktio', () => {
    const rand = ravintola.palautaTaulukonSatunnainenArvo(ravintola.juomat);
    const testitaulukko = ravintola.juomat;
    assert.include(rand, testitaulukko, 'eipä ollu');
  });
});
