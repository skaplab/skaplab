-- ══════════════════════════════════════════════
-- EGENVURDERING OG LYSPÆRE
-- Kjøres i Supabase SQL Editor
-- ══════════════════════════════════════════════

-- Egenvurdering per KM
CREATE TABLE IF NOT EXISTS elev_egenvurdering (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elev_id    UUID NOT NULL REFERENCES elever(id),
  km_kode    TEXT NOT NULL,
  nivaa      TEXT NOT NULL CHECK (nivaa IN ('lav','middels','hoy','vet_ikke')),
  oppdatert  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(elev_id, km_kode)
);

ALTER TABLE elev_egenvurdering ENABLE ROW LEVEL SECURITY;

CREATE POLICY "elev_egenvurdering_les_selv" ON elev_egenvurdering
  FOR SELECT USING (true);

CREATE POLICY "elev_egenvurdering_skriv" ON elev_egenvurdering
  FOR INSERT WITH CHECK (true);

CREATE POLICY "elev_egenvurdering_oppdater" ON elev_egenvurdering
  FOR UPDATE USING (true);

-- Lyspære / hjelp-varsler
ALTER TABLE elever
  ADD COLUMN IF NOT EXISTS trenger_hjelp BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS hjelp_emne    TEXT;

-- Indeks for raskt oppslag
CREATE INDEX IF NOT EXISTS idx_egenvurdering_elev ON elev_egenvurdering(elev_id);
CREATE INDEX IF NOT EXISTS idx_egenvurdering_km ON elev_egenvurdering(km_kode);
