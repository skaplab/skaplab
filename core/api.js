/**
 * SkapLab – api.js  v2.1
 * Alle Supabase REST-kall med korrekte kolonnenavn fra DB.
 *
 * Kolonnenavn verifisert mot original kodebase:
 * - aktivitet:          tidspunkt, ressurs, score_pst, km_kode
 * - meldinger:          mottaker_id (for elev-fetch), elev_id (for lagring)
 * - vurderinger:        km_kode (ikke km), nivaa, oppdatert
 * - adaptiv_progresjon: xp, nivaa, beste_nivaa, streak_riktig, score_pst
 * - elever:             innloggingskode, trenger_hjelp, hjelp_emne, foresatt_token
 * - klasser:            trinn, aarsplan_matte_8/9/10, aarsplan_nat_8/9/10
 */

(function () {
  'use strict';

  /* ── Lav-nivå HTTP-hjelper ──────────────────────────────── */
  async function kall(sti, opts = {}, auth = 'laerer') {
    const { url, key } = window.SKAPLAB_CONFIG;
    const headers = {
      'apikey': key,
      'Content-Type': 'application/json',
      ...opts.headers,
    };
    if (auth === 'laerer') {
      const token = await window.Auth.laerer.token();
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${key}`;
    }
    if (opts.prefer) { headers['Prefer'] = opts.prefer; delete opts.prefer; }

    const resp = await fetch(`${url}/rest/v1${sti}`, {
      ...opts,
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    if (resp.status === 204) return null;
    let data;
    try { data = await resp.json(); } catch { data = null; }
    if (!resp.ok) {
      const feil = new Error(data?.message || data?.error || `HTTP ${resp.status}`);
      feil.status = resp.status;
      feil.data = data;
      throw feil;
    }
    return data;
  }

  // Kortformer
  const GET    = (sti, h)       => kall(sti, { method:'GET', headers:h });
  const ANON   = (sti)          => kall(sti, { method:'GET' }, 'anon');
  const POST   = (sti, body, p) => kall(sti, { method:'POST', body, prefer: p });
  const PATCH  = (sti, body)    => kall(sti, { method:'PATCH', body, prefer:'return=minimal' });
  const DELETE = (sti)          => kall(sti, { method:'DELETE' });

  /* ══════════════════════════════════════════════════════════
     SKOLER
  ══════════════════════════════════════════════════════════ */
  const skoler = {
    hentAlle: () =>
      ANON('/skoler?aktiv=eq.true&order=navn&select=id,navn,kommune,fylke'),
    hentAlleInkludertInaktive: () =>
      GET('/skoler?order=opprettet.desc&select=id,navn,kommune,fylke,aktiv,opprettet'),
    opprett: (data) =>
      POST('/skoler', data, 'return=representation'),
    oppdater: (id, data) =>
      PATCH(`/skoler?id=eq.${id}`, data),
  };

  /* ══════════════════════════════════════════════════════════
     LÆRERE
  ══════════════════════════════════════════════════════════ */
  const laerere = {
    hentEn: (id) =>
      GET(`/laerere?id=eq.${id}&select=id,fullt_navn,epost,skole_id,er_admin`),
    hentAlle: () =>
      GET('/laerere?select=id,fullt_navn,epost,skole_id,er_admin,opprettet&order=opprettet.desc'),
    oppdater: (id, data) =>
      PATCH(`/laerere?id=eq.${id}`, data),
  };

  /* ══════════════════════════════════════════════════════════
     KLASSER
  ══════════════════════════════════════════════════════════ */
  const klasser = {
    hentForLaerer: (laererId) =>
      GET(`/klasser?laerer_id=eq.${laererId}&order=navn&select=id,navn,laerer_id,skole_id,trinn`),
    hentEn: (id) =>
      GET(`/klasser?id=eq.${id}&select=*`),
    hentMedAarsplan: (id, fag, trinn) =>
      GET(`/klasser?id=eq.${id}&select=id,navn,aarsplan_${fag}_${trinn},aarsplan_oppgaver_cached`),
    opprett: (data) =>
      POST('/klasser', data, 'return=representation'),
    oppdater: (id, data) =>
      PATCH(`/klasser?id=eq.${id}`, data),
    lagreAarsplan: (id, fag, trinn, planData) =>
      PATCH(`/klasser?id=eq.${id}`, { [`aarsplan_${fag}_${trinn}`]: planData }),
    slett: (id) =>
      DELETE(`/klasser?id=eq.${id}`),
  };

  /* ══════════════════════════════════════════════════════════
     ELEVER
     Kolonner: id, fullt_navn, kallenavn, klasse_id,
               innloggingskode, aktiv, trenger_hjelp,
               hjelp_emne, foresatt_token, trinn
  ══════════════════════════════════════════════════════════ */
  const elever = {
    hentForKlasser: (klasseIds) => {
      const ids = klasseIds.join(',');
      return GET(
        `/elever?klasse_id=in.(${ids})&aktiv=eq.true&order=fullt_navn` +
        `&select=id,fullt_navn,kallenavn,innloggingskode,klasse_id,trenger_hjelp,hjelp_emne,foresatt_token`
      );
    },
    hentEn: (id) =>
      GET(`/elever?id=eq.${id}&select=*,klasser(navn,trinn,skoler(navn))`),
    opprett: (data) =>
      POST('/elever', data, 'return=representation'),
    oppdater: (id, data) =>
      PATCH(`/elever?id=eq.${id}`, data),
    settInaktiv: (id) =>
      PATCH(`/elever?id=eq.${id}`, { aktiv: false }),
    settHjelp: (id, trenger, emne = null) =>
      PATCH(`/elever?id=eq.${id}`, { trenger_hjelp: trenger, hjelp_emne: emne }),
    genererForesattToken: (id) => {
      // Generer UUID-lignende token
      const token = 'fp_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      return PATCH(`/elever?id=eq.${id}`, { foresatt_token: token })
        .then(() => token);
    },
  };

  /* ══════════════════════════════════════════════════════════
     AKTIVITET
     Kolonner: id, elev_id, ressurs, km_kode, score_pst,
               antall, riktige, tidspunkt
  ══════════════════════════════════════════════════════════ */
  const aktivitet = {
    hentForElev: (elevId, grense = 200) =>
      GET(`/aktivitet?elev_id=eq.${elevId}&order=tidspunkt.desc&limit=${grense}&select=ressurs,km_kode,score_pst,antall,riktige,tidspunkt`),
    hentAntall: (grense = 5000) =>
      GET(`/aktivitet?select=id,elev_id&limit=${grense}`),
    loggBesok: (data) =>
      POST('/aktivitet', data, 'return=minimal'),
  };

  /* ══════════════════════════════════════════════════════════
     ADAPTIV PROGRESJON
     Kolonner: elev_id, emne, xp, nivaa, beste_nivaa,
               streak_riktig, streak_beste
  ══════════════════════════════════════════════════════════ */
  const adaptiv = {
    hentProgresjonForElever: (elevIds) => {
      if (!elevIds.length) return Promise.resolve([]);
      const ids = elevIds.join(',');
      return GET(`/adaptiv_progresjon?elev_id=in.(${ids})&select=elev_id,emne,xp,nivaa,beste_nivaa,streak_riktig`);
    },
    hentForElev: (elevId) =>
      GET(`/adaptiv_progresjon?elev_id=eq.${elevId}&select=emne,xp,nivaa,beste_nivaa,streak_riktig&order=beste_nivaa.desc`),
    hentLoggForElev: (elevId, grense = 100) =>
      GET(`/adaptiv_logg?elev_id=eq.${elevId}&order=tidspunkt.desc&limit=${grense}&select=emne,resultat,xp,tidspunkt`),
    hentXpTotal: () =>
      GET('/adaptiv_progresjon?select=xp'),
    oppdater: (elevId, emne, data) =>
      PATCH(`/adaptiv_progresjon?elev_id=eq.${elevId}&emne=eq.${emne}`, data),
    opprett: (data) =>
      POST('/adaptiv_progresjon', data, 'return=minimal'),
    // Hent fra adaptiv oppgavebank (for prøvebygger)
    hentOppgavebank: (emne, grense = 50) =>
      ANON(`/oppgavebank?kilde=eq.adaptiv&emne=eq.${emne}&select=oppgave,type,fork,nivaa,alts,riktig,svar&limit=${grense}`),
  };

  /* ══════════════════════════════════════════════════════════
     MELDINGER
     Kolonner: id, elev_id, mottaker_id, laerer_id,
               tekst, fra, tidspunkt, lest, type
     NB: Elev fetcher med mottaker_id, sender med elev_id
  ══════════════════════════════════════════════════════════ */
  const meldinger = {
    // For elev: hent meldinger der eleven er mottaker
    hentForElev: (elevId) =>
      GET(`/meldinger?mottaker_id=eq.${elevId}&order=tidspunkt.desc&limit=60&select=*`),
    // For lærer: hent meldinger knyttet til elev
    hentTilLaerer: (laererId) =>
      GET(`/meldinger?laerer_id=eq.${laererId}&order=tidspunkt.desc&limit=100&select=*`),
    // Send melding fra lærer til elev
    sendFraLaerer: (elevId, laererId, tekst, type = 'tilbakemelding') =>
      POST('/meldinger', {
        elev_id: elevId,
        mottaker_id: elevId,
        laerer_id: laererId,
        tekst,
        fra: 'laerer',
        type,
        tidspunkt: new Date().toISOString(),
        lest: false,
      }, 'return=minimal'),
    // Send melding fra elev
    sendFraElev: (elevId, tekst) =>
      POST('/meldinger', {
        elev_id: elevId,
        mottaker_id: elevId,
        tekst,
        fra: 'elev',
        tidspunkt: new Date().toISOString(),
        lest: false,
      }, 'return=minimal'),
    markerLest: (id) =>
      PATCH(`/meldinger?id=eq.${id}`, { lest: true }),
    markerAlleLest: (mottakerId) =>
      PATCH(`/meldinger?mottaker_id=eq.${mottakerId}&lest=eq.false`, { lest: true }),
  };

  /* ══════════════════════════════════════════════════════════
     VURDERINGER
     Kolonner: id, elev_id, laerer_id, klasse_id,
               km_kode, nivaa, kommentar, dato, oppdatert
  ══════════════════════════════════════════════════════════ */
  const vurderinger = {
    hentForElev: (elevId) =>
      GET(`/vurderinger?elev_id=eq.${elevId}&order=oppdatert.desc&select=*`),
    hentForKlasse: (klasseId) =>
      GET(`/vurderinger?klasse_id=eq.${klasseId}&order=oppdatert.desc&select=*`),
    opprett: (data) =>
      POST('/vurderinger', {
        ...data,
        dato: data.dato || new Date().toISOString(),
        oppdatert: new Date().toISOString(),
      }, 'return=minimal'),
  };

  /* ══════════════════════════════════════════════════════════
     FERDIGHETSKART
  ══════════════════════════════════════════════════════════ */
  const ferdighetskart = {
    hentVurdering: (elevId) =>
      GET(`/ferdighetsvurdering?elev_id=eq.${elevId}&select=*`),
    lagreVurdering: (data) =>
      POST('/ferdighetsvurdering', data, 'return=minimal'),
    oppdaterVurdering: (elevId, data) =>
      PATCH(`/ferdighetsvurdering?elev_id=eq.${elevId}`, data),
    hentEgenvurdering: (elevId) =>
      GET(`/elev_egenvurdering?elev_id=eq.${elevId}&select=*`),
    lagreEgenvurdering: (data) =>
      POST('/elev_egenvurdering', data, 'return=minimal'),
    hentSendt: (elevId) =>
      GET(`/ferdighetskart_sendt?elev_id=eq.${elevId}&select=*`),
    markerSendt: (data) =>
      POST('/ferdighetskart_sendt', data, 'return=minimal'),
  };

  /* ══════════════════════════════════════════════════════════
     PRØVER
     Kolonner: id, laerer_id, klasse_id, tittel, fag,
               klasse, tid, info, km_koder, oppgaver,
               laerer_navn, skole, dato, delt
  ══════════════════════════════════════════════════════════ */
  const prover = {
    hentForLaerer: (laererId) =>
      GET(`/prover?laerer_id=eq.${laererId}&order=dato.desc&select=*`),
    hentDelte: (grense = 50) =>
      ANON(`/prover?delt=eq.true&order=dato.desc&limit=${grense}&select=id,tittel,fag,klasse,km_koder,laerer_navn,skole,dato,beskrivelse`),
    hentEn: (id) =>
      ANON(`/prover?id=eq.${id}&select=*`),
    opprett: (data) =>
      POST('/prover', data, 'return=representation'),
    oppdater: (id, data) =>
      PATCH(`/prover?id=eq.${id}`, data),
    slett: (id) =>
      DELETE(`/prover?id=eq.${id}`),
  };

  /* ══════════════════════════════════════════════════════════
     TILDELING
  ══════════════════════════════════════════════════════════ */
  const tildeling = {
    hentForKlasse: (klasseId) =>
      GET(`/tildeling?klasse_id=eq.${klasseId}&order=frist.asc&select=*`),
    hentForElev: (elevId) =>
      GET(`/tildeling?or=(elev_id.eq.${elevId})&order=frist.asc&select=*`),
    hentForElevOgKlasse: (elevId, klasseId) =>
      GET(`/tildeling?or=(elev_id.eq.${elevId},klasse_id.eq.${klasseId})&order=frist.asc&select=*`),
    opprett: (data) =>
      POST('/tildeling', data, 'return=minimal'),
    slett: (id) =>
      DELETE(`/tildeling?id=eq.${id}`),
  };

  /* ══════════════════════════════════════════════════════════
     OPPGAVEBANK (lærerens egne)
  ══════════════════════════════════════════════════════════ */
  const oppgavebank = {
    hentForLaerer: (laererId) =>
      GET(`/oppgavebank?laerer_id=eq.${laererId}&order=opprettet.desc&select=*`),
    opprett: (data) =>
      POST('/oppgavebank', data, 'return=representation'),
    oppdater: (id, data) =>
      PATCH(`/oppgavebank?id=eq.${id}`, data),
    slett: (id) =>
      DELETE(`/oppgavebank?id=eq.${id}`),
  };

  /* ══════════════════════════════════════════════════════════
     FEILRAPPORTER
  ══════════════════════════════════════════════════════════ */
  const feilrapporter = {
    hentAlle: (grense = 200) =>
      GET(`/feilrapporter?order=tidspunkt.desc&limit=${grense}&select=*`),
    oppdaterStatus: (id, status) =>
      PATCH(`/feilrapporter?id=eq.${id}`, { status }),
  };

  /* ── Eksporter ──────────────────────────────────────────── */
  window.Api = {
    skoler,
    laerere,
    klasser,
    elever,
    aktivitet,
    adaptiv,
    meldinger,
    vurderinger,
    ferdighetskart,
    prover,
    tildeling,
    oppgavebank,
    feilrapporter,
    _kall: kall,
  };

})();
