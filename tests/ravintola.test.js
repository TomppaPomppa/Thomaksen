import { assert, describe, expect, it } from 'vitest';
import ravintola from '../ravintola/ravintola.js';

describe('Ravintolasovelluksen testaus', function () {
  it('should return correct sum from laskeLasku when customer picks main course, starter, dessert and no drink ', function () {
    const ruuat = [ravintola.paaruoat[0], ravintola.juomat[3]];
    expect(ravintola.laskeLasku(ruuat)).toBe(10);
  });
  // it('should return a value from one of the arrays in Ravintola (alkuruoat, paaruoat, jalkiruoat tai juomat.)', () => {
  //   const testiArvoTaulukosta = ravintola.palautaTaulukonSatunnainenArvo(
  //     ravintola.juomat
  //   );
  //   const taulukkoTestattavaksi = ravintola.juomat;
  //   assert.include(
  //     taulukkoTestattavaksi,
  //     testiArvoTaulukosta,
  //     'Taulukko ei sisällä arvoa'
  //   );
  // });

  // it('palauttaa taulukon oikealla pituudella ja kutsuu tilaaAteria jokaiselle asiakkaalle', () => {
  //   // Stubataan tilaaAteria jotta testistä tulee deterministinen
  //   const fakeTilaa = () => ({ summa: 10, ruoat: ['Pääruoka'] });
  //   ravintola.tilaaAteria = fakeTilaa;
  //   ravintola.paikkojenMaara = 10;

  //   const result = ravintola.syoRavintolassa(3);

  //   expect(Array.isArray(result)).toBe(true);
  //   expect(result).toHaveLength(3);
  //   console.log(typeof result);
  // });

  it('Kutsu syoRavintolassa funktiota argumentilla, joka on pienempi tai yhtäsuuri kuin paikkojen määrä.', () => {
    ravintola.paikkojenMaara;
    ravintola.paikat = undefined;

    const originalTilaa = ravintola.tilaaAteria;
    ravintola.tilaaAteria = () => ({ summa: 10, ruoat: ['Pääruoka'] });

    const result = ravintola.syoRavintolassa(3);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);

    ravintola.tilaaAteria = originalTilaa;
  });

  it('ensiksi syoRavintolassa(10) onnistuu, sitten syoRavintolassa(6) heittää virheen', () => {
    ravintola.tilaaAteria = () => ({ summa: 10, ruoat: ['Pääruoka'] });
    let kutsu = 0;
    ravintola.tarkistaPaikkojenMaara = function () {
      kutsu++;
      if (kutsu === 1) return true;
      throw new Error('Ei tilaa');
    };

    const res1 = ravintola.syoRavintolassa(10);
    expect(Array.isArray(res1)).toBe(true);
    expect(res1).toHaveLength(10);

    expect(() => ravintola.syoRavintolassa(6)).toThrowError();
  });
});
