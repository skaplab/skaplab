-- ═══════════════════════════════════════════════════════════════
-- OPPGAVETILDELING - kjøres i Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Legg til fremgangsfelt i aktivitet-tabellen
ALTER TABLE aktivitet 
  ADD COLUMN IF NOT EXISTS fullfort_antall INTEGER,
  ADD COLUMN IF NOT EXISTS totalt_antall   INTEGER;

-- Oppgavetabell (alle ressurser på SkapLab)
CREATE TABLE IF NOT EXISTS oppgaver (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tittel  TEXT NOT NULL,
  type    TEXT NOT NULL,
  ressurs TEXT NOT NULL,
  url     TEXT NOT NULL,
  km_kode TEXT REFERENCES kompetansemaal(kode),
  fag     TEXT NOT NULL
);

-- Tildelinger (lærer → elev/klasse)
CREATE TABLE IF NOT EXISTS tildeling (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oppgave_id UUID NOT NULL REFERENCES oppgaver(id),
  laerer_id  UUID NOT NULL REFERENCES laerere(id),
  elev_id    UUID REFERENCES elever(id),
  klasse_id  UUID REFERENCES klasser(id),
  frist      DATE,
  opprettet  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE oppgaver ENABLE ROW LEVEL SECURITY;
ALTER TABLE tildeling ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "oppgaver_les_alle" ON oppgaver FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "tildeling_les_laerer" ON tildeling
  FOR SELECT USING (laerer_id = auth.uid());
CREATE POLICY IF NOT EXISTS "tildeling_skriv_laerer" ON tildeling
  FOR INSERT WITH CHECK (laerer_id = auth.uid());
CREATE POLICY IF NOT EXISTS "tildeling_slett_laerer" ON tildeling
  FOR DELETE USING (laerer_id = auth.uid());
CREATE POLICY IF NOT EXISTS "tildeling_les_elev" ON tildeling
  FOR SELECT USING (
    elev_id IN (SELECT id FROM elever WHERE innloggingskode IS NOT NULL)
  );

-- Fyll inn alle oppgaver
INSERT INTO oppgaver (tittel, type, ressurs, url, km_kode, fag) VALUES
  -- ── MATEMATIKK - SPILL ──────────────────────────────────────
  ('Mattequiz',            'spill', 'mattequiz',      'mattequiz.html',      'MAT-ALG',  'Matematikk'),
  ('Matematikklabyrinten', 'spill', 'matte_labyrint', 'matte_labyrint.html', 'MAT-ALG',  'Matematikk'),
  ('Kanonkule',            'spill', 'kanon',          'kanon.html',          'MAT-FUNK', 'Matematikk'),
  ('Romferge',             'spill', 'romferge',       'romferge.html',       'MAT-FUNK', 'Matematikk'),
  ('Battleships',          'spill', 'battleships',    'battleships.html',    'MAT-GEO',  'Matematikk'),
  -- ── MATEMATIKK - TEORIKORT ──────────────────────────────────
  ('Algebra - teorikort',          'teorikort', 'flash_algebra',       'matte_flash_algebra.html',       'MAT-ALG',  'Matematikk'),
  ('Funksjoner - teorikort',       'teorikort', 'flash_funksjoner',    'matte_flash_funksjoner.html',    'MAT-FUNK', 'Matematikk'),
  ('Geometri - teorikort',         'teorikort', 'flash_geometri',      'matte_flash_geometri.html',      'MAT-GEO',  'Matematikk'),
  ('Sannsynlighet - teorikort',    'teorikort', 'flash_sannsynlighet', 'matte_flash_sannsynlighet.html', 'MAT-STAT', 'Matematikk'),
  ('Økonomi - teorikort',          'teorikort', 'flash_okonomi',       'matte_flash_økonomi.html',       'MAT-OKO',  'Matematikk'),
  ('Matematikere - teorikort',     'teorikort', 'flash_matematikere',  'matte_flash_matematikere.html',  'MAT-ALG',  'Matematikk'),
  -- ── MATEMATIKK - LEKSJONER ──────────────────────────────────
  ('Algebra - uttrykk',            'leksjon', 'leksjon_alg_uttrykk', 'matte_algebra_uttrykk.html',     'MAT-ALG',  'Matematikk'),
  ('Algebra - parenteser',         'leksjon', 'leksjon_alg_paren',   'matte_algebra_parenteser.html',  'MAT-ALG',  'Matematikk'),
  ('Algebra - polynomer',          'leksjon', 'leksjon_alg_poly',    'matte_algebra_polynomer.html',   'MAT-ALG',  'Matematikk'),
  ('Lineære funksjoner',           'leksjon', 'leksjon_lin_funk',    'matte_lineare_funksjoner.html',  'MAT-FUNK', 'Matematikk'),
  ('Geometri - leksjon',           'leksjon', 'leksjon_geometri',    'geometri.html',                  'MAT-GEO',  'Matematikk'),
  ('Statistikk - leksjon',         'leksjon', 'leksjon_statistikk',  'statistikk.html',                'MAT-STAT', 'Matematikk'),
  ('Eksamenstrener',               'leksjon', 'eksamenstrener',      'eksamenstrener.html',            'MAT-ALG',  'Matematikk'),
  -- ── MATEMATIKK - MENGDETRENING ──────────────────────────────
  ('Algebra - algebraiske uttrykk','mengde', 'matte_mengde_algebra_uttrykk',    'matte_mengde_algebra_uttrykk.html',    'MAT-ALG',  'Matematikk'),
  ('Algebra - parenteser',         'mengde', 'matte_mengde_algebra_parenteser', 'matte_mengde_algebra_parenteser.html', 'MAT-ALG',  'Matematikk'),
  ('Algebra - polynomer',          'mengde', 'matte_mengde_algebra_polynomer',  'matte_mengde_algebra_polynomer.html',  'MAT-ALG',  'Matematikk'),
  ('Funksjoner - lineære',         'mengde', 'matte_mengde_funk_lineær',        'matte_mengde_funk_lineær.html',        'MAT-FUNK', 'Matematikk'),
  ('Funksjoner - kvadratiske',     'mengde', 'matte_mengde_funk_kvadratisk',    'matte_mengde_funk_kvadratisk.html',    'MAT-FUNK', 'Matematikk'),
  ('Geometri - areal',             'mengde', 'matte_mengde_geo_areal',          'matte_mengde_geo_areal.html',          'MAT-GEO',  'Matematikk'),
  ('Geometri - Pythagoras',        'mengde', 'matte_mengde_geo_pythagoras',     'matte_mengde_geo_pythagoras.html',     'MAT-GEO',  'Matematikk'),
  ('Geometri - trigonometri',      'mengde', 'matte_mengde_geo_trigonometri',   'matte_mengde_geo_trigonometri.html',   'MAT-GEO',  'Matematikk'),
  ('Geometri - volum',             'mengde', 'matte_mengde_geo_volum',          'matte_mengde_geo_volum.html',          'MAT-GEO',  'Matematikk'),
  ('Sannsynlighet - grunnleggende','mengde', 'matte_mengde_sann_grunnleggende', 'matte_mengde_sann_grunnleggende.html', 'MAT-STAT', 'Matematikk'),
  ('Statistikk - diagrammer',      'mengde', 'matte_mengde_stat_diagrammer',    'matte_mengde_stat_diagrammer.html',    'MAT-STAT', 'Matematikk'),
  ('Økonomi - renter',             'mengde', 'matte_mengde_øk_renter',          'matte_mengde_øk_renter.html',          'MAT-OKO',  'Matematikk'),
  ('Økonomi - budsjett',           'mengde', 'matte_mengde_øk_budsjett',        'matte_mengde_øk_budsjett.html',        'MAT-OKO',  'Matematikk'),
  ('Likninger - lineære',          'mengde', 'matte_mengde_likninger_linja',    'matte_mengde_likninger_linja.html',    'MAT-ALG',  'Matematikk'),
  ('Brøk og regning',              'mengde', 'matte_mengde_brøk_regning',       'matte_mengde_brøk_regning.html',       'MAT-ALG',  'Matematikk'),
  -- ── NATURFAG - SPILL ────────────────────────────────────────
  ('Naturfagquiz',         'spill', 'naturfagquiz',   'naturfagquiz.html',   'NAT-BIO', 'Naturfag'),
  ('Kjemilaben',           'spill', 'kjemi',          'kjemi.html',          'NAT-KJE', 'Naturfag'),
  ('Strømlaben',           'spill', 'krets_spill',    'krets_spill.html',    'NAT-ELE', 'Naturfag'),
  ('Mikroskoplaben',       'spill', 'mikroskop',      'mikroskop.html',      'NAT-BIO', 'Naturfag'),
  ('Genetikklaben',        'spill', 'genetikk_spill', 'genetikk_spill.html', 'NAT-GEN', 'Naturfag'),
  ('Kraft og bevegelse',   'spill', 'fysikk',         'fysikk.html',         'NAT-FYS', 'Naturfag'),
  ('Kjemiske bindinger',   'spill', 'kjemiske_bindinger',  'kjemiske_bindinger.html',  'NAT-KJE', 'Naturfag'),
  ('Kjemiske reaksjoner',  'spill', 'kjemiske_reaksjoner', 'kjemiske_reaksjoner.html', 'NAT-KJE', 'Naturfag'),
  ('Organisk kjemi',       'spill', 'organisk_kjemi', 'organisk_kjemi.html', 'NAT-KJE', 'Naturfag'),
  -- ── NATURFAG - TEORIKORT ────────────────────────────────────
  ('Biologi - flipcards',      'teorikort', 'flipcard_bio', 'bio_flipcards.html',  'NAT-BIO', 'Naturfag'),
  ('Fysikk - flipcards',       'teorikort', 'flipcard_fys', 'fys_flipcards.html',  'NAT-FYS', 'Naturfag'),
  ('Kjemi - flipcards',        'teorikort', 'flipcard_kje', 'kje_flipcards.html',  'NAT-KJE', 'Naturfag'),
  ('Elektrisitet - flipcards', 'teorikort', 'flipcard_ele', 'ele_flipcards.html',  'NAT-ELE', 'Naturfag'),
  ('Økologi - flipcards',      'teorikort', 'flipcard_oko', 'oko_flipcards.html',  'NAT-OKO', 'Naturfag'),
  ('Vitenskapspersoner',       'teorikort', 'vitenskapspersoner', 'vitenskapspersoner.html', 'NAT-BIO', 'Naturfag'),
  -- ── NATURFAG - LEKSJONER ────────────────────────────────────
  ('Cellen',               'leksjon', 'celle',            'celle.html',           'NAT-BIO', 'Naturfag'),
  ('Cellebiologi',         'leksjon', 'cellebiologi',     'cellebiologi.html',    'NAT-BIO', 'Naturfag'),
  ('Hjertet',              'leksjon', 'hjertet',          'hjertet.html',         'NAT-BIO', 'Naturfag'),
  ('Nervesystemet',        'leksjon', 'nervesystemet',    'nervesystemet.html',   'NAT-BIO', 'Naturfag'),
  ('Evolusjon',            'leksjon', 'evolusjon',        'evolusjon.html',       'NAT-BIO', 'Naturfag'),
  ('Atom',                 'leksjon', 'atom',             'atom.html',            'NAT-KJE', 'Naturfag'),
  ('Periodesystemet',      'leksjon', 'periodesystem',    'periodesystem.html',   'NAT-KJE', 'Naturfag'),
  ('Astronomi',            'leksjon', 'astronomi',        'astronomi.html',       'NAT-FYS', 'Naturfag'),
  ('Kontinentaldrift',     'leksjon', 'kontinentaldrift', 'kontinentaldrift.html','NAT-FYS', 'Naturfag'),
  -- ── NATURFAG - QUIZ ─────────────────────────────────────────
  ('Quiz - Atom',              'quiz', 'nq_atom',          'natur_quiz_atom.html',              'NAT-KJE', 'Naturfag'),
  ('Quiz - Astronomi',         'quiz', 'nq_astronomi',     'natur_quiz_astronomi.html',         'NAT-FYS', 'Naturfag'),
  ('Quiz - Genetikk',          'quiz', 'nq_genetikk',      'natur_quiz_genetikk.html',          'NAT-GEN', 'Naturfag'),
  ('Quiz - Syre/base',         'quiz', 'nq_syre_base',     'natur_quiz_syr_base_ph.html',       'NAT-KJE', 'Naturfag'),
  ('Quiz - Elektrisitet',      'quiz', 'nq_elektrisitet',  'natur_quiz_elektrisitetsteori.html','NAT-ELE', 'Naturfag'),
  ('Quiz - Krefter',           'quiz', 'nq_krefter',       'natur_quiz_krefter_bevegelse.html', 'NAT-FYS', 'Naturfag'),
  -- ── PROGRAMMERING ───────────────────────────────────────────
  ('Debug-rommet',         'spill', 'debugrommet',         'debugrommet.html',         'PRG-DEBUG', 'Programmering'),
  ('Pseudokode-byggeren',  'spill', 'pseudokode',          'pseudokode.html',          'PRG-ALG',   'Programmering'),
  ('Algoritmedetektiven',  'spill', 'algoritmedetektiven', 'algoritmedetektiven.html', 'PRG-ALG',   'Programmering'),
  ('Labyrintkoden',        'spill', 'labyrint_kode',       'labyrint_kode.html',       'PRG-DEBUG', 'Programmering'),
  ('Programmering - intro','leksjon','programmering_intro','programmering.html',       'PRG-ALG',   'Programmering'),
  -- ── UTFORSK ─────────────────────────────────────────────────
  ('Tidsmaskinen',         'spill', 'tidsmaskinen',  'tidsmaskinen.html',  'MAT-ALG',  'Matematikk'),
  ('Verden Rundt',         'spill', 'verden_rundt',  'verden_rundt.html',  'MAT-GEO',  'Matematikk')
ON CONFLICT DO NOTHING;
