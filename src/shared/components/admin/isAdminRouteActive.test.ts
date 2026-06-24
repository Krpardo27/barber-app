import assert from "node:assert/strict";
import test from "node:test";

import { isAdminRouteActive } from "./isAdminRouteActive";

test("Dashboard activo solo en /admin exacto", () => {
  assert.equal(isAdminRouteActive("/admin", "/admin"), true);
  assert.equal(isAdminRouteActive("/admin/clientes", "/admin"), false);
  assert.equal(isAdminRouteActive("/admin/reservas", "/admin"), false);
});

test("Ruta hija activa en exact y subruta", () => {
  assert.equal(isAdminRouteActive("/admin/clientes", "/admin/clientes"), true);
  assert.equal(
    isAdminRouteActive("/admin/clientes/detalle/123", "/admin/clientes"),
    true
  );
});

test("Ruta hija no se activa con prefijos parecidos", () => {
  assert.equal(
    isAdminRouteActive("/admin/clientes-vip", "/admin/clientes"),
    false
  );
  assert.equal(
    isAdminRouteActive("/admin/configuracion-extra", "/admin/configuracion"),
    false
  );
});

test("Rutas distintas no deben activarse", () => {
  assert.equal(isAdminRouteActive("/admin/servicios", "/admin/reservas"), false);
  assert.equal(isAdminRouteActive("/", "/admin/reservas"), false);
});

test("Historial activo en exacta y subruta", () => {
  assert.equal(isAdminRouteActive("/admin/historial", "/admin/historial"), true);
  assert.equal(
    isAdminRouteActive("/admin/historial/canceladas", "/admin/historial"),
    true
  );
});

test("Trailing slash no activa dashboard exacto", () => {
  assert.equal(isAdminRouteActive("/admin/", "/admin"), false);
});
