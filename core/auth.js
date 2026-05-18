/**
 * SkapLab – auth.js  v2
 * Sesjonshåndtering for lærere og elever.
 *
 * Eksporterer:
 *   Auth.laerer.hent()      → { session } eller kaster AuthFeil
 *   Auth.laerer.token()     → access_token (refreshes ved behov)
 *   Auth.laerer.loggUt()
 *   Auth.laerer.loggInn(epost, passord)
 *   Auth.laerer.registrer(epost, passord, fullt_navn, skole_id)
 *
 *   Auth.elev.hent()        → elevdata eller kaster AuthFeil
 *   Auth.elev.loggInn(kode) → elevdata
 *   Auth.elev.loggUt()
 *   Auth.elev.erInnlogget() → boolean
 *
 * Config injiseres via window.SKAPLAB_CONFIG:
 *   { url, key }
 */

(function () {
  'use strict';

  /* ── Konfigurasjon ──────────────────────────────────────── */
  const CFG = () => {
    if (!window.SKAPLAB_CONFIG) throw new Error('SKAPLAB_CONFIG mangler');
    return window.SKAPLAB_CONFIG;
  };

  /* ── Nøkler i localStorage ──────────────────────────────── */
  const LAERER_KEY = 'skaplab_laerer_v2';
  const ELEV_KEY   = 'skaplab_elev';

  /* ── Feilklasse ─────────────────────────────────────────── */
  class AuthFeil extends Error {
    constructor(melding, type = 'ukjent') {
      super(melding);
      this.name = 'AuthFeil';
      this.type = type; // 'utlopt' | 'ingen_sesjon' | 'nettverk' | 'server'
    }
  }

  /* ── Hjelpefunksjoner ───────────────────────────────────── */

  /** Dekoder JWT payload (uten verifikasjon – vi stoler på Supabase) */
  function dekodeJwt(token) {
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(b64));
    } catch {
      return null;
    }
  }

  /** Sjekker om token utløper innen 60 sekunder */
  function erTokenNaerUtlop(session) {
    if (!session?.access_token) return true;
    const payload = dekodeJwt(session.access_token);
    if (!payload?.exp) return true;
    return payload.exp - Math.floor(Date.now() / 1000) < 60;
  }

  /** Henter og validerer JWT user ID */
  function hentUidFraToken(token) {
    const p = dekodeJwt(token);
    return p?.sub ?? null;
  }

  /* ── Pågående refresh-løfte (for å unngå race conditions) ── */
  let _laererRefreshLofte = null;

  /* ══════════════════════════════════════════════════════════
     LÆRER
  ══════════════════════════════════════════════════════════ */
  const laerer = {

    /** Leser sesjon fra localStorage. Kaster AuthFeil om ugyldig. */
    hent() {
      const raa = localStorage.getItem(LAERER_KEY);
      if (!raa) throw new AuthFeil('Ingen lærersesjon', 'ingen_sesjon');
      let s;
      try { s = JSON.parse(raa); } catch {
        localStorage.removeItem(LAERER_KEY);
        throw new AuthFeil('Korrupt sesjon', 'ingen_sesjon');
      }
      if (!s?.access_token || !s?.refresh_token) {
        localStorage.removeItem(LAERER_KEY);
        throw new AuthFeil('Ugyldig sesjon', 'ingen_sesjon');
      }
      return s;
    },

    /** Returnerer et gyldig access_token. Refresher automatisk om nødvendig. */
    async token() {
      let s = laerer.hent(); // kaster om ingen sesjon

      if (!erTokenNaerUtlop(s)) {
        return s.access_token;
      }

      // Unngå parallelle refresh-kall
      if (_laererRefreshLofte) return _laererRefreshLofte;

      _laererRefreshLofte = (async () => {
        try {
          const { url, key } = CFG();
          const resp = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
            method: 'POST',
            headers: { 'apikey': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: s.refresh_token }),
          });

          if (resp.status === 401) {
            localStorage.removeItem(LAERER_KEY);
            throw new AuthFeil('Sesjonen er utløpt. Logg inn på nytt.', 'utlopt');
          }
          if (!resp.ok) {
            throw new AuthFeil('Nettverksfeil ved tokenfornyelse', 'nettverk');
          }

          const ny = await resp.json();
          if (!ny?.access_token) {
            localStorage.removeItem(LAERER_KEY);
            throw new AuthFeil('Ugyldig tokenrespons', 'server');
          }

          localStorage.setItem(LAERER_KEY, JSON.stringify(ny));
          return ny.access_token;
        } finally {
          _laererRefreshLofte = null;
        }
      })();

      return _laererRefreshLofte;
    },

    /** Henter brukerens Supabase-UUID fra gjeldende token. */
    async uid() {
      const t = await laerer.token();
      return hentUidFraToken(t);
    },

    /** Logger inn lærer med epost + passord. Lagrer sesjon. */
    async loggInn(epost, passord) {
      const { url, key } = CFG();
      const resp = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: epost, password: passord }),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.access_token) {
        throw new AuthFeil(data?.error_description || data?.msg || 'Innlogging feilet', 'server');
      }
      localStorage.setItem(LAERER_KEY, JSON.stringify(data));
      return data;
    },

    /** Registrerer ny lærer. Kjører trigger i Supabase automatisk. */
    async registrer(epost, passord, fullt_navn, skole_id) {
      const { url, key } = CFG();
      const resp = await fetch(`${url}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'apikey': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: epost,
          password: passord,
          data: { fullt_navn, skole_id },
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new AuthFeil(data?.error_description || data?.msg || 'Registrering feilet', 'server');
      }
      return data;
    },

    /** Logger ut og fjerner sesjon. */
    async loggUt() {
      try {
        const { url, key } = CFG();
        const t = laerer.hent().access_token;
        await fetch(`${url}/auth/v1/logout`, {
          method: 'POST',
          headers: { 'apikey': key, 'Authorization': `Bearer ${t}` },
        });
      } catch { /* Logg ut lokalt uansett */ }
      localStorage.removeItem(LAERER_KEY);
    },

    erInnlogget() {
      try { laerer.hent(); return true; } catch { return false; }
    },
  };

  /* ══════════════════════════════════════════════════════════
     ELEV
     Elever bruker ikke JWT – de autentiseres med 6-sifret kode
     mot elever-tabellen og lagrer rå elevdata i localStorage.
  ══════════════════════════════════════════════════════════ */

  const ELEV_SESJON_MS = 8 * 60 * 60 * 1000; // 8 timer

  const elev = {

    /** Leser elev-sesjon fra localStorage. Kaster AuthFeil om utløpt/ugyldig. */
    hent() {
      const raa = localStorage.getItem(ELEV_KEY);
      if (!raa) throw new AuthFeil('Ingen elevsesjon', 'ingen_sesjon');
      let e;
      try { e = JSON.parse(raa); } catch {
        localStorage.removeItem(ELEV_KEY);
        throw new AuthFeil('Korrupt elevsesjon', 'ingen_sesjon');
      }
      if (!e?.id || !e?._lagret) {
        localStorage.removeItem(ELEV_KEY);
        throw new AuthFeil('Ugyldig elevsesjon', 'ingen_sesjon');
      }
      if (Date.now() - e._lagret > ELEV_SESJON_MS) {
        localStorage.removeItem(ELEV_KEY);
        throw new AuthFeil('Elevsesjonen er utløpt (8 timer)', 'utlopt');
      }
      return e;
    },

    erInnlogget() {
      try { elev.hent(); return true; } catch { return false; }
    },

    /** Logger inn elev med 6-sifret kode. Lagrer sesjon. */
    async loggInn(kode) {
      const { url, key } = CFG();
      const resp = await fetch(
        `${url}/rest/v1/elever?innloggingskode=eq.${encodeURIComponent(kode)}&select=*,klasser(navn,skoler(navn))&limit=1`,
        { headers: { 'apikey': key, 'Content-Type': 'application/json' } }
      );
      if (!resp.ok) throw new AuthFeil('Nettverksfeil', 'nettverk');
      const data = await resp.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new AuthFeil('Ukjent innloggingskode', 'server');
      }
      const elevData = { ...data[0], _lagret: Date.now() };
      localStorage.setItem(ELEV_KEY, JSON.stringify(elevData));
      return elevData;
    },

    loggUt() {
      localStorage.removeItem(ELEV_KEY);
    },
  };

  /* ── Eksporter til window ───────────────────────────────── */
  window.Auth = { laerer, elev, AuthFeil };

})();
