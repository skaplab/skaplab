/**
 * skaplab_auth.js
 * ─────────────────────────────────────────────────────────────────
 * Felles autentisering og aktivitetssporing for alle SkapLab-sider.
 * Inkluder én gang i alle HTML-filer:
 *   <script src="skaplab_auth.js"></script>
 *
 * Eksponerer globalt objekt: window.SkapLab
 * ─────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // ── KONFIGURASJON ──────────────────────────────────────────────
  var SUPABASE_URL = 'https://cqzmzsqhuawpsvnjjzse.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_mmihFKY7S7bqdbOw9ZNORg_8jxMzZ9j';
  var API = SUPABASE_URL + '/rest/v1';
  var SESSION_NØKKEL = 'skaplab_elev';
  var LAERER_NØKKEL  = 'skaplab_laerer';

  // ── HJELPEFUNKSJONER ───────────────────────────────────────────
  function hdr(token) {
    var h = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + (token || SUPABASE_KEY)
    };
    return h;
  }

  function post(sti, data, token) {
    return fetch(API + sti, {
      method: 'POST',
      headers: Object.assign(hdr(token), { 'Prefer': 'return=representation' }),
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); });
  }

  function get(sti, token) {
    return fetch(API + sti, {
      headers: hdr(token)
    }).then(function (r) { return r.json(); });
  }

  function patch(sti, data, token) {
    return fetch(API + sti, {
      method: 'PATCH',
      headers: Object.assign(hdr(token), { 'Prefer': 'return=representation' }),
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); });
  }

  // Supabase Auth-endepunkt
  function auth(sti, data) {
    return fetch(SUPABASE_URL + '/auth/v1/' + sti, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); });
  }

  // ── ELEV-INNLOGGING ────────────────────────────────────────────
  async function elevLoggInn(kode) {
    try {
      var resp = await fetch(
        API + '/elever?innloggingskode=eq.' + kode + '&aktiv=eq.true' +
        '&select=id,fullt_navn,klasse_id,klasser(navn,trinn,skoler(navn))',
        { headers: hdr() }
      );
      var data = await resp.json();
      if (!data || data.length === 0) return { ok: false, feil: 'Feil kode' };
      var elev = data[0];
      sessionStorage.setItem(SESSION_NØKKEL, JSON.stringify(elev));
      return { ok: true, elev: elev };
    } catch (e) {
      return { ok: false, feil: 'Tilkoblingsfeil' };
    }
  }

  function elevLoggUt() {
    sessionStorage.removeItem(SESSION_NØKKEL);
  }

  function hentElev() {
    try {
      var data = sessionStorage.getItem(SESSION_NØKKEL);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  }

  function erElevInnlogget() {
    return hentElev() !== null;
  }

  // ── LÆRER-INNLOGGING (via Supabase Auth) ──────────────────────
  async function laererLoggInn(epost, passord) {
    try {
      var resp = await auth('token?grant_type=password', {
        email: epost, password: passord
      });
      if (resp.error) return { ok: false, feil: resp.error.message };
      sessionStorage.setItem(LAERER_NØKKEL, JSON.stringify(resp));
      return { ok: true, token: resp.access_token };
    } catch (e) {
      return { ok: false, feil: 'Tilkoblingsfeil' };
    }
  }

  async function laererLoggUt() {
    var l = hentLaerer();
    if (l) {
      await fetch(SUPABASE_URL + '/auth/v1/logout', {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + l.access_token }
      });
    }
    sessionStorage.removeItem(LAERER_NØKKEL);
  }

  function hentLaerer() {
    try {
      var data = sessionStorage.getItem(LAERER_NØKKEL);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  }

  function erLaererInnlogget() {
    return hentLaerer() !== null;
  }

  // ── AKTIVITETSSPORING ─────────────────────────────────────────
  /**
   * Logg aktivitet for innlogget elev.
   * @param {string} ressurs    - f.eks. 'mattequiz_Algebra'
   * @param {string} kmKode     - f.eks. 'MAT-ALG'
   * @param {number} scorePst   - 0–100
   * @param {number} antall     - antall oppgaver totalt
   * @param {number} riktige    - antall riktige svar
   */
  async function loggAktivitet(ressurs, kmKode, scorePst, antall, riktige) {
    var elev = hentElev();
    if (!elev) return;  // ikke logget inn, gjør ingenting

    try {
      await post('/aktivitet', {
        elev_id:         elev.id,
        ressurs:         ressurs,
        km_kode:         kmKode,
        score_pst:       Math.round(scorePst),
        antall_oppgaver: antall || null,
        riktige:         riktige || null
      });
    } catch (e) {
      // Sporing feiler stille — ikke forstyrr spillopplevelsen
    }
  }

  // ── NAVIGASJONSBJELKE ─────────────────────────────────────────
  // Viser innlogget bruker øverst på siden om inkludert
  function visInnloggetBruker() {
    var elev = hentElev();
    if (!elev) return;

    var wrap = document.getElementById('skaplab-bruker-strip');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'skaplab-bruker-strip';
      wrap.style.cssText =
        'position:fixed;bottom:0;left:0;right:0;z-index:1000;' +
        'background:rgba(10,14,28,0.95);border-top:1px solid rgba(255,255,255,0.1);' +
        'padding:6px 16px;display:flex;align-items:center;gap:12px;' +
        'font-family:DM Sans,sans-serif;font-size:.75rem;color:rgba(255,255,255,0.6);';
      document.body.appendChild(wrap);
    }

    var skoleNavn = (elev.klasser && elev.klasser.skoler)
      ? elev.klasser.skoler.navn : '';
    var klasseNavn = elev.klasser ? elev.klasser.navn : '';

    wrap.innerHTML =
      '<span>👤 <strong style="color:#fff">' + (elev.fullt_navn || 'Elev') + '</strong>' +
      (klasseNavn ? ' · ' + klasseNavn : '') +
      (skoleNavn ? ' · ' + skoleNavn : '') + '</span>' +
      '<span style="flex:1"></span>' +
      '<a href="elev_portal.html" style="color:#60a5fa;text-decoration:none;">Min side</a>' +
      '<button onclick="SkapLab.elevLoggUt();location.reload();" ' +
      'style="background:none;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.5);' +
      'padding:3px 10px;border-radius:6px;cursor:pointer;font-size:.72rem;">Logg ut</button>';
  }

  // Kjør automatisk ved sideinnlasting
  document.addEventListener('DOMContentLoaded', visInnloggetBruker);

  // ── EKSPORTER ─────────────────────────────────────────────────
  window.SkapLab = {
    // Elev
    elevLoggInn:       elevLoggInn,
    elevLoggUt:        elevLoggUt,
    hentElev:          hentElev,
    erElevInnlogget:   erElevInnlogget,
    // Lærer
    laererLoggInn:     laererLoggInn,
    laererLoggUt:      laererLoggUt,
    hentLaerer:        hentLaerer,
    erLaererInnlogget: erLaererInnlogget,
    // Sporing
    loggAktivitet:     loggAktivitet,
    // Internals (for dashboard)
    _api:  API,
    _hdr:  hdr,
    _get:  get,
    _post: post,
    _patch: patch,
    SUPABASE_URL: SUPABASE_URL,
    SUPABASE_KEY: SUPABASE_KEY
  };

})();
