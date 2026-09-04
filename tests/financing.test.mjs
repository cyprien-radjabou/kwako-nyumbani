import assert from "node:assert/strict";
import test from "node:test";

import { calculateFinancing } from "../app/financing.ts";

const cases = [
  {
    name: "RUASHI-01",
    price: 22_534,
    principal: 18_027.2,
    cash: [401.01, 258.64, 216.36],
    bank: [501.26, 323.3, 270.45],
  },
  {
    name: "RUASHI-02",
    price: 26_071,
    principal: 20_856.8,
    cash: [463.95, 299.23, 250.32],
    bank: [579.93, 374.04, 312.9],
  },
];

const toCents = (value) => Math.round(value * 100);

for (const house of cases) {
  for (const [mode, financed] of [
    ["acompte comptant", false],
    ["acompte financé", true],
  ]) {
    test(`${house.name} — ${mode}`, () => {
      const simulation = calculateFinancing(house.price, 20, financed);
      const expected = financed ? house.bank : house.cash;

      assert.equal(toCents(simulation.epanayoPrincipal), toCents(house.principal));
      assert.equal(
        toCents(simulation.bankPrincipal),
        financed ? toCents(house.price * 0.2) : 0,
      );
      assert.deepEqual(
        simulation.rows.map((row) => toCents(row.monthly)),
        expected.map(toCents),
      );
    });
  }
}
