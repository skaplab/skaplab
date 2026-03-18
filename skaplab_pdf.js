/**
 * SkapLab PDF-generator
 * Genererer fagtunge, print-optimerte PDF-er fra naturfaghub-kortene.
 * Laster jsPDF dynamisk ved første bruk.
 */

(function(global) {
'use strict';

// ═══════════════════════════════════════════════════════
// ILLUSTRASJONER – statiske SVG-strenger per emne
// Hvert objekt: { svg: String, caption: String, width: Number (0-1 av tekstbredde) }
// ═══════════════════════════════════════════════════════
const ILLUSTRASJONER = {

'celle.html': [
{caption: 'Prokaryot vs. eukaryot celle', svg: `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="220" fill="#f8f9fa"/>
  <!-- Prokaryot -->
  <text x="130" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Prokaryot celle (bakterie)</text>
  <ellipse cx="130" cy="110" rx="110" ry="70" fill="#e8f5e9" stroke="#388e3c" stroke-width="1.5"/>
  <text x="130" y="84" text-anchor="middle" font-size="9" fill="#1b5e20">Cellemembran</text>
  <!-- Nukleoid -->
  <ellipse cx="115" cy="105" rx="30" ry="20" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="115" y="108" text-anchor="middle" font-size="8" fill="#1b5e20">Nukleoid</text>
  <text x="115" y="118" text-anchor="middle" font-size="8" fill="#1b5e20">(DNA)</text>
  <!-- Ribosom-prikker -->
  <circle cx="155" cy="98" r="3" fill="#43a047"/><circle cx="165" cy="110" r="3" fill="#43a047"/>
  <circle cx="148" cy="118" r="3" fill="#43a047"/><circle cx="170" cy="100" r="3" fill="#43a047"/>
  <text x="175" y="130" font-size="8" fill="#2e7d32">Ribosomer</text>
  <!-- Plasmid -->
  <ellipse cx="95" cy="128" rx="12" ry="8" fill="none" stroke="#1565c0" stroke-width="1" stroke-dasharray="2,2"/>
  <text x="95" y="148" text-anchor="middle" font-size="8" fill="#1565c0">Plasmid</text>
  <!-- Cellevegg -->
  <text x="35" y="115" font-size="8" fill="#e65100">Cellevegg</text>
  <!-- Flagell -->
  <path d="M 240,100 Q260,80 255,110 Q250,130 265,120" fill="none" stroke="#388e3c" stroke-width="1.5"/>
  <text x="248" y="145" font-size="8" fill="#1b5e20">Flagell</text>
  <!-- Ingen kjerne-note -->
  <text x="130" y="192" text-anchor="middle" font-size="9" fill="#c62828" font-style="italic">Ingen cellek­jerne · Ingen membran­bundne organeller</text>

  <!-- Eukaryot -->
  <text x="390" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Eukaryot celle (dyrecelle)</text>
  <ellipse cx="390" cy="110" rx="120" ry="85" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <!-- Kjerne -->
  <ellipse cx="375" cy="100" rx="38" ry="28" fill="#bbdefb" stroke="#0d47a1" stroke-width="1.5"/>
  <ellipse cx="375" cy="100" rx="38" ry="28" fill="none" stroke="#1565c0" stroke-width="3" stroke-dasharray="4,2" opacity="0.4"/>
  <text x="375" y="97" text-anchor="middle" font-size="9" font-weight="bold" fill="#0d47a1">Cellekjerne</text>
  <circle cx="375" cy="108" r="7" fill="#90caf9" stroke="#0d47a1" stroke-width="1"/>
  <text x="375" y="121" text-anchor="middle" font-size="7" fill="#0d47a1">Nukleolus</text>
  <!-- Mitokondrie -->
  <ellipse cx="430" cy="88" rx="22" ry="13" fill="#fff9c4" stroke="#f57f17" stroke-width="1.2"/>
  <path d="M418,88 Q424,82 430,88 Q436,94 442,88" fill="none" stroke="#f57f17" stroke-width="1"/>
  <text x="430" y="75" text-anchor="middle" font-size="8" fill="#e65100">Mito­kondrie</text>
  <!-- ER -->
  <path d="M350,128 Q365,120 380,130 Q395,140 410,128" fill="none" stroke="#7b1fa2" stroke-width="1.5"/>
  <text x="370" y="148" text-anchor="middle" font-size="8" fill="#7b1fa2">End. retikulum</text>
  <!-- Golgi -->
  <path d="M420,118 Q430,112 440,118" fill="none" stroke="#00695c" stroke-width="3"/>
  <path d="M422,123 Q432,117 442,123" fill="none" stroke="#00695c" stroke-width="3"/>
  <path d="M424,128 Q434,122 444,128" fill="none" stroke="#00695c" stroke-width="3"/>
  <text x="448" y="128" font-size="8" fill="#00695c">Golgi</text>
  <!-- Lysosom -->
  <circle cx="350" cy="78" r="9" fill="#ef9a9a" stroke="#c62828" stroke-width="1"/>
  <text x="338" y="68" font-size="8" fill="#c62828">Lyso­som</text>
  <!-- Ribosomer -->
  <circle cx="414" cy="108" r="2.5" fill="#43a047"/><circle cx="420" cy="114" r="2.5" fill="#43a047"/>
  <text x="390" y="192" text-anchor="middle" font-size="9" fill="#1565c0" font-style="italic">Cellek­jerne · Membran­bundne organeller · Eget DNA i kjerne</text>
</svg>`, width: 1.0},

{caption: 'Prokaryot: ingen kjerne, ringen er DNA direkte. Eukaryot: DNA pakket i cellekjerne omgitt av dobbel membran (kjernemembran).', svg: null, width: 1.0}
],

'fotosyntese.html': [
{caption: 'Fotosyntesens og celleåndingenes samlede reaksjoner', svg: `
<svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="180" fill="#f8fdf4"/>
  <!-- Fotosyntese -->
  <rect x="10" y="10" width="500" height="72" rx="8" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="260" y="30" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">Fotosyntese (kloroplasten)</text>
  <text x="260" y="52" text-anchor="middle" font-size="14" fill="#1b5e20">6CO₂  +  6H₂O  +  lys­energi  →  C₆H₁₂O₆  +  6O₂</text>
  <text x="70" y="70" text-anchor="middle" font-size="9" fill="#388e3c">karbondioksid</text>
  <text x="155" y="70" text-anchor="middle" font-size="9" fill="#388e3c">vann</text>
  <text x="255" y="70" text-anchor="middle" font-size="9" fill="#f57f17">sol­energi</text>
  <text x="365" y="70" text-anchor="middle" font-size="9" fill="#388e3c">glukose</text>
  <text x="460" y="70" text-anchor="middle" font-size="9" fill="#388e3c">oksygen</text>
  <!-- Pil ned -->
  <text x="260" y="104" text-anchor="middle" font-size="18" fill="#555">⇅</text>
  <text x="315" y="104" font-size="9" fill="#777" font-style="italic">speil­vendte reaksjoner</text>
  <!-- Celleånding -->
  <rect x="10" y="108" width="500" height="62" rx="8" fill="#fce4ec" stroke="#c62828" stroke-width="1.5"/>
  <text x="260" y="126" text-anchor="middle" font-size="11" font-weight="bold" fill="#b71c1c">Aerob celleånding (mitokondriet)</text>
  <text x="260" y="148" text-anchor="middle" font-size="14" fill="#b71c1c">C₆H₁₂O₆  +  6O₂  →  6CO₂  +  6H₂O  +  ATP</text>
  <text x="82" y="164" text-anchor="middle" font-size="9" fill="#c62828">glukose</text>
  <text x="168" y="164" text-anchor="middle" font-size="9" fill="#c62828">oksygen</text>
  <text x="340" y="164" text-anchor="middle" font-size="9" fill="#c62828">CO₂</text>
  <text x="410" y="164" text-anchor="middle" font-size="9" fill="#c62828">vann</text>
  <text x="470" y="164" text-anchor="middle" font-size="9" fill="#e65100">energi</text>
</svg>`, width: 1.0},

{caption: 'Kloroplasten – lystreaksjoner og Calvin-syklus', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#f8fdf4"/>
  <ellipse cx="260" cy="100" rx="240" ry="88" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>
  <text x="260" y="20" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">Kloroplasten</text>
  <!-- Thylakoid (flat disk) -->
  <ellipse cx="175" cy="100" rx="95" ry="55" fill="#c8e6c9" stroke="#388e3c" stroke-width="1.5"/>
  <ellipse cx="175" cy="100" rx="95" ry="55" fill="none" stroke="#43a047" stroke-width="3" stroke-dasharray="6,3" opacity="0.5"/>
  <text x="175" y="85" text-anchor="middle" font-size="10" font-weight="bold" fill="#1b5e20">Thylakoid</text>
  <text x="175" y="99" text-anchor="middle" font-size="9" fill="#2e7d32">Lys­reaksjoner</text>
  <text x="175" y="112" text-anchor="middle" font-size="8" fill="#388e3c">Lys → ATP + NADPH</text>
  <text x="175" y="124" text-anchor="middle" font-size="8" fill="#388e3c">H₂O → O₂  (fotol­yse)</text>
  <!-- Sol -->
  <text x="80" y="65" font-size="22" fill="#f9a825">☀</text>
  <path d="M102,72 L128,88" stroke="#f9a825" stroke-width="1.5" marker-end="url(#arr)"/>
  <!-- Stroma -->
  <rect x="300" y="60" width="155" height="80" rx="10" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="377" y="80" text-anchor="middle" font-size="10" font-weight="bold" fill="#1b5e20">Stroma</text>
  <text x="377" y="95" text-anchor="middle" font-size="9" fill="#2e7d32">Calvin-syklus</text>
  <text x="377" y="110" text-anchor="middle" font-size="8" fill="#1b5e20">CO₂ + ATP + NADPH</text>
  <text x="377" y="124" text-anchor="middle" font-size="8" fill="#1b5e20">→ G3P → Glukose</text>
  <!-- Pil fra thylakoid til stroma -->
  <path d="M272,95 L298,95" stroke="#1b5e20" stroke-width="1.5" marker-end="url(#arr)" fill="none"/>
  <text x="284" y="88" text-anchor="middle" font-size="8" fill="#e65100">ATP</text>
  <text x="284" y="106" text-anchor="middle" font-size="8" fill="#1565c0">NADPH</text>
  <!-- CO2 inn -->
  <text x="460" y="108" font-size="9" fill="#555">CO₂ →</text>
  <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#1b5e20" stroke-width="1.5"/></marker></defs>
  <!-- O2 ut -->
  <text x="66" y="155" font-size="9" fill="#1565c0">← O₂ ut</text>
</svg>`, width: 1.0}
],

'klima.html': [
{caption: 'Drivhuseffekten – naturlig og forsterket', svg: `
<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="230" fill="#e3f2fd"/>
  <!-- Atmosfære -->
  <ellipse cx="260" cy="60" rx="240" ry="45" fill="rgba(66,165,245,0.25)" stroke="#1565c0" stroke-width="1.5" stroke-dasharray="6,3"/>
  <text x="260" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="#0d47a1">Atmosfæren – drivhusgasser (CO₂, CH₄, H₂O, N₂O)</text>
  <!-- Jord -->
  <ellipse cx="260" cy="195" rx="240" ry="35" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="260" y="200" text-anchor="middle" font-size="11" fill="#1b5e20">Jordoverflaten</text>
  <!-- Sol -->
  <text x="30" y="55" font-size="28" fill="#f9a825">☀</text>
  <!-- Solstråling ned (korte bølger) -->
  <path d="M62,58 L175,158" stroke="#f9a825" stroke-width="2.5" marker-end="url(#arrs)"/>
  <text x="80" y="95" font-size="9" fill="#e65100" transform="rotate(42,80,95)">Kortbølge­stråling</text>
  <!-- Reflektert (ca 30%) -->
  <path d="M175,158 L95,75" stroke="#f9a825" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrs)"/>
  <text x="98" y="110" font-size="8" fill="#f57f17">~30% reflektert</text>
  <!-- Varmestråling opp fra bakken -->
  <path d="M280,160 L280,78" stroke="#f44336" stroke-width="2" marker-end="url(#arrs)"/>
  <text x="284" y="130" font-size="9" fill="#c62828">Lang­bølge­stråling</text>
  <!-- Absorbering i atmosfære -->
  <circle cx="280" cy="78" r="12" fill="rgba(244,67,54,0.3)" stroke="#f44336" stroke-width="1.5"/>
  <text x="297" y="74" font-size="9" fill="#c62828">Absorberes</text>
  <!-- Tilbake til bakken -->
  <path d="M290,92 L330,160" stroke="#f44336" stroke-width="2.5" marker-end="url(#arrs)"/>
  <text x="330" y="125" font-size="9" fill="#c62828" transform="rotate(-55,330,125)">Gjenuts­trål­ing</text>
  <!-- CO2-piler (menneskeskapt) -->
  <text x="420" y="80" font-size="18" fill="#555">🏭</text>
  <path d="M420,90 L380,72" stroke="#555" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#arrs)"/>
  <text x="425" y="115" font-size="8" fill="#555">Fossil­utslipp</text>
  <text x="425" y="127" font-size="8" fill="#c62828">↑ CO₂ → mer</text>
  <text x="425" y="139" font-size="8" fill="#c62828">gjenuts­trål­ing</text>
  <text x="425" y="151" font-size="8" fill="#c62828">→ oppvarming</text>
  <defs><marker id="arrs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <text x="260" y="222" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Forsterket drivhuseffekt: økte CO₂-nivåer absorberer mer langbølgestråling → høyere gjennomsnittstemperatur</text>
</svg>`, width: 1.0}
],

'atom.html': [
{caption: 'Bohr-modellen – hydrogen, karbon og oksygen', svg: `
<svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="180" fill="#fafafa"/>
  <!-- H -->
  <text x="80" y="20" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Hydrogen (H)</text>
  <text x="80" y="32" text-anchor="middle" font-size="9" fill="#555">Z=1, 1 elektron</text>
  <circle cx="80" cy="100" r="10" fill="#ef9a9a" stroke="#c62828" stroke-width="1.5"/>
  <text x="80" y="104" text-anchor="middle" font-size="9" font-weight="bold" fill="#c62828">p⁺</text>
  <circle cx="80" cy="100" r="42" fill="none" stroke="#1565c0" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="122" cy="100" r="5" fill="#1565c0"/>
  <text x="132" y="95" font-size="8" fill="#1565c0">e⁻</text>
  <!-- C -->
  <text x="265" y="20" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Karbon (C)</text>
  <text x="265" y="32" text-anchor="middle" font-size="9" fill="#555">Z=6, skall 2,4</text>
  <circle cx="265" cy="100" r="14" fill="#ffcc80" stroke="#e65100" stroke-width="1.5"/>
  <text x="265" y="104" text-anchor="middle" font-size="8" font-weight="bold" fill="#e65100">6p⁺ 6n</text>
  <circle cx="265" cy="100" r="34" fill="none" stroke="#1565c0" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="299" cy="100" r="4" fill="#1565c0"/>
  <circle cx="265" cy="66" r="4" fill="#1565c0"/>
  <circle cx="231" cy="100" r="4" fill="#1565c0"/>
  <circle cx="265" cy="134" r="4" fill="#1565c0"/>
  <text x="305" y="100" font-size="8" fill="#1565c0">K (2e⁻)</text>
  <circle cx="265" cy="100" r="58" fill="none" stroke="#43a047" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="323" cy="100" r="4" fill="#43a047"/>
  <circle cx="265" cy="42" r="4" fill="#43a047"/>
  <circle cx="207" cy="100" r="4" fill="#43a047"/>
  <circle cx="265" cy="158" r="4" fill="#43a047"/>
  <text x="328" y="140" font-size="8" fill="#43a047">L (4e⁻)</text>
  <!-- O -->
  <text x="430" y="20" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Oksygen (O)</text>
  <text x="430" y="32" text-anchor="middle" font-size="9" fill="#555">Z=8, skall 2,6</text>
  <circle cx="430" cy="100" r="14" fill="#ef9a9a" stroke="#c62828" stroke-width="1.5"/>
  <text x="430" y="104" text-anchor="middle" font-size="8" font-weight="bold" fill="#c62828">8p⁺ 8n</text>
  <circle cx="430" cy="100" r="34" fill="none" stroke="#1565c0" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="464" cy="100" r="4" fill="#1565c0"/>
  <circle cx="430" cy="66" r="4" fill="#1565c0"/>
  <circle cx="396" cy="100" r="4" fill="#1565c0"/>
  <circle cx="430" cy="134" r="4" fill="#1565c0"/>
  <text x="468" y="100" font-size="8" fill="#1565c0">K (2e⁻)</text>
  <circle cx="430" cy="100" r="54" fill="none" stroke="#43a047" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="484" cy="100" r="4" fill="#43a047"/><circle cx="376" cy="100" r="4" fill="#43a047"/>
  <circle cx="459" cy="73" r="4" fill="#43a047"/><circle cx="401" cy="73" r="4" fill="#43a047"/>
  <circle cx="459" cy="127" r="4" fill="#43a047"/><circle cx="401" cy="127" r="4" fill="#43a047"/>
  <text x="488" y="140" font-size="8" fill="#43a047">L (6e⁻)</text>
</svg>`, width: 1.0}
],

'kjemiske_bindinger.html': [
{caption: 'Lewis-strukturer og bindingstyper', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <!-- H2O -->
  <text x="80" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#1565c0">H₂O – bøyd (104,5°)</text>
  <circle cx="80" cy="90" r="18" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="80" y="94" text-anchor="middle" font-size="12" font-weight="bold" fill="#c62828">O</text>
  <circle cx="42" cy="120" r="13" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="42" y="124" text-anchor="middle" font-size="11" font-weight="bold" fill="#1565c0">H</text>
  <circle cx="118" cy="120" r="13" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="118" y="124" text-anchor="middle" font-size="11" font-weight="bold" fill="#1565c0">H</text>
  <line x1="63" y1="103" x2="54" y2="110" stroke="#333" stroke-width="2.5"/>
  <line x1="97" y1="103" x2="106" y2="110" stroke="#333" stroke-width="2.5"/>
  <!-- Ensomme par -->
  <text x="58" y="74" font-size="11" fill="#c62828">: :</text>
  <text x="80" y="60" text-anchor="middle" font-size="9" fill="#c62828">δ⁻</text>
  <text x="42" y="142" text-anchor="middle" font-size="9" fill="#1565c0">δ⁺</text>
  <text x="118" y="142" text-anchor="middle" font-size="9" fill="#1565c0">δ⁺</text>
  <text x="80" y="165" text-anchor="middle" font-size="9" fill="#555" font-style="italic">Polær – asymmetrisk form</text>
  <!-- CO2 -->
  <text x="270" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">CO₂ – lineær (180°)</text>
  <circle cx="230" cy="90" r="18" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="230" y="94" text-anchor="middle" font-size="11" font-weight="bold" fill="#c62828">O</text>
  <circle cx="270" cy="90" r="16" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <text x="270" y="94" text-anchor="middle" font-size="11" font-weight="bold" fill="#e65100">C</text>
  <circle cx="310" cy="90" r="18" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="310" y="94" text-anchor="middle" font-size="11" font-weight="bold" fill="#c62828">O</text>
  <!-- Dobbeltbindinger -->
  <line x1="248" y1="86" x2="254" y2="86" stroke="#333" stroke-width="2.5"/>
  <line x1="248" y1="94" x2="254" y2="94" stroke="#333" stroke-width="2.5"/>
  <line x1="286" y1="86" x2="292" y2="86" stroke="#333" stroke-width="2.5"/>
  <line x1="286" y1="94" x2="292" y2="94" stroke="#333" stroke-width="2.5"/>
  <text x="270" y="130" text-anchor="middle" font-size="9" fill="#e65100">= dobbelt­binding</text>
  <text x="270" y="145" text-anchor="middle" font-size="9" fill="#555" font-style="italic">Apolart – symmetrisk, dipoler kansellerer</text>
  <!-- NH3 -->
  <text x="435" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a1b9a">NH₃ – pyramidal (107°)</text>
  <circle cx="435" cy="80" r="17" fill="#e1bee7" stroke="#6a1b9a" stroke-width="1.5"/>
  <text x="435" y="84" text-anchor="middle" font-size="11" font-weight="bold" fill="#4a148c">N</text>
  <text x="427" y="62" font-size="11" fill="#6a1b9a">:</text>
  <circle cx="400" cy="115" r="13" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="400" y="119" text-anchor="middle" font-size="11" font-weight="bold" fill="#1565c0">H</text>
  <circle cx="435" cy="122" r="13" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="435" y="126" text-anchor="middle" font-size="11" font-weight="bold" fill="#1565c0">H</text>
  <circle cx="470" cy="115" r="13" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="470" y="119" text-anchor="middle" font-size="11" font-weight="bold" fill="#1565c0">H</text>
  <line x1="420" y1="93" x2="410" y2="106" stroke="#333" stroke-width="2"/>
  <line x1="435" y1="97" x2="435" y2="109" stroke="#333" stroke-width="2"/>
  <line x1="450" y1="93" x2="460" y2="106" stroke="#333" stroke-width="2"/>
  <text x="435" y="160" text-anchor="middle" font-size="9" fill="#555" font-style="italic">Polær – ensomt par gir pyramidal form</text>
</svg>`, width: 1.0}
],

'kjemiske_reaksjoner.html': [
{caption: 'Eksoterm og endoterm reaksjon – energidiagram', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <!-- Eksoterm -->
  <text x="125" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="#c62828">Eksoterm reaksjon (frigjør energi)</text>
  <line x1="20" y1="170" x2="240" y2="170" stroke="#888" stroke-width="1"/>
  <line x1="20" y1="20" x2="20" y2="175" stroke="#888" stroke-width="1"/>
  <text x="12" y="175" font-size="9" fill="#888">E</text>
  <!-- Reaktant-nivå -->
  <line x1="30" y1="70" x2="90" y2="70" stroke="#1565c0" stroke-width="2"/>
  <text x="25" y="67" font-size="9" fill="#1565c0">Reak­tant</text>
  <!-- Aktiveringsenergi topp -->
  <path d="M90,70 Q130,28 140,28 Q150,28 160,35 Q175,55 175,100" fill="none" stroke="#888" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="148" y="24" font-size="8" fill="#555">Ea</text>
  <!-- Produkt-nivå -->
  <line x1="175" y1="100" x2="230" y2="100" stroke="#c62828" stroke-width="2"/>
  <text x="220" y="96" font-size="9" fill="#c62828">Produkt</text>
  <!-- ΔH-pil -->
  <path d="M155,70 L155,100" stroke="#c62828" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#arrc)"/>
  <text x="160" y="88" font-size="9" fill="#c62828">−ΔH</text>
  <text x="125" y="188" text-anchor="middle" font-size="9" fill="#c62828" font-style="italic">Forbrenning, nøytralisering, rust</text>
  <text x="125" y="155" text-anchor="middle" font-size="9" fill="#555">→ Varme frigjøres til omgivelsene</text>
  <!-- Endoterm -->
  <text x="385" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">Endoterm reaksjon (krever energi)</text>
  <line x1="275" y1="170" x2="510" y2="170" stroke="#888" stroke-width="1"/>
  <line x1="275" y1="20" x2="275" y2="175" stroke="#888" stroke-width="1"/>
  <!-- Reaktant-nivå -->
  <line x1="285" y1="120" x2="345" y2="120" stroke="#c62828" stroke-width="2"/>
  <text x="280" y="117" font-size="9" fill="#c62828">Reak­tant</text>
  <!-- Topp -->
  <path d="M345,120 Q380,60 395,60 Q410,60 420,68 Q432,88 432,80" fill="none" stroke="#888" stroke-width="1.5" stroke-dasharray="4,3"/>
  <!-- Produkt-nivå -->
  <line x1="432" y1="80" x2="500" y2="80" stroke="#1b5e20" stroke-width="2"/>
  <text x="488" y="76" font-size="9" fill="#1b5e20">Produkt</text>
  <!-- ΔH-pil -->
  <path d="M415,120 L415,80" stroke="#1b5e20" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#arrc)"/>
  <text x="420" y="103" font-size="9" fill="#1b5e20">+ΔH</text>
  <text x="385" y="155" text-anchor="middle" font-size="9" fill="#555">← Varme absorberes fra omgivelsene</text>
  <text x="385" y="188" text-anchor="middle" font-size="9" fill="#1b5e20" font-style="italic">Fotosyntese, elektrolyse, kalkbrenning</text>
  <defs><marker id="arrc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <text x="110" y="44" font-size="8" fill="#555">Ea →</text>
</svg>`, width: 1.0}
],

'okologi.html': [
{caption: 'Næringspyramide og energioverføring', svg: `
<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="230" fill="#f8fdf4"/>
  <!-- Pyramide -->
  <polygon points="260,15 160,75 360,75" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <polygon points="160,75 110,135 410,135 360,75" fill="#c8e6c9" stroke="#388e3c" stroke-width="1.5"/>
  <polygon points="110,135 60,195 460,195 410,135" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1.5"/>
  <polygon points="60,195 20,220 500,220 460,195" fill="#81c784" stroke="#1b5e20" stroke-width="1.5"/>
  <!-- Labels -->
  <text x="260" y="52" text-anchor="middle" font-size="11" font-weight="bold" fill="#e65100">Topprov­dyr</text>
  <text x="260" y="63" text-anchor="middle" font-size="8" fill="#e65100">Ulv, ørn · ~0,1% av E</text>
  <text x="260" y="108" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">Sekund. konsum.</text>
  <text x="260" y="120" text-anchor="middle" font-size="8" fill="#1b5e20">Frosk, rev · ~1% av E</text>
  <text x="260" y="163" text-anchor="middle" font-size="11" font-weight="bold" fill="#2e7d32">Primær konsum.</text>
  <text x="260" y="175" text-anchor="middle" font-size="8" fill="#2e7d32">Insekter, hare · ~10% av E</text>
  <text x="260" y="210" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">Produsenter</text>
  <text x="260" y="220" text-anchor="middle" font-size="8" fill="#1b5e20">Planter, alger · 100% av E (sollys)</text>
  <!-- 10%-regel pil -->
  <text x="490" y="108" text-anchor="middle" font-size="10" fill="#c62828" transform="rotate(-90,490,108)">← 10% energi videre →</text>
  <text x="10" y="108" font-size="9" fill="#555" transform="rotate(-90,10,108)">90% varme­tap</text>
</svg>`, width: 1.0},

{caption: 'Nitrogenkretsløpet', svg: `
<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="240" fill="#f8fdf4"/>
  <text x="260" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">Nitrogenkretsløpet</text>
  <defs><marker id="arrn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <!-- N2 atmosfære -->
  <rect x="160" y="24" width="200" height="34" rx="8" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="260" y="45" text-anchor="middle" font-size="11" font-weight="bold" fill="#0d47a1">N₂ i atmosfæren (78%)</text>
  <!-- Nitrogenbinding -->
  <path d="M200,58 L170,100" stroke="#1b5e20" stroke-width="1.5" marker-end="url(#arrn)" fill="none"/>
  <text x="130" y="88" font-size="8" fill="#1b5e20">Nitrogen­binding</text>
  <text x="130" y="99" font-size="8" fill="#1b5e20">(Rhizobium)</text>
  <!-- NH4 -->
  <rect x="80" y="100" width="120" height="32" rx="6" fill="#e8f5e9" stroke="#388e3c" stroke-width="1.5"/>
  <text x="140" y="120" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">NH₄⁺ Ammonium</text>
  <!-- Nitrifikasjon -->
  <path d="M200,116 L300,116" stroke="#f57f17" stroke-width="1.5" marker-end="url(#arrn)" fill="none"/>
  <text x="250" y="111" text-anchor="middle" font-size="8" fill="#e65100">Nitrifikasjon</text>
  <text x="250" y="128" text-anchor="middle" font-size="8" fill="#e65100">(Nitrosomonas)</text>
  <!-- NO3 -->
  <rect x="310" y="100" width="120" height="32" rx="6" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <text x="370" y="120" text-anchor="middle" font-size="11" font-weight="bold" fill="#e65100">NO₃⁻ Nitrat</text>
  <!-- Planteopptak -->
  <path d="M370,132 L370,168" stroke="#2e7d32" stroke-width="1.5" marker-end="url(#arrn)" fill="none"/>
  <text x="382" y="158" font-size="8" fill="#1b5e20">Plante­opptak</text>
  <!-- Planter/Dyr -->
  <rect x="150" y="168" width="240" height="32" rx="6" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="270" y="188" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">Planter og dyr (organisk N)</text>
  <!-- Ammonifikasjon -->
  <path d="M150,184 L105,132" stroke="#6a1b9a" stroke-width="1.5" marker-end="url(#arrn)" fill="none"/>
  <text x="82" y="162" font-size="8" fill="#6a1b9a">Ammonifi-</text>
  <text x="82" y="172" font-size="8" fill="#6a1b9a">kasjon</text>
  <!-- Denitrifikasjon -->
  <path d="M320,58 L325,100" stroke="#c62828" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrn)" fill="none"/>
  <text x="330" y="80" font-size="8" fill="#c62828">Denitri-</text>
  <text x="330" y="90" font-size="8" fill="#c62828">fikasjon</text>
  <!-- Menneskelig inngrep -->
  <text x="30" y="210" font-size="8" fill="#c62828">⚠ Kunstgjødsel tilfører for mye N → eutrofiering</text>
</svg>`, width: 1.0}
],

'evolusjon.html': [
{caption: 'Forenklet kladogram – vertebrater (virveldyr)', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <defs><marker id="arre" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#555" stroke-width="1.5"/></marker></defs>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Vertebrat­fylogeni (forenklet)</text>
  <!-- Stamme -->
  <line x1="50" y1="175" x2="50" y2="100" stroke="#555" stroke-width="2.5"/>
  <!-- Grein 1: Fisk -->
  <line x1="50" y1="160" x2="120" y2="160" stroke="#555" stroke-width="2"/>
  <text x="85" y="155" font-size="9" fill="#1565c0">🐟</text>
  <text x="85" y="175" text-anchor="middle" font-size="9" fill="#1565c0">Fisk</text>
  <!-- Grein 2: Amfibier -->
  <line x1="50" y1="138" x2="165" y2="138" stroke="#555" stroke-width="2"/>
  <text x="130" y="133" font-size="9" fill="#2e7d32">🐸</text>
  <text x="130" y="152" text-anchor="middle" font-size="9" fill="#2e7d32">Amfibier</text>
  <!-- Felles -->
  <line x1="165" y1="138" x2="165" y2="80" stroke="#555" stroke-width="2"/>
  <!-- Grein 3: Krypdyr -->
  <line x1="165" y1="115" x2="255" y2="115" stroke="#555" stroke-width="2"/>
  <text x="215" y="110" font-size="9" fill="#e65100">🦎</text>
  <text x="215" y="130" text-anchor="middle" font-size="9" fill="#e65100">Krypdyr</text>
  <!-- Grein 4: Fugler -->
  <line x1="255" y1="115" x2="255" y2="68" stroke="#555" stroke-width="2"/>
  <line x1="255" y1="92" x2="330" y2="92" stroke="#555" stroke-width="2"/>
  <text x="295" y="87" font-size="9" fill="#6a1b9a">🐦</text>
  <text x="295" y="107" text-anchor="middle" font-size="9" fill="#6a1b9a">Fugler</text>
  <!-- Grein 5: Pattedyr -->
  <line x1="255" y1="68" x2="375" y2="68" stroke="#555" stroke-width="2.5"/>
  <text x="330" y="63" font-size="9" fill="#c62828">🐭 🐘 🧑</text>
  <text x="340" y="83" text-anchor="middle" font-size="9" fill="#c62828">Pattedyr</text>
  <!-- Tid-akse -->
  <line x1="20" y1="183" x2="490" y2="183" stroke="#888" stroke-width="1" marker-end="url(#arre)"/>
  <text x="490" y="196" font-size="9" fill="#888">Tid →</text>
  <text x="40" y="196" font-size="8" fill="#888">500 Ma</text>
  <text x="220" y="196" font-size="8" fill="#888">350 Ma</text>
  <text x="380" y="196" font-size="8" fill="#888">65 Ma</text>
  <!-- Felles stamfar note -->
  <text x="50" y="92" font-size="8" fill="#555">Felles</text>
  <text x="50" y="102" font-size="8" fill="#555">stamfar</text>
</svg>`, width: 1.0}
],

'kontinentaldrift.html': [
{caption: 'Pangea (~250 Ma) og dagens kontinenter', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#e3f2fd"/>
  <text x="130" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Pangea (~250 millioner år siden)</text>
  <text x="390" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">I dag</text>
  <!-- Pangea silhuett (forenklet) -->
  <path d="M 55,40 Q65,34 80,36 Q100,32 118,38 Q136,34 150,40 Q165,36 175,44 Q185,40 192,50 Q200,48 205,58 Q210,56 212,68 Q220,72 215,85 Q222,95 214,106 Q218,118 208,130 Q205,145 195,154 Q185,162 170,162 Q158,162 148,155 Q136,160 122,156 Q108,160 94,152 Q80,148 72,138 Q60,128 58,115 Q50,102 52,88 Q48,74 52,62 Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="130" y="95" text-anchor="middle" font-size="10" font-weight="bold" fill="#1b5e20">PANGEA</text>
  <text x="130" y="108" text-anchor="middle" font-size="8" fill="#388e3c">Alle kontinenter samlet</text>
  <!-- Tethys-hav -->
  <ellipse cx="160" cy="70" rx="20" ry="10" fill="rgba(100,181,246,0.6)" stroke="#1565c0" stroke-width="1"/>
  <text x="160" y="73" text-anchor="middle" font-size="7" fill="#0d47a1">Tethys</text>
  <!-- Pil til nåtid -->
  <path d="M220,100 L280,100" stroke="#555" stroke-width="2" stroke-dasharray="4,3"/>
  <text x="250" y="93" text-anchor="middle" font-size="9" fill="#555">250 Ma</text>
  <!-- Nåtidens kontinenter (forenklet) -->
  <!-- Nord-Amerika -->
  <path d="M310,48 Q328,38 345,42 Q355,46 358,60 Q362,75 350,90 Q338,100 325,96 Q312,88 308,72 Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.2"/>
  <text x="334" y="72" text-anchor="middle" font-size="7" fill="#1b5e20">N-Am.</text>
  <!-- Sør-Amerika -->
  <path d="M330,108 Q342,104 350,114 Q358,128 355,148 Q350,162 340,165 Q328,162 322,148 Q318,132 322,118 Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.2"/>
  <text x="337" y="138" text-anchor="middle" font-size="7" fill="#1b5e20">S-Am.</text>
  <!-- Europa/Asia -->
  <path d="M378,42 Q400,36 425,40 Q455,38 475,48 Q490,58 488,72 Q485,84 470,90 Q450,94 428,88 Q405,82 390,72 Q374,62 378,52 Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.2"/>
  <text x="432" y="66" text-anchor="middle" font-size="7" fill="#1b5e20">Europa/Asia</text>
  <!-- Afrika -->
  <path d="M400,100 Q418,96 430,106 Q438,120 435,140 Q430,158 418,162 Q405,162 398,148 Q392,132 394,116 Z" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.2"/>
  <text x="415" y="132" text-anchor="middle" font-size="7" fill="#1b5e20">Afrika</text>
  <!-- Antarktis -->
  <ellipse cx="445" cy="183" rx="30" ry="12" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
  <text x="445" y="186" text-anchor="middle" font-size="7" fill="#1565c0">Antarktis</text>
  <!-- Fossil-match pil -->
  <path d="M172,130 Q230,160 340,145" stroke="#f57f17" stroke-width="1.5" stroke-dasharray="4,3" fill="none"/>
  <text x="245" y="162" text-anchor="middle" font-size="8" fill="#e65100">🌿 Glossopteris-fossiler begge steder</text>
</svg>`, width: 1.0}
],

'nervesystemet.html': [
{caption: 'Nevronets oppbygning og synapse', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <defs><marker id="arrv" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#555" stroke-width="1.5"/></marker></defs>
  <text x="170" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Nevronets struktur</text>
  <!-- Dendrittar -->
  <path d="M20,80 Q35,70 48,85" fill="none" stroke="#1565c0" stroke-width="2"/>
  <path d="M20,100 Q35,95 48,100" fill="none" stroke="#1565c0" stroke-width="2"/>
  <path d="M20,115 Q38,118 48,110" fill="none" stroke="#1565c0" stroke-width="2"/>
  <text x="14" y="97" font-size="8" fill="#1565c0">Dendrit­ter</text>
  <!-- Cellekropp -->
  <ellipse cx="68" cy="98" rx="20" ry="16" fill="#bbdefb" stroke="#1565c0" stroke-width="1.5"/>
  <text x="68" y="102" text-anchor="middle" font-size="8" fill="#0d47a1">Celle­kropp</text>
  <!-- Akson -->
  <line x1="88" y1="98" x2="265" y2="98" stroke="#1565c0" stroke-width="3"/>
  <text x="180" y="90" text-anchor="middle" font-size="9" fill="#1565c0">Akson</text>
  <!-- Myelinskjede -->
  <rect x="100" y="91" width="30" height="14" rx="7" fill="rgba(255,248,225,0.7)" stroke="#f57f17" stroke-width="1" stroke-dasharray="2,1"/>
  <rect x="140" y="91" width="30" height="14" rx="7" fill="rgba(255,248,225,0.7)" stroke="#f57f17" stroke-width="1" stroke-dasharray="2,1"/>
  <rect x="180" y="91" width="30" height="14" rx="7" fill="rgba(255,248,225,0.7)" stroke="#f57f17" stroke-width="1" stroke-dasharray="2,1"/>
  <rect x="220" y="91" width="30" height="14" rx="7" fill="rgba(255,248,225,0.7)" stroke="#f57f17" stroke-width="1" stroke-dasharray="2,1"/>
  <text x="148" y="118" text-anchor="middle" font-size="8" fill="#e65100">Myelinskjede (raskere impuls)</text>
  <!-- Aksonterminaler -->
  <circle cx="275" cy="90" r="5" fill="#6a1b9a"/>
  <circle cx="275" cy="106" r="5" fill="#6a1b9a"/>
  <text x="285" y="97" font-size="8" fill="#6a1b9a">Terminal</text>
  <!-- Synapsespalte -->
  <text x="370" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Synapse (forstørret)</text>
  <rect x="300" y="30" width="200" height="55" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="400" y="48" text-anchor="middle" font-size="9" fill="#0d47a1">Presynaptisk terminal</text>
  <circle cx="340" cy="62" r="7" fill="#bbdefb" stroke="#1565c0" stroke-width="1"/>
  <circle cx="360" cy="58" r="7" fill="#bbdefb" stroke="#1565c0" stroke-width="1"/>
  <circle cx="380" cy="62" r="7" fill="#bbdefb" stroke="#1565c0" stroke-width="1"/>
  <text x="360" y="74" text-anchor="middle" font-size="8" fill="#1565c0">Vesikler (NT)</text>
  <!-- Spalte -->
  <rect x="300" y="85" width="200" height="12" rx="0" fill="rgba(200,230,255,0.3)"/>
  <text x="400" y="95" text-anchor="middle" font-size="8" fill="#555" font-style="italic">← Synaptisk spalt (20 nm) →</text>
  <!-- NT-prikker -->
  <circle cx="335" cy="89" r="3" fill="#6a1b9a"/>
  <circle cx="355" cy="87" r="3" fill="#6a1b9a"/>
  <circle cx="375" cy="90" r="3" fill="#6a1b9a"/>
  <circle cx="395" cy="87" r="3" fill="#6a1b9a"/>
  <circle cx="415" cy="89" r="3" fill="#6a1b9a"/>
  <!-- Post -->
  <rect x="300" y="97" width="200" height="45" rx="6" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="400" y="112" text-anchor="middle" font-size="9" fill="#1b5e20">Postsynaptisk membran</text>
  <rect x="325" y="97" width="14" height="10" rx="5" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1"/>
  <rect x="355" y="97" width="14" height="10" rx="5" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1"/>
  <rect x="385" y="97" width="14" height="10" rx="5" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1"/>
  <rect x="415" y="97" width="14" height="10" rx="5" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1"/>
  <text x="400" y="133" text-anchor="middle" font-size="8" fill="#2e7d32">Reseptorer (binder NT)</text>
  <!-- Impuls-pil -->
  <path d="M88,150 L265,150" stroke="#c62828" stroke-width="2" marker-end="url(#arrv)"/>
  <text x="170" y="165" text-anchor="middle" font-size="9" fill="#c62828">Nerveimpuls (aksjons­potensial)</text>
  <text x="170" y="178" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Na⁺ inn → depolarisering → forplanter seg langs aksonen</text>
</svg>`, width: 1.0}
],

'immunforsvar.html': [
{caption: 'Immunforsvarets tre linjer', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <defs><marker id="arri" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <!-- Linje 1 -->
  <rect x="10" y="25" width="155" height="150" rx="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="87" y="45" text-anchor="middle" font-size="10" font-weight="bold" fill="#1b5e20">1. linje – Barrierer</text>
  <text x="87" y="60" text-anchor="middle" font-size="9" fill="#2e7d32">Umiddelbart</text>
  <text x="87" y="82" text-anchor="middle" font-size="9" fill="#333">🧱 Hud (tørr, lav pH)</text>
  <text x="87" y="98" text-anchor="middle" font-size="9" fill="#333">💧 Slimhinner + slim</text>
  <text x="87" y="114" text-anchor="middle" font-size="9" fill="#333">🔪 Magesyre</text>
  <text x="87" y="130" text-anchor="middle" font-size="9" fill="#333">🫁 Flimmerhår</text>
  <text x="87" y="160" text-anchor="middle" font-size="8" fill="#388e3c" font-style="italic">Hindrer inntrengning</text>
  <!-- Linje 2 -->
  <rect x="183" y="25" width="155" height="150" rx="10" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <text x="260" y="45" text-anchor="middle" font-size="10" font-weight="bold" fill="#e65100">2. linje – Medfødt</text>
  <text x="260" y="60" text-anchor="middle" font-size="9" fill="#e65100">Timer</text>
  <text x="260" y="82" text-anchor="middle" font-size="9" fill="#333">🔥 Betennelse</text>
  <text x="260" y="98" text-anchor="middle" font-size="9" fill="#333">🌡️ Feber</text>
  <text x="260" y="114" text-anchor="middle" font-size="9" fill="#333">🔬 Nøytrofiler</text>
  <text x="260" y="130" text-anchor="middle" font-size="9" fill="#333">🦠 Makrofager</text>
  <text x="260" y="160" text-anchor="middle" font-size="8" fill="#e65100" font-style="italic">Uspesifikt forsvar</text>
  <!-- Linje 3 -->
  <rect x="356" y="25" width="155" height="150" rx="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="433" y="45" text-anchor="middle" font-size="10" font-weight="bold" fill="#0d47a1">3. linje – Adaptivt</text>
  <text x="433" y="60" text-anchor="middle" font-size="9" fill="#1565c0">Dager → hukommelse</text>
  <text x="433" y="82" text-anchor="middle" font-size="9" fill="#333">🔵 B-celler → antistoffer</text>
  <text x="433" y="98" text-anchor="middle" font-size="9" fill="#333">🔴 T-celler (CD4/CD8)</text>
  <text x="433" y="114" text-anchor="middle" font-size="9" fill="#333">💉 Vaksinasjon</text>
  <text x="433" y="130" text-anchor="middle" font-size="9" fill="#333">🧠 Immunhukommelse</text>
  <text x="433" y="160" text-anchor="middle" font-size="8" fill="#1565c0" font-style="italic">Spesifikt – husker patogen</text>
  <!-- Piler -->
  <path d="M165,100 L183,100" stroke="#555" stroke-width="1.5" marker-end="url(#arri)" fill="none"/>
  <path d="M338,100 L356,100" stroke="#555" stroke-width="1.5" marker-end="url(#arri)" fill="none"/>
</svg>`, width: 1.0}
],

'genetikk.html': [
{caption: 'DNA-struktur og arvegang', svg: `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="220" fill="#fafafa"/>
  <!-- DNA dobbelthelix -->
  <text x="120" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">DNA-dobbelthelix</text>
  <text x="380" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Punnett-kvadrat (Aa × Aa)</text>
  <!-- Helix-ryggrad venstre -->
  <path d="M60,30 Q80,55 60,80 Q40,105 60,130 Q80,155 60,180" fill="none" stroke="#1565c0" stroke-width="3"/>
  <!-- Helix-ryggrad høyre -->
  <path d="M180,30 Q160,55 180,80 Q200,105 180,130 Q160,155 180,180" fill="none" stroke="#c62828" stroke-width="3"/>
  <!-- Baser -->
  <line x1="75" y1="47" x2="165" y2="47" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="104" y="44" font-size="8" fill="#1b5e20">A</text><text x="130" y="44" font-size="8" fill="#c62828">T</text>
  <text x="116" y="53" text-anchor="middle" font-size="7" fill="#555">· · ·</text>
  <line x1="56" y1="80" x2="184" y2="80" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="82" y="77" font-size="8" fill="#1565c0">C</text><text x="152" y="77" font-size="8" fill="#6a1b9a">G</text>
  <text x="116" y="86" text-anchor="middle" font-size="7" fill="#555">· · ·</text>
  <line x1="75" y1="113" x2="165" y2="113" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="100" y="110" font-size="8" fill="#1b5e20">A</text><text x="138" y="110" font-size="8" fill="#c62828">T</text>
  <text x="116" y="119" text-anchor="middle" font-size="7" fill="#555">· · ·</text>
  <line x1="62" y1="147" x2="178" y2="147" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="86" y="144" font-size="8" fill="#1565c0">C</text><text x="148" y="144" font-size="8" fill="#6a1b9a">G</text>
  <text x="116" y="153" text-anchor="middle" font-size="7" fill="#555">· · ·</text>
  <!-- Baseparings-legenden -->
  <text x="120" y="200" text-anchor="middle" font-size="9" fill="#1b5e20">A–T (2 H-bindinger) · C–G (3 H-bindinger)</text>
  <text x="60" y="192" font-size="8" fill="#1565c0">5'→3'</text>
  <text x="175" y="192" font-size="8" fill="#c62828">3'→5'</text>
  <!-- Punnett-kvadrat -->
  <rect x="290" y="28" width="200" height="180" rx="6" fill="#fff" stroke="#888" stroke-width="1"/>
  <line x1="290" y1="70" x2="490" y2="70" stroke="#888" stroke-width="1"/>
  <line x1="390" y1="28" x2="390" y2="208" stroke="#888" stroke-width="1"/>
  <line x1="290" y1="138" x2="490" y2="138" stroke="#888" stroke-width="1"/>
  <!-- Header -->
  <text x="340" y="52" text-anchor="middle" font-size="12" font-weight="bold" fill="#1565c0">A</text>
  <text x="440" y="52" text-anchor="middle" font-size="12" font-weight="bold" fill="#1565c0">a</text>
  <text x="307" y="107" text-anchor="middle" font-size="12" font-weight="bold" fill="#c62828">A</text>
  <text x="307" y="176" text-anchor="middle" font-size="12" font-weight="bold" fill="#c62828">a</text>
  <!-- Celler -->
  <text x="340" y="107" text-anchor="middle" font-size="12" font-weight="bold" fill="#1b5e20">AA</text>
  <text x="440" y="107" text-anchor="middle" font-size="12" font-weight="bold" fill="#2e7d32">Aa</text>
  <text x="340" y="176" text-anchor="middle" font-size="12" font-weight="bold" fill="#2e7d32">Aa</text>
  <text x="440" y="176" text-anchor="middle" font-size="12" fill="#888">aa</text>
  <!-- Forklaring -->
  <text x="390" y="200" text-anchor="middle" font-size="9" fill="#555">25% AA · 50% Aa · 25% aa</text>
  <text x="390" y="213" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Fenotype: 75% dominant, 25% recessiv</text>
</svg>`, width: 1.0}
],

'elektrisitetsteori.html': [
{caption: "Ohms lov og serie- vs. parallellkobling", svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <!-- Ohms lov trekant -->
  <text x="100" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Ohms lov</text>
  <polygon points="100,30 35,145 165,145" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
  <line x1="35" y1="100" x2="165" y2="100" stroke="#1565c0" stroke-width="1.5"/>
  <text x="100" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#c62828">U</text>
  <text x="100" y="88" text-anchor="middle" font-size="11" fill="#888">(Volt)</text>
  <text x="62" y="130" text-anchor="middle" font-size="20" font-weight="bold" fill="#1b5e20">I</text>
  <text x="62" y="146" text-anchor="middle" font-size="9" fill="#888">(Ampere)</text>
  <text x="138" y="130" text-anchor="middle" font-size="20" font-weight="bold" fill="#e65100">R</text>
  <text x="138" y="146" text-anchor="middle" font-size="9" fill="#888">(Ohm)</text>
  <text x="100" y="164" text-anchor="middle" font-size="10" fill="#333">U = I · R</text>
  <text x="100" y="178" text-anchor="middle" font-size="9" fill="#555">I = U/R · R = U/I</text>
  <!-- Seriekobling -->
  <text x="325" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Seriekobling</text>
  <line x1="225" y1="50" x2="275" y2="50" stroke="#333" stroke-width="2"/>
  <rect x="275" y="40" width="35" height="20" rx="3" fill="#ffcc80" stroke="#e65100" stroke-width="1.5"/>
  <text x="292" y="53" text-anchor="middle" font-size="9" fill="#e65100">R₁</text>
  <line x1="310" y1="50" x2="340" y2="50" stroke="#333" stroke-width="2"/>
  <rect x="340" y="40" width="35" height="20" rx="3" fill="#ffcc80" stroke="#e65100" stroke-width="1.5"/>
  <text x="357" y="53" text-anchor="middle" font-size="9" fill="#e65100">R₂</text>
  <line x1="375" y1="50" x2="425" y2="50" stroke="#333" stroke-width="2"/>
  <line x1="425" y1="50" x2="425" y2="80" stroke="#333" stroke-width="2"/>
  <line x1="225" y1="50" x2="225" y2="80" stroke="#333" stroke-width="2"/>
  <line x1="225" y1="80" x2="425" y2="80" stroke="#333" stroke-width="2"/>
  <!-- Batteri -->
  <line x1="305" y1="72" x2="305" y2="80" stroke="#333" stroke-width="1"/>
  <line x1="300" y1="72" x2="310" y2="72" stroke="#333" stroke-width="3"/>
  <line x1="302" y1="76" x2="308" y2="76" stroke="#333" stroke-width="1.5"/>
  <text x="325" y="92" text-anchor="middle" font-size="9" fill="#555">R_tot = R₁ + R₂ (øker)</text>
  <text x="325" y="105" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Samme strøm gjennom alle</text>
  <!-- Parallellkobling -->
  <text x="325" y="125" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Parallellkobling</text>
  <line x1="235" y1="140" x2="415" y2="140" stroke="#333" stroke-width="2"/>
  <line x1="235" y1="185" x2="415" y2="185" stroke="#333" stroke-width="2"/>
  <line x1="280" y1="140" x2="280" y2="150" stroke="#333" stroke-width="1.5"/>
  <rect x="265" y="150" width="30" height="18" rx="3" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="280" y="162" text-anchor="middle" font-size="9" fill="#1b5e20">R₁</text>
  <line x1="280" y1="168" x2="280" y2="185" stroke="#333" stroke-width="1.5"/>
  <line x1="370" y1="140" x2="370" y2="150" stroke="#333" stroke-width="1.5"/>
  <rect x="355" y="150" width="30" height="18" rx="3" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="370" y="162" text-anchor="middle" font-size="9" fill="#1b5e20">R₂</text>
  <line x1="370" y1="168" x2="370" y2="185" stroke="#333" stroke-width="1.5"/>
  <text x="325" y="200" text-anchor="middle" font-size="9" fill="#555">1/R_tot = 1/R₁ + 1/R₂ (minker)</text>
</svg>`, width: 1.0}
],

'syr_base_ph.html': [
{caption: 'pH-skalaen 0–14', svg: `
<svg viewBox="0 0 520 130" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="130" fill="#fafafa"/>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">pH-skalaen</text>
  <!-- Fargegradering -->
  <defs>
    <linearGradient id="phgrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e53935"/>
      <stop offset="21%" stop-color="#fb8c00"/>
      <stop offset="50%" stop-color="#43a047"/>
      <stop offset="79%" stop-color="#1e88e5"/>
      <stop offset="100%" stop-color="#8e24aa"/>
    </linearGradient>
  </defs>
  <rect x="20" y="25" width="480" height="40" rx="6" fill="url(#phgrad)"/>
  <!-- pH-tall -->
  <g font-size="9" text-anchor="middle" fill="white" font-weight="bold">
    <text x="38" y="50">0</text><text x="71" y="50">1</text><text x="104" y="50">2</text>
    <text x="137" y="50">3</text><text x="170" y="50">4</text><text x="203" y="50">5</text>
    <text x="236" y="50">6</text><text x="260" y="50">7</text><text x="293" y="50">8</text>
    <text x="326" y="50">9</text><text x="359" y="50">10</text><text x="392" y="50">11</text>
    <text x="425" y="50">12</text><text x="458" y="50">13</text><text x="491" y="50">14</text>
  </g>
  <!-- Eksempler -->
  <text x="38" y="80" text-anchor="middle" font-size="8" fill="#c62828">HCl</text>
  <text x="38" y="90" text-anchor="middle" font-size="8" fill="#c62828">Saltsyre</text>
  <text x="104" y="80" text-anchor="middle" font-size="8" fill="#e53935">Mage­syre</text>
  <text x="170" y="80" text-anchor="middle" font-size="8" fill="#e65100">Kaffe</text>
  <text x="236" y="80" text-anchor="middle" font-size="8" fill="#2e7d32">Melk</text>
  <text x="260" y="80" text-anchor="middle" font-size="8" fill="#2e7d32" font-weight="bold">NØYTRAL</text>
  <text x="260" y="90" text-anchor="middle" font-size="8" fill="#555">Vann</text>
  <text x="326" y="80" text-anchor="middle" font-size="8" fill="#1565c0">Havvann</text>
  <text x="392" y="80" text-anchor="middle" font-size="8" fill="#1565c0">NH₃</text>
  <text x="425" y="80" text-anchor="middle" font-size="8" fill="#6a1b9a">Kalk­vann</text>
  <text x="491" y="80" text-anchor="middle" font-size="8" fill="#6a1b9a">NaOH</text>
  <!-- Syre/base-label -->
  <text x="120" y="112" text-anchor="middle" font-size="10" font-weight="bold" fill="#c62828">← SYRE (H⁺ overskudd)</text>
  <text x="390" y="112" text-anchor="middle" font-size="10" font-weight="bold" fill="#6a1b9a">BASE (OH⁻ overskudd) →</text>
  <!-- Tick -->
  <line x1="260" y1="25" x2="260" y2="65" stroke="white" stroke-width="2"/>
</svg>`, width: 1.0}
],

'elektrokjemi.html': [
{caption: 'Galvanisk celle (Zn-Cu)', svg: `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="220" fill="#fafafa"/>
  <defs><marker id="arrek" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#c62828" stroke-width="2"/></marker></defs>
  <!-- Zn-elektrode -->
  <rect x="60" y="40" width="20" height="120" rx="3" fill="#b0bec5" stroke="#546e7a" stroke-width="2"/>
  <text x="70" y="35" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Zn (−)</text>
  <text x="70" y="178" text-anchor="middle" font-size="9" fill="#333">Anode</text>
  <!-- Cu-elektrode -->
  <rect x="440" y="40" width="20" height="120" rx="3" fill="#ff8a65" stroke="#bf360c" stroke-width="2"/>
  <text x="450" y="35" text-anchor="middle" font-size="11" font-weight="bold" fill="#c62828">Cu (+)</text>
  <text x="450" y="178" text-anchor="middle" font-size="9" fill="#c62828">Katode</text>
  <!-- Beholder ZnSO4 -->
  <rect x="30" y="100" width="110" height="80" rx="4" fill="rgba(200,230,255,0.4)" stroke="#1565c0" stroke-width="1.5"/>
  <text x="85" y="145" text-anchor="middle" font-size="9" fill="#1565c0">ZnSO₄(aq)</text>
  <text x="85" y="158" text-anchor="middle" font-size="8" fill="#1565c0">Zn²⁺ + SO₄²⁻</text>
  <!-- Beholder CuSO4 -->
  <rect x="380" y="100" width="110" height="80" rx="4" fill="rgba(100,180,255,0.35)" stroke="#1565c0" stroke-width="1.5"/>
  <text x="435" y="145" text-anchor="middle" font-size="9" fill="#1565c0">CuSO₄(aq)</text>
  <text x="435" y="158" text-anchor="middle" font-size="8" fill="#1565c0">Cu²⁺ + SO₄²⁻</text>
  <!-- Saltbro -->
  <rect x="185" y="100" width="150" height="24" rx="8" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <text x="260" y="116" text-anchor="middle" font-size="9" fill="#e65100">Saltbro (KNO₃)</text>
  <line x1="215" y1="124" x2="215" y2="145" stroke="#f57f17" stroke-width="1.5" stroke-dasharray="3,2"/>
  <line x1="305" y1="124" x2="305" y2="145" stroke="#f57f17" stroke-width="1.5" stroke-dasharray="3,2"/>
  <line x1="215" y1="145" x2="305" y2="145" stroke="#f57f17" stroke-width="1.5" stroke-dasharray="3,2"/>
  <!-- Ekstern krets – elektroner -->
  <path d="M80,40 L80,25 L450,25 L450,40" fill="none" stroke="#555" stroke-width="2.5"/>
  <!-- Lyspære -->
  <circle cx="265" cy="25" r="12" fill="#fff9c4" stroke="#f57f17" stroke-width="2"/>
  <text x="265" y="29" text-anchor="middle" font-size="10">💡</text>
  <!-- Elektronpiler -->
  <path d="M80,25 L240,25" stroke="#c62828" stroke-width="1.5" marker-end="url(#arrek)" fill="none"/>
  <path d="M290,25 L450,25" stroke="#c62828" stroke-width="1.5" stroke-dasharray="4,2" fill="none"/>
  <text x="160" y="18" text-anchor="middle" font-size="8" fill="#c62828">e⁻ →</text>
  <!-- Halvreaksjoner -->
  <text x="70" y="198" text-anchor="middle" font-size="8" fill="#555">Zn → Zn²⁺ + 2e⁻</text>
  <text x="70" y="210" text-anchor="middle" font-size="8" fill="#555">(oksidasjon)</text>
  <text x="450" y="198" text-anchor="middle" font-size="8" fill="#555">Cu²⁺ + 2e⁻ → Cu</text>
  <text x="450" y="210" text-anchor="middle" font-size="8" fill="#555">(reduksjon)</text>
</svg>`, width: 1.0}
],

'bolger_lyd.html': [
{caption: 'Bølgeparametre – amplitude og bølgelengde', svg: `
<svg viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="160" fill="#fafafa"/>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Transversal bølge</text>
  <!-- Midtlinje -->
  <line x1="20" y1="90" x2="500" y2="90" stroke="#aaa" stroke-width="1" stroke-dasharray="4,3"/>
  <!-- Bølge -->
  <path d="M20,90 Q60,30 100,90 Q140,150 180,90 Q220,30 260,90 Q300,150 340,90 Q380,30 420,90 Q460,150 500,90" fill="none" stroke="#1565c0" stroke-width="2.5"/>
  <!-- Amplitude -->
  <line x1="100" y1="30" x2="100" y2="90" stroke="#c62828" stroke-width="1.5" stroke-dasharray="3,2"/>
  <path d="M96,30 L100,24 L104,30" fill="#c62828"/>
  <path d="M96,90 L100,96 L104,90" fill="#c62828"/>
  <text x="110" y="64" font-size="9" fill="#c62828">A (amplitude)</text>
  <!-- Bølgelengde -->
  <path d="M100,18 L260,18" stroke="#2e7d32" stroke-width="1.5" marker-end="url(#arrl)" fill="none"/>
  <path d="M260,18 L100,18" stroke="#2e7d32" stroke-width="1.5" marker-end="url(#arrl)" fill="none" transform="translate(360,0)"/>
  <text x="180" y="14" text-anchor="middle" font-size="9" fill="#2e7d32">λ (bølgelengde)</text>
  <defs><marker id="arrl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <!-- Formler -->
  <rect x="20" y="115" width="480" height="40" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1"/>
  <text x="130" y="133" text-anchor="middle" font-size="11" fill="#0d47a1">v = f · λ</text>
  <text x="130" y="148" text-anchor="middle" font-size="9" fill="#555">fart = frekvens × bølgelengde</text>
  <text x="350" y="133" text-anchor="middle" font-size="10" fill="#333">Lyd i luft: 340 m/s · Lys: 3×10⁸ m/s</text>
  <text x="350" y="148" text-anchor="middle" font-size="9" fill="#555">f (Hz) = antall svingninger per sekund</text>
</svg>`, width: 1.0}
],

'havet.html': [
{caption: 'Havets dybdesoner', svg: `
<svg viewBox="0 0 520 250" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="250" fill="#e3f2fd"/>
  <!-- Soner -->
  <rect x="20" y="10" width="360" height="36" rx="0" fill="#b3e5fc"/><text x="200" y="33" text-anchor="middle" font-size="10" font-weight="bold" fill="#01579b">Epipelagisk sone (0–200 m) – sollys, fotosyntese</text>
  <rect x="20" y="46" width="360" height="36" rx="0" fill="#81d4fa"/><text x="200" y="69" text-anchor="middle" font-size="10" font-weight="bold" fill="#0277bd">Mesopelagisk sone (200–1000 m) – skumring</text>
  <rect x="20" y="82" width="360" height="40" rx="0" fill="#4fc3f7"/><text x="200" y="106" text-anchor="middle" font-size="10" font-weight="bold" fill="#01579b">Bathypelagisk sone (1000–4000 m) – mørkt</text>
  <rect x="20" y="122" width="360" height="40" rx="0" fill="#29b6f6"/><text x="200" y="146" text-anchor="middle" font-size="10" font-weight="bold" fill="#01579b">Abyssopelagisk sone (4000–6000 m)</text>
  <rect x="20" y="162" width="360" height="40" rx="0" fill="#0288d1"/><text x="200" y="186" text-anchor="middle" font-size="10" font-weight="bold" fill="white">Hadspelagisk sone (6000+ m) – dypgrøfter</text>
  <rect x="20" y="202" width="360" height="30" rx="0" fill="#01579b"/><text x="200" y="222" text-anchor="middle" font-size="9" fill="white">Mariana-grøften: 11 034 m (dypeste punkt)</text>
  <!-- Trykk/temperatur -->
  <rect x="390" y="10" width="120" height="222" rx="6" fill="rgba(255,255,255,0.6)" stroke="#1565c0" stroke-width="1"/>
  <text x="450" y="28" text-anchor="middle" font-size="9" font-weight="bold" fill="#333">Trykk/Temp</text>
  <text x="450" y="50" text-anchor="middle" font-size="8" fill="#333">1 atm · 20°C</text>
  <text x="450" y="86" text-anchor="middle" font-size="8" fill="#333">10 atm · 5°C</text>
  <text x="450" y="122" text-anchor="middle" font-size="8" fill="#333">100 atm · 2°C</text>
  <text x="450" y="158" text-anchor="middle" font-size="8" fill="#333">400 atm · 1°C</text>
  <text x="450" y="195" text-anchor="middle" font-size="8" fill="#333">600+ atm</text>
  <text x="450" y="210" text-anchor="middle" font-size="8" fill="#333">~2°C</text>
  <!-- Sol -->
  <text x="492" y="28" font-size="16" fill="#f9a825">☀</text>
  <line x1="492" y1="40" x2="492" y2="60" stroke="#f9a825" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="260" y="244" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Bioluminescens og kjemosyntese erstatter sollys i de dype sonene</text>
</svg>`, width: 1.0}
],

'vaer_atmosfaere.html': [
{caption: 'Atmosfærens lag', svg: `
<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="240" fill="#e3f2fd"/>
  <rect x="20" y="10" width="340" height="32" rx="0" fill="#f3e5f5"/><text x="190" y="31" text-anchor="middle" font-size="10" font-weight="bold" fill="#6a1b9a">Eksosfære (500+ km) – rommet begynner</text>
  <rect x="20" y="42" width="340" height="32" rx="0" fill="#e8eaf6"/><text x="190" y="63" text-anchor="middle" font-size="10" font-weight="bold" fill="#3949ab">Termosfære (80–500 km) – ISS, nordlys</text>
  <rect x="20" y="74" width="340" height="32" rx="0" fill="#e3f2fd"/><text x="190" y="95" text-anchor="middle" font-size="10" font-weight="bold" fill="#1565c0">Mesosfære (50–80 km) – meteorer brenner opp</text>
  <rect x="20" y="106" width="340" height="40" rx="0" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/><text x="190" y="123" text-anchor="middle" font-size="10" font-weight="bold" fill="#1b5e20">Stratosfære (12–50 km)</text><text x="190" y="138" text-anchor="middle" font-size="9" fill="#2e7d32">Ozonlaget (25 km) – absorberer UV</text>
  <rect x="20" y="146" width="340" height="40" rx="0" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/><text x="190" y="163" text-anchor="middle" font-size="10" font-weight="bold" fill="#e65100">Troposfære (0–12 km)</text><text x="190" y="178" text-anchor="middle" font-size="9" fill="#e65100">Vær, skyer, 78% N₂ + 21% O₂</text>
  <!-- Jord -->
  <rect x="20" y="186" width="340" height="22" rx="0" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1.5"/><text x="190" y="202" text-anchor="middle" font-size="10" font-weight="bold" fill="#1b5e20">Jordoverflaten</text>
  <!-- Høyde-akse -->
  <rect x="375" y="10" width="125" height="198" rx="6" fill="rgba(255,255,255,0.7)" stroke="#aaa" stroke-width="1"/>
  <text x="437" y="28" text-anchor="middle" font-size="9" font-weight="bold" fill="#333">Høyde</text>
  <text x="437" y="48" text-anchor="middle" font-size="8" fill="#555">500+ km</text>
  <text x="437" y="80" text-anchor="middle" font-size="8" fill="#555">500 km</text>
  <text x="437" y="112" text-anchor="middle" font-size="8" fill="#555">80 km</text>
  <text x="437" y="142" text-anchor="middle" font-size="8" fill="#555">50 km</text>
  <text x="437" y="176" text-anchor="middle" font-size="8" fill="#555">12 km</text>
  <text x="437" y="200" text-anchor="middle" font-size="8" fill="#555">0 km</text>
  <text x="260" y="222" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Temperaturen synker med høyde i troposfæren (≈ 6,5°C/km)</text>
</svg>`, width: 1.0}
],


'hjertet.html': [
{caption: 'Hjertets tverrsnitt med kamre, klaffer og blodkretsløp', svg: `
<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="240" fill="#fff5f5"/>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#b71c1c">Hjertets anatomi</text>
  <!-- Hjerte-form -->
  <path d="M260,210 Q160,160 120,120 Q80,80 100,50 Q120,20 160,30 Q200,38 260,80 Q320,38 360,30 Q400,20 420,50 Q440,80 400,120 Q360,160 260,210Z" fill="#ef9a9a" stroke="#b71c1c" stroke-width="2"/>
  <!-- Skillevegger -->
  <line x1="260" y1="75" x2="260" y2="195" stroke="#b71c1c" stroke-width="2"/>
  <line x1="165" y1="115" x2="355" y2="115" stroke="#b71c1c" stroke-width="1.5" stroke-dasharray="4,3"/>
  <!-- Kammer-labels -->
  <text x="205" y="95" text-anchor="middle" font-size="9" font-weight="bold" fill="#1565c0">Høyre</text>
  <text x="205" y="107" text-anchor="middle" font-size="9" fill="#1565c0">forkammer</text>
  <text x="315" y="95" text-anchor="middle" font-size="9" font-weight="bold" fill="#c62828">Venstre</text>
  <text x="315" y="107" text-anchor="middle" font-size="9" fill="#c62828">forkammer</text>
  <text x="205" y="150" text-anchor="middle" font-size="9" font-weight="bold" fill="#1565c0">Høyre</text>
  <text x="205" y="162" text-anchor="middle" font-size="9" fill="#1565c0">hjertekammer</text>
  <text x="315" y="150" text-anchor="middle" font-size="9" font-weight="bold" fill="#c62828">Venstre</text>
  <text x="315" y="162" text-anchor="middle" font-size="9" fill="#c62828">hjertekammer</text>
  <!-- Klaffer -->
  <ellipse cx="205" cy="115" rx="14" ry="5" fill="#ffcc80" stroke="#e65100" stroke-width="1"/>
  <text x="160" y="130" font-size="8" fill="#e65100">Trikuspidal­klaf</text>
  <ellipse cx="315" cy="115" rx="14" ry="5" fill="#ffcc80" stroke="#e65100" stroke-width="1"/>
  <text x="325" y="130" font-size="8" fill="#e65100">Mitral­klaf</text>
  <!-- Blodkar -->
  <rect x="230" y="20" width="20" height="30" rx="5" fill="#ef9a9a" stroke="#b71c1c" stroke-width="1.5"/>
  <text x="253" y="35" font-size="8" fill="#c62828">Aorta</text>
  <rect x="270" y="20" width="18" height="25" rx="5" fill="#90caf9" stroke="#1565c0" stroke-width="1.5"/>
  <text x="292" y="35" font-size="8" fill="#1565c0">Lunge­art.</text>
  <rect x="120" y="50" width="14" height="22" rx="4" fill="#90caf9" stroke="#1565c0" stroke-width="1.5"/>
  <text x="96" y="62" font-size="8" fill="#1565c0">V. cava</text>
  <rect x="386" y="55" width="14" height="20" rx="4" fill="#ef9a9a" stroke="#b71c1c" stroke-width="1.5"/>
  <text x="402" y="66" font-size="8" fill="#c62828">Lunge­vene</text>
  <!-- Farge-forklaring -->
  <rect x="20" y="215" width="12" height="8" rx="2" fill="#90caf9"/><text x="36" y="222" font-size="8" fill="#1565c0">Oksygenfattig blod (høyre side)</text>
  <rect x="270" y="215" width="12" height="8" rx="2" fill="#ef9a9a"/><text x="286" y="222" font-size="8" fill="#c62828">Oksygenrikt blod (venstre side)</text>
</svg>`, width: 1.0}
],

'lungene.html': [
{caption: 'Luftveiene og gassutveksling i alveolene', svg: `
<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="230" fill="#f0f8ff"/>
  <text x="175" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Luftveiene</text>
  <text x="400" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Alveolegassutveksling</text>
  <!-- Luftveier -->
  <rect x="155" y="22" width="40" height="20" rx="5" fill="#b3e5fc" stroke="#0288d1" stroke-width="1.5"/>
  <text x="175" y="36" text-anchor="middle" font-size="9" fill="#01579b">Luftrør (trakea)</text>
  <line x1="175" y1="42" x2="175" y2="55" stroke="#0288d1" stroke-width="2"/>
  <path d="M175,55 L130,75" stroke="#0288d1" stroke-width="2"/>
  <path d="M175,55 L220,75" stroke="#0288d1" stroke-width="2"/>
  <text x="115" y="72" font-size="9" fill="#0288d1">Venstre</text>
  <text x="115" y="82" font-size="9" fill="#0288d1">bronkie</text>
  <text x="218" y="72" font-size="9" fill="#0288d1">Høyre</text>
  <text x="218" y="82" font-size="9" fill="#0288d1">bronkie</text>
  <!-- Lunger -->
  <ellipse cx="120" cy="130" rx="65" ry="65" fill="rgba(179,229,252,0.4)" stroke="#0288d1" stroke-width="1.5"/>
  <ellipse cx="230" cy="130" rx="65" ry="65" fill="rgba(179,229,252,0.4)" stroke="#0288d1" stroke-width="1.5"/>
  <!-- Bronkioler -->
  <path d="M130,80 Q115,100 110,120" stroke="#0288d1" stroke-width="1.5" fill="none"/>
  <path d="M130,80 Q125,105 125,130" stroke="#0288d1" stroke-width="1.5" fill="none"/>
  <path d="M220,80 Q225,105 225,130" stroke="#0288d1" stroke-width="1.5" fill="none"/>
  <path d="M220,80 Q235,100 240,120" stroke="#0288d1" stroke-width="1.5" fill="none"/>
  <text x="175" y="195" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Hv. lunge: 3 lapper · Ve. lunge: 2 lapper</text>
  <text x="175" y="206" text-anchor="middle" font-size="8" fill="#555" font-style="italic">~300 mill. alveoler · total overflate ~70 m²</text>
  <!-- Alveolegassutveksling -->
  <circle cx="400" cy="110" r="55" fill="rgba(255,248,220,0.6)" stroke="#f57f17" stroke-width="1.5"/>
  <text x="400" y="85" text-anchor="middle" font-size="10" font-weight="bold" fill="#e65100">Alveoleveggen</text>
  <!-- Kapillær -->
  <path d="M350,130 Q380,120 400,130 Q420,140 450,130" fill="none" stroke="#c62828" stroke-width="6" stroke-linecap="round"/>
  <text x="400" y="155" text-anchor="middle" font-size="9" fill="#c62828">Kapillær</text>
  <!-- Piler O2 og CO2 -->
  <path d="M400,100 L400,125" stroke="#1b5e20" stroke-width="2" marker-end="url(#arl)"/>
  <text x="408" y="115" font-size="9" fill="#1b5e20">O₂ →</text>
  <path d="M390,125 L390,100" stroke="#1565c0" stroke-width="2" marker-end="url(#arl)"/>
  <text x="352" y="115" font-size="9" fill="#1565c0">← CO₂</text>
  <defs><marker id="arl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <text x="400" y="215" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Diffusjon: O₂ fra alveole → blod · CO₂ fra blod → alveole</text>
</svg>`, width: 1.0}
],

'nyrene.html': [
{caption: 'Nefronets struktur og urindannelse', svg: `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="220" fill="#fafafa"/>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Nefronet – nyrens funksjonelle enhet (~1 million per nyre)</text>
  <defs><marker id="arn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <!-- Bowmans kapsel -->
  <circle cx="120" cy="60" r="32" fill="rgba(179,229,252,0.4)" stroke="#0288d1" stroke-width="1.5"/>
  <circle cx="120" cy="60" r="18" fill="rgba(239,154,154,0.5)" stroke="#c62828" stroke-width="1.5"/>
  <text x="120" y="48" text-anchor="middle" font-size="8" fill="#c62828">Glomerulus</text>
  <text x="120" y="57" text-anchor="middle" font-size="8" fill="#c62828">(kapillærknute)</text>
  <text x="120" y="102" text-anchor="middle" font-size="8" fill="#0288d1">Bowmans kapsel</text>
  <!-- Proksimalt tubulus -->
  <path d="M152,60 Q185,45 210,65 Q235,85 220,105 Q205,125 185,120" fill="none" stroke="#43a047" stroke-width="4" stroke-linecap="round"/>
  <text x="225" y="75" font-size="8" fill="#2e7d32">Proksimalt</text>
  <text x="225" y="85" font-size="8" fill="#2e7d32">tubulus</text>
  <!-- Henles slynge -->
  <path d="M185,120 Q175,145 170,170 Q165,190 185,195 Q205,198 210,175 Q215,155 210,135" fill="none" stroke="#1565c0" stroke-width="4" stroke-linecap="round"/>
  <text x="140" y="178" font-size="8" fill="#1565c0">Henles</text>
  <text x="140" y="188" font-size="8" fill="#1565c0">slynge</text>
  <!-- Distalt tubulus -->
  <path d="M210,135 Q230,120 255,130 Q280,140 285,155" fill="none" stroke="#7b1fa2" stroke-width="4" stroke-linecap="round"/>
  <text x="255" y="130" font-size="8" fill="#7b1fa2">Distalt</text>
  <text x="255" y="140" font-size="8" fill="#7b1fa2">tubulus</text>
  <!-- Samlingsrør -->
  <rect x="275" y="155" width="16" height="55" rx="3" fill="rgba(255,213,79,0.5)" stroke="#f57f17" stroke-width="1.5"/>
  <text x="295" y="175" font-size="8" fill="#e65100">Samlings­rør</text>
  <!-- Urin ut -->
  <path d="M283" y1="210" x2="283" y2="218" stroke="#f57f17" stroke-width="2" marker-end="url(#arn)"/>
  <path d="M283,210 L283,218" stroke="#f57f17" stroke-width="2" marker-end="url(#arn)" fill="none"/>
  <text x="300" y="218" font-size="8" fill="#555">→ Nyrebekken → Urinleder</text>
  <!-- Prosess-piler -->
  <text x="400" y="40" font-size="10" font-weight="bold" fill="#333">Tre prosesser:</text>
  <text x="400" y="58" font-size="9" fill="#c62828">1. Filtrasjon (Glomerulus)</text>
  <text x="400" y="70" font-size="8" fill="#555">   Blodtrykk presser vann, ioner,</text>
  <text x="400" y="80" font-size="8" fill="#555">   glukose, urea ut av blodet</text>
  <text x="400" y="98" font-size="9" fill="#43a047">2. Reabsorpsjon (tubuli)</text>
  <text x="400" y="110" font-size="8" fill="#555">   Glukose, aminosyrer, vann, Na⁺</text>
  <text x="400" y="120" font-size="8" fill="#555">   suges tilbake til blodet</text>
  <text x="400" y="138" font-size="9" fill="#7b1fa2">3. Sekresjon</text>
  <text x="400" y="150" font-size="8" fill="#555">   Avfallsstoffer skilles aktivt ut</text>
  <text x="400" y="160" font-size="8" fill="#555">   fra blodet til tubulus</text>
  <rect x="388" y="175" width="122" height="32" rx="5" fill="#fff9c4" stroke="#f57f17" stroke-width="1"/>
  <text x="449" y="189" text-anchor="middle" font-size="8" fill="#e65100">Urin: 95% vann + urea,</text>
  <text x="449" y="200" text-anchor="middle" font-size="8" fill="#e65100">kreatinin, salter, hormoner</text>
</svg>`, width: 1.0}
],

'oyet.html': [
{caption: 'Øyets tverrsnitt', svg: `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="220" fill="#fafafa"/>
  <text x="220" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Øyets tverrsnitt</text>
  <!-- Øyeeplet -->
  <circle cx="210" cy="115" r="95" fill="#e3f2fd" stroke="#555" stroke-width="2"/>
  <!-- Cornea -->
  <path d="M120,95 Q100,115 120,135" fill="none" stroke="#0288d1" stroke-width="3"/>
  <text x="68" y="115" font-size="9" fill="#0288d1">Hornhinne</text>
  <text x="68" y="126" font-size="9" fill="#0288d1">(kornea)</text>
  <!-- Iris og pupill -->
  <circle cx="155" cy="115" r="22" fill="#6d4c41" stroke="#3e2723" stroke-width="1.5"/>
  <circle cx="155" cy="115" r="10" fill="black"/>
  <text x="130" y="148" font-size="8" fill="#555">Iris  Pupill</text>
  <!-- Linse -->
  <ellipse cx="180" cy="115" rx="12" ry="22" fill="rgba(255,248,225,0.8)" stroke="#f57f17" stroke-width="1.5"/>
  <text x="168" y="150" font-size="8" fill="#e65100">Linse</text>
  <!-- Glassvæske -->
  <text x="220" y="100" text-anchor="middle" font-size="8" fill="#1565c0">Glasslegeme</text>
  <!-- Netthinne -->
  <path d="M285,50 Q310,115 285,180" fill="none" stroke="#c62828" stroke-width="3"/>
  <text x="292" y="90" font-size="8" fill="#c62828">Nett­hinne</text>
  <text x="292" y="100" font-size="8" fill="#c62828">(retina)</text>
  <!-- Synsnerve -->
  <rect x="296" y="108" width="30" height="14" rx="3" fill="#ffcc80" stroke="#e65100" stroke-width="1.5"/>
  <line x1="326" y1="115" x2="350" y2="115" stroke="#e65100" stroke-width="2"/>
  <text x="355" y="119" font-size="9" fill="#e65100">Synsnerve</text>
  <!-- Blinde flekk -->
  <circle cx="296" cy="115" r="5" fill="#e65100"/>
  <text x="285" y="140" font-size="8" fill="#555">Blind­flekk</text>
  <!-- Gul flekk -->
  <circle cx="265" cy="115" r="6" fill="#fdd835"/>
  <text x="248" y="100" font-size="8" fill="#f9a825">Gul­flekk</text>
  <!-- Lysstrålene -->
  <path d="M30,90 L120,108" stroke="#f9a825" stroke-width="1" stroke-dasharray="4,3"/>
  <path d="M30,115 L120,115" stroke="#f9a825" stroke-width="1" stroke-dasharray="4,3"/>
  <path d="M30,140 L120,122" stroke="#f9a825" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="20" y="110" font-size="9" fill="#f9a825">Lys</text>
  <!-- Forvendt bilde pil -->
  <path d="M190,85 Q220,115 190,145" stroke="#555" stroke-width="1" stroke-dasharray="3,3" fill="none"/>
  <text x="200" y="158" font-size="8" fill="#555" font-style="italic">Bildet er invertert på netthinnen</text>
  <!-- Stavformede/kjegle-note -->
  <text x="390" y="50" font-size="10" font-weight="bold" fill="#333">Fotoreseptorer:</text>
  <text x="390" y="68" font-size="9" fill="#555">Staver (~120 mill.)</text>
  <text x="390" y="80" font-size="8" fill="#555">  Svart/hvitt, svakt lys</text>
  <text x="390" y="92" font-size="9" fill="#555">Tapper (~6 mill.)</text>
  <text x="390" y="104" font-size="8" fill="#555">  Fargesyn, skarpt syn</text>
  <text x="390" y="116" font-size="8" fill="#555">  Konsentrert i gul­flekken</text>
</svg>`, width: 1.0}
],

'hjernen.html': [
{caption: 'Hjernens lobeinndeling og funksjoner', svg: `
<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="210" fill="#fafafa"/>
  <text x="180" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Hjernens lober (lateralt snitt)</text>
  <!-- Hjerne-silhuett -->
  <path d="M60,160 Q50,120 55,90 Q60,60 80,45 Q100,30 130,28 Q160,26 185,35 Q210,44 225,55 Q245,40 265,38 Q295,35 310,50 Q330,65 325,90 Q340,95 345,115 Q350,140 335,160 Q320,175 295,178 Q265,182 240,175 Q215,180 190,178 Q160,182 130,175 Q100,168 80,160 Z" fill="#fff9c4" stroke="#888" stroke-width="1.5"/>
  <!-- Panne­lapp -->
  <path d="M60,160 Q50,120 55,90 Q60,60 80,45 Q100,30 130,28 Q155,26 178,38 L185,145 Q130,158 80,160 Z" fill="rgba(255,152,0,0.3)" stroke="#e65100" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="115" y="95" text-anchor="middle" font-size="9" font-weight="bold" fill="#e65100">Pannelapp</text>
  <text x="115" y="107" text-anchor="middle" font-size="8" fill="#e65100">Planlegging, personlighet</text>
  <text x="115" y="117" text-anchor="middle" font-size="8" fill="#e65100">motorikk, språkproduksjon</text>
  <!-- Isse­lapp -->
  <path d="M178,38 Q210,44 245,42 L248,100 L185,145 Z" fill="rgba(33,150,243,0.2)" stroke="#1565c0" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="212" y="80" text-anchor="middle" font-size="9" font-weight="bold" fill="#1565c0">Isselapp</text>
  <text x="212" y="92" text-anchor="middle" font-size="8" fill="#1565c0">Sanseinformasjon</text>
  <text x="212" y="102" text-anchor="middle" font-size="8" fill="#1565c0">kropp, rom</text>
  <!-- Bakhodelapp -->
  <path d="M248,100 L310,50 Q330,65 325,90 Q340,95 345,115 Q350,140 335,160 Q315,178 285,178 L248,140 Z" fill="rgba(76,175,80,0.2)" stroke="#2e7d32" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="300" y="120" text-anchor="middle" font-size="9" font-weight="bold" fill="#1b5e20">Bakhodelapp</text>
  <text x="300" y="132" text-anchor="middle" font-size="8" fill="#1b5e20">Syn, visuell</text>
  <text x="300" y="142" text-anchor="middle" font-size="8" fill="#1b5e20">bearbeiding</text>
  <!-- Tinningelapp -->
  <path d="M185,145 L248,140 L285,178 Q265,182 240,175 Q215,180 190,178 Q160,182 130,175 Q100,168 80,160 L185,145 Z" fill="rgba(156,39,176,0.2)" stroke="#7b1fa2" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="185" y="170" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a1b9a">Tinningelapp</text>
  <text x="185" y="182" text-anchor="middle" font-size="8" fill="#6a1b9a">Hørsel, hukommelse, språkforståelse</text>
  <!-- Lillehjernen -->
  <ellipse cx="310" cy="178" rx="38" ry="24" fill="rgba(255,167,38,0.3)" stroke="#e65100" stroke-width="1.5"/>
  <text x="310" y="174" text-anchor="middle" font-size="9" font-weight="bold" fill="#e65100">Lillehjerne</text>
  <text x="310" y="184" text-anchor="middle" font-size="8" fill="#e65100">Balanse, koordinasjon</text>
  <!-- Hjernestammen -->
  <rect x="355" y="145" width="30" height="45" rx="8" fill="rgba(244,67,54,0.2)" stroke="#c62828" stroke-width="1.5"/>
  <text x="370" y="165" text-anchor="middle" font-size="9" font-weight="bold" fill="#c62828">Hjerne­stamme</text>
  <text x="370" y="178" text-anchor="middle" font-size="8" fill="#c62828">Pust, puls,</text>
  <text x="370" y="188" text-anchor="middle" font-size="8" fill="#c62828">bevissthet</text>
</svg>`, width: 1.0}
],

'mikrobiologi.html': [
{caption: 'Bakterie vs. virus – struktur og størrelse', svg: `
<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="210" fill="#fafafa"/>
  <text x="130" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Bakterie</text>
  <text x="390" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Virus (bakteriofag)</text>
  <!-- Bakterie -->
  <ellipse cx="130" cy="105" rx="90" ry="60" fill="#c8e6c9" stroke="#2e7d32" stroke-width="2"/>
  <text x="130" y="55" text-anchor="middle" font-size="8" fill="#1b5e20">Cellevegg + cellemembran</text>
  <!-- Nukleoid -->
  <ellipse cx="115" cy="100" rx="35" ry="24" fill="#a5d6a7" stroke="#388e3c" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="115" y="97" text-anchor="middle" font-size="8" fill="#1b5e20">Nukleoid</text>
  <text x="115" y="107" text-anchor="middle" font-size="8" fill="#1b5e20">(DNA-ring)</text>
  <!-- Ribosomer -->
  <circle cx="160" cy="92" r="4" fill="#388e3c"/><circle cx="170" cy="104" r="4" fill="#388e3c"/>
  <circle cx="155" cy="112" r="4" fill="#388e3c"/>
  <text x="175" y="118" font-size="8" fill="#2e7d32">70S ribosomer</text>
  <!-- Plasmid -->
  <ellipse cx="100" cy="130" rx="15" ry="10" fill="none" stroke="#1565c0" stroke-width="1.5" stroke-dasharray="2,2"/>
  <text x="80" y="152" font-size="8" fill="#1565c0">Plasmid</text>
  <!-- Flagell -->
  <path d="M220,95 Q245,80 242,105 Q238,125 255,118" fill="none" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="242" y="140" font-size="8" fill="#1b5e20">Flagell</text>
  <!-- Størrelse -->
  <text x="130" y="185" text-anchor="middle" font-size="9" fill="#555" font-style="italic">Størrelse: 0,5–5 µm · Prokaryot · Kan formere seg alene</text>
  <!-- Virus (bakteriofag) -->
  <!-- Hode (ikosaeder) -->
  <polygon points="390,30 420,45 420,75 390,90 360,75 360,45" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="390" y="62" text-anchor="middle" font-size="9" font-weight="bold" fill="#b71c1c">DNA</text>
  <text x="390" y="74" text-anchor="middle" font-size="8" fill="#c62828">Protein­kapsid</text>
  <!-- Hale -->
  <line x1="390" y1="90" x2="390" y2="130" stroke="#c62828" stroke-width="3"/>
  <!-- Baseplate -->
  <rect x="372" y="130" width="36" height="8" rx="2" fill="#c62828"/>
  <!-- Fibrer -->
  <line x1="372" y1="138" x2="355" y2="158" stroke="#c62828" stroke-width="1.5"/>
  <line x1="381" y1="138" x2="370" y2="160" stroke="#c62828" stroke-width="1.5"/>
  <line x1="399" y1="138" x2="410" y2="160" stroke="#c62828" stroke-width="1.5"/>
  <line x1="408" y1="138" x2="425" y2="158" stroke="#c62828" stroke-width="1.5"/>
  <text x="390" y="175" text-anchor="middle" font-size="8" fill="#c62828">Hale­fibrer (fester til vert)</text>
  <!-- Størrelse -->
  <text x="390" y="190" text-anchor="middle" font-size="9" fill="#555" font-style="italic">Størrelse: 20–300 nm · Ikke-levende · Trenger vertscelle</text>
  <text x="390" y="202" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Kun arvemateriale (DNA/RNA) + proteinkapsid</text>
</svg>`, width: 1.0}
],

'fordoyelsen.html': [
{caption: 'Fordøyelseskanalen fra munn til endetarm', svg: `
<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="240" fill="#fff8f0"/>
  <text x="190" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Fordøyelsessystemet</text>
  <!-- Munn -->
  <ellipse cx="190" cy="32" rx="28" ry="14" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="190" y="36" text-anchor="middle" font-size="9" fill="#b71c1c">Munn</text>
  <text x="230" y="36" font-size="8" fill="#555">Mekanisk/kjemisk fordøyelse</text>
  <text x="230" y="46" font-size="8" fill="#555">Amylase (spytt) → stivelse</text>
  <!-- Spiserøret -->
  <rect x="182" y="46" width="16" height="28" rx="4" fill="#ffab91" stroke="#e64a19" stroke-width="1"/>
  <text x="205" y="62" font-size="8" fill="#555">Spiserøret</text>
  <!-- Magen -->
  <path d="M175,74 Q148,78 140,96 Q132,115 145,132 Q160,148 188,148 Q208,148 218,132 Q228,115 218,96 Q210,78 190,74 Z" fill="#ffcc80" stroke="#e65100" stroke-width="1.5"/>
  <text x="180" y="108" text-anchor="middle" font-size="9" font-weight="bold" fill="#e65100">Magen</text>
  <text x="180" y="120" text-anchor="middle" font-size="8" fill="#e65100">HCl (pH 1–2)</text>
  <text x="180" y="130" text-anchor="middle" font-size="8" fill="#e65100">Pepsin → proteiner</text>
  <text x="260" y="100" font-size="8" fill="#555">Lever →</text>
  <text x="260" y="110" font-size="8" fill="#555">Galle</text>
  <text x="260" y="122" font-size="8" fill="#555">Pankreas →</text>
  <text x="260" y="132" font-size="8" fill="#555">Enzymer</text>
  <!-- Tynntarm -->
  <path d="M188,148 Q195,155 190,168 Q182,178 188,190 Q196,200 204,190 Q212,178 204,165 Q198,155 205,148" fill="#c8e6c9" stroke="#388e3c" stroke-width="1.5"/>
  <text x="140" y="170" font-size="9" font-weight="bold" fill="#1b5e20">Tynntarm</text>
  <text x="140" y="182" font-size="8" fill="#1b5e20">(6–7 m)</text>
  <text x="140" y="194" font-size="8" fill="#555">Enzym­fordøyelse</text>
  <text x="140" y="204" font-size="8" fill="#555">+ absorpsjon</text>
  <!-- Tykktarm -->
  <path d="M204,148 Q220,148 230,162 Q238,178 232,192 Q226,206 218,210 Q208,215 200,210 Q192,206 190,196" fill="#b3e5fc" stroke="#0288d1" stroke-width="1.5"/>
  <text x="248" y="178" font-size="9" font-weight="bold" fill="#0288d1">Tykktarm</text>
  <text x="248" y="190" font-size="8" fill="#0288d1">(1,5 m)</text>
  <text x="248" y="202" font-size="8" fill="#555">Vann­absorpsjon</text>
  <!-- Endetarm -->
  <rect x="183" y="218" width="22" height="16" rx="4" fill="#9e9e9e" stroke="#616161" stroke-width="1.5"/>
  <text x="194" y="230" text-anchor="middle" font-size="8" fill="#333">Endetarm</text>
  <!-- Piler næringsstoffer -->
  <text x="400" y="30" font-size="10" font-weight="bold" fill="#333">Absorpsjon i tynntarmen:</text>
  <text x="400" y="48" font-size="9" fill="#1b5e20">• Monosakkarider (glukose)</text>
  <text x="400" y="62" font-size="9" fill="#1b5e20">• Aminosyrer</text>
  <text x="400" y="76" font-size="9" fill="#1b5e20">• Fettsyrer + glyserol</text>
  <text x="400" y="90" font-size="9" fill="#1b5e20">• Vitaminer og mineraler</text>
  <text x="400" y="104" font-size="9" fill="#1b5e20">• Vann</text>
  <text x="400" y="126" font-size="9" font-weight="bold" fill="#555">Villi og mikrovilli:</text>
  <text x="400" y="140" font-size="8" fill="#555">Fingerformede utbuktninger</text>
  <text x="400" y="152" font-size="8" fill="#555">øker overflaten til ~250 m²</text>
  <text x="400" y="174" font-size="9" font-weight="bold" fill="#555">Tykktarmen:</text>
  <text x="400" y="188" font-size="8" fill="#555">Tarmflora (100 bill. bakterier)</text>
  <text x="400" y="200" font-size="8" fill="#555">produserer vitamin K og B12</text>
</svg>`, width: 1.0}
],

'hormonsystemet.html': [
{caption: 'Hormonsystemets kjertelorganer og negativ tilbakekobling', svg: `
<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="230" fill="#fafafa"/>
  <text x="175" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Endokrine kjertler</text>
  <defs><marker id="arh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <!-- Kropp-silhuett forenklet -->
  <!-- Hypotalamus + hypofyse -->
  <ellipse cx="145" cy="40" rx="32" ry="18" fill="#e1bee7" stroke="#7b1fa2" stroke-width="1.5"/>
  <text x="145" y="37" text-anchor="middle" font-size="8" font-weight="bold" fill="#4a148c">Hypotalamus</text>
  <text x="145" y="48" text-anchor="middle" font-size="7" fill="#7b1fa2">+ Hypofyse</text>
  <text x="75" y="42" font-size="8" fill="#555">Overordnet kontroll­senter</text>
  <text x="75" y="52" font-size="8" fill="#555">CRH, TRH, GnRH m.fl.</text>
  <!-- Skjoldbruskkjertelen -->
  <ellipse cx="145" cy="85" rx="26" ry="14" fill="#b3e5fc" stroke="#0288d1" stroke-width="1.5"/>
  <text x="145" y="82" text-anchor="middle" font-size="8" font-weight="bold" fill="#01579b">Skjold­brusk</text>
  <text x="145" y="93" text-anchor="middle" font-size="7" fill="#0288d1">T3, T4 – metabolisme</text>
  <!-- Binyrer -->
  <ellipse cx="110" cy="135" rx="22" ry="12" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="110" y="132" text-anchor="middle" font-size="8" font-weight="bold" fill="#b71c1c">Binyre</text>
  <text x="110" y="142" text-anchor="middle" font-size="7" fill="#c62828">Kortisol, adrenalin</text>
  <ellipse cx="180" cy="135" rx="22" ry="12" fill="#ffcdd2" stroke="#c62828" stroke-width="1.5"/>
  <text x="180" y="132" text-anchor="middle" font-size="8" font-weight="bold" fill="#b71c1c">Binyre</text>
  <text x="180" y="142" text-anchor="middle" font-size="7" fill="#c62828">Kortisol, adrenalin</text>
  <!-- Pankreas -->
  <ellipse cx="145" cy="175" rx="35" ry="14" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="145" y="172" text-anchor="middle" font-size="8" font-weight="bold" fill="#1b5e20">Bukspyttkjertelen</text>
  <text x="145" y="182" text-anchor="middle" font-size="7" fill="#2e7d32">Insulin, glukagon – blodsukker</text>
  <!-- Kjønnsk­jertler -->
  <ellipse cx="100" cy="210" rx="28" ry="12" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <text x="100" y="207" text-anchor="middle" font-size="8" fill="#e65100">Testikkel/Eggstokk</text>
  <text x="100" y="218" text-anchor="middle" font-size="7" fill="#f57f17">Testosteron, østrogen</text>
  <!-- Piler -->
  <path d="M145,58 L145,70" stroke="#7b1fa2" stroke-width="1.5" marker-end="url(#arh)" fill="none"/>
  <path d="M135,99 L118,122" stroke="#0288d1" stroke-width="1.5" marker-end="url(#arh)" fill="none"/>
  <path d="M155,99 L172,122" stroke="#0288d1" stroke-width="1.5" marker-end="url(#arh)" fill="none"/>
  <path d="M145,147 L145,160" stroke="#2e7d32" stroke-width="1.5" marker-end="url(#arh)" fill="none"/>
  <!-- Negativ tilbakekobling -->
  <rect x="320" y="20" width="180" height="185" rx="10" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="1.5"/>
  <text x="410" y="38" text-anchor="middle" font-size="10" font-weight="bold" fill="#4a148c">Negativ tilbakekobling</text>
  <text x="410" y="52" text-anchor="middle" font-size="8" fill="#555">(eksempel: tyreoidea-aksen)</text>
  <ellipse cx="410" cy="78" rx="40" ry="16" fill="#e1bee7" stroke="#7b1fa2" stroke-width="1"/>
  <text x="410" y="82" text-anchor="middle" font-size="8" font-weight="bold" fill="#4a148c">Hypotalamus → TRH</text>
  <path d="M410,94 L410,108" stroke="#7b1fa2" stroke-width="1.5" marker-end="url(#arh)" fill="none"/>
  <ellipse cx="410" cy="122" rx="40" ry="14" fill="#b3e5fc" stroke="#0288d1" stroke-width="1"/>
  <text x="410" y="126" text-anchor="middle" font-size="8" fill="#01579b">Hypofyse → TSH</text>
  <path d="M410,136 L410,150" stroke="#0288d1" stroke-width="1.5" marker-end="url(#arh)" fill="none"/>
  <ellipse cx="410" cy="162" rx="40" ry="14" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1"/>
  <text x="410" y="166" text-anchor="middle" font-size="8" fill="#1b5e20">Skjoldbrusk → T3/T4</text>
  <!-- Tilbakekobling-pil -->
  <path d="M450,162 Q490,162 490,80 L450,80" stroke="#c62828" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arh)" fill="none"/>
  <text x="493" y="125" font-size="8" fill="#c62828" transform="rotate(90,493,125)">↑ T3/T4 hemmer TRH og TSH</text>
</svg>`, width: 1.0}
],

'optikk.html': [
{caption: 'Refraksjonsdiagram og lysets spekter', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <text x="130" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Refraksjons­loven (Snell)</text>
  <text x="390" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Elektromagnetisk spekter</text>
  <defs>
    <linearGradient id="spectr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8e24aa"/><stop offset="20%" stop-color="#1e88e5"/>
      <stop offset="40%" stop-color="#43a047"/><stop offset="60%" stop-color="#fdd835"/>
      <stop offset="80%" stop-color="#fb8c00"/><stop offset="100%" stop-color="#e53935"/>
    </linearGradient>
  </defs>
  <!-- Grenseflate -->
  <line x1="20" y1="110" x2="240" y2="110" stroke="#888" stroke-width="1.5" stroke-dasharray="6,3"/>
  <rect x="20" y="110" width="220" height="80" rx="0" fill="rgba(179,229,252,0.3)"/>
  <text x="130" y="130" text-anchor="middle" font-size="9" fill="#0288d1">Tettere medium (glass/vann)</text>
  <!-- Innfallslodd -->
  <line x1="130" y1="20" x2="130" y2="190" stroke="#bbb" stroke-width="1" stroke-dasharray="4,3"/>
  <!-- Innfallende stråle -->
  <line x1="60" y1="40" x2="130" y2="110" stroke="#f9a825" stroke-width="2.5"/>
  <path d="M125,110 L130,110 L130,105" fill="none" stroke="#f9a825" stroke-width="1"/>
  <!-- Reflektert stråle -->
  <line x1="130" y1="110" x2="200" y2="40" stroke="#f9a825" stroke-width="1.5" stroke-dasharray="4,3"/>
  <!-- Brutt stråle -->
  <line x1="130" y1="110" x2="155" y2="185" stroke="#1565c0" stroke-width="2.5"/>
  <!-- Vinkler -->
  <path d="M130,110 Q115,90 115,75" fill="none" stroke="#e65100" stroke-width="1"/>
  <text x="100" y="80" font-size="9" fill="#e65100">θ₁</text>
  <path d="M130,110 Q143,128 145,142" fill="none" stroke="#1565c0" stroke-width="1"/>
  <text x="148" y="140" font-size="9" fill="#1565c0">θ₂</text>
  <!-- Snells lov -->
  <rect x="20" y="155" width="220" height="38" rx="5" fill="#e3f2fd" stroke="#1565c0" stroke-width="1"/>
  <text x="130" y="170" text-anchor="middle" font-size="11" fill="#0d47a1">n₁ · sin θ₁ = n₂ · sin θ₂</text>
  <text x="130" y="185" text-anchor="middle" font-size="8" fill="#555">n_luft=1,0 · n_vann=1,33 · n_glass=1,5</text>
  <!-- EM spekter -->
  <rect x="270" y="28" width="240" height="30" rx="6" fill="url(#spectr)"/>
  <g font-size="8" text-anchor="middle" fill="white" font-weight="bold">
    <text x="280" y="47">UV</text><text x="305" y="47">Fiolett</text>
    <text x="335" y="47">Blå</text><text x="365" y="47">Grønn</text>
    <text x="395" y="47">Gul</text><text x="425" y="47">Oransje</text>
    <text x="500" y="47">Rød</text>
  </g>
  <text x="270" y="72" font-size="8" fill="#8e24aa">← Kortere λ, mer energi</text>
  <text x="480" y="72" text-anchor="end" font-size="8" fill="#e53935">Lengre λ, mindre energi →</text>
  <!-- Prisme-illustrasjon -->
  <polygon points="350,90 310,160 390,160" fill="rgba(179,229,252,0.5)" stroke="#0288d1" stroke-width="1.5"/>
  <line x1="285" y1="115" x2="330" y2="125" stroke="white" stroke-width="2"/>
  <line x1="375" y1="138" x2="410" y2="118" stroke="#8e24aa" stroke-width="1.5"/>
  <line x1="375" y1="140" x2="412" y2="128" stroke="#1e88e5" stroke-width="1.5"/>
  <line x1="375" y1="143" x2="413" y2="140" stroke="#43a047" stroke-width="1.5"/>
  <line x1="375" y1="146" x2="412" y2="152" stroke="#fdd835" stroke-width="1.5"/>
  <line x1="375" y1="149" x2="410" y2="162" stroke="#e53935" stroke-width="1.5"/>
  <text x="350" y="178" text-anchor="middle" font-size="9" fill="#555">Prisme splitter hvitt lys i spekterfarger</text>
  <text x="350" y="190" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Regenbue: vanndråper som prisme</text>
</svg>`, width: 1.0}
],

'krefter_bevegelse_teori.html': [
{caption: 'Friksjons- og kraftdiagram (fritt legeme)', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <text x="130" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Fritt legeme-diagram</text>
  <text x="390" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Newtons 3 lover</text>
  <defs><marker id="ark" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="context-stroke" stroke-width="2"/></marker></defs>
  <!-- Overflate -->
  <rect x="30" y="130" width="200" height="8" rx="2" fill="#888"/>
  <line x1="30" y1="138" x2="230" y2="138" stroke="#555" stroke-width="1"/>
  <!-- Kloss -->
  <rect x="90" y="100" width="60" height="30" rx="3" fill="#90caf9" stroke="#1565c0" stroke-width="2"/>
  <text x="120" y="119" text-anchor="middle" font-size="10" fill="#0d47a1">m = 5 kg</text>
  <!-- Normalkraft opp -->
  <path d="M120,100 L120,62" stroke="#2e7d32" stroke-width="2.5" marker-end="url(#ark)" fill="none"/>
  <text x="128" y="78" font-size="9" fill="#1b5e20">N (normal­kraft)</text>
  <!-- Tyngde ned -->
  <path d="M120,130 L120,168" stroke="#c62828" stroke-width="2.5" marker-end="url(#ark)" fill="none"/>
  <text x="128" y="158" font-size="9" fill="#c62828">G = m·g = 49 N</text>
  <!-- Friksjon -->
  <path d="M90,115 L52,115" stroke="#f57f17" stroke-width="2.5" marker-end="url(#ark)" fill="none"/>
  <text x="30" y="110" font-size="9" fill="#e65100">Ff = μ·N</text>
  <!-- Kraft høyre -->
  <path d="M150,115 L188,115" stroke="#7b1fa2" stroke-width="2.5" marker-end="url(#ark)" fill="none"/>
  <text x="190" y="110" font-size="9" fill="#6a1b9a">F = 20 N</text>
  <!-- Resultat -->
  <text x="120" y="188" text-anchor="middle" font-size="9" fill="#333">F_res = F − Ff = m·a</text>
  <!-- Newtons lover -->
  <rect x="270" y="25" width="240" height="160" rx="8" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="1"/>
  <text x="390" y="45" text-anchor="middle" font-size="9" font-weight="bold" fill="#4a148c">1. lov – Treghetslov</text>
  <text x="390" y="58" text-anchor="middle" font-size="8" fill="#555">Et legeme er i ro eller beveger seg</text>
  <text x="390" y="68" text-anchor="middle" font-size="8" fill="#555">rettlinjet med konstant fart med</text>
  <text x="390" y="78" text-anchor="middle" font-size="8" fill="#555">mindre det påvirkes av en kraft.</text>
  <line x1="280" y1="84" x2="500" y2="84" stroke="#e1bee7" stroke-width="1"/>
  <text x="390" y="98" text-anchor="middle" font-size="9" font-weight="bold" fill="#4a148c">2. lov – Kraftlov</text>
  <text x="390" y="112" text-anchor="middle" font-size="13" fill="#1565c0">F = m · a</text>
  <text x="390" y="126" text-anchor="middle" font-size="8" fill="#555">Kraft (N) = masse (kg) × akselerasjon (m/s²)</text>
  <line x1="280" y1="132" x2="500" y2="132" stroke="#e1bee7" stroke-width="1"/>
  <text x="390" y="146" text-anchor="middle" font-size="9" font-weight="bold" fill="#4a148c">3. lov – Aksjon/reaksjon</text>
  <text x="390" y="160" text-anchor="middle" font-size="8" fill="#555">For enhver kraft finnes en like stor</text>
  <text x="390" y="170" text-anchor="middle" font-size="8" fill="#555">og motsatt kraft. F₁₂ = −F₂₁</text>
</svg>`, width: 1.0}
],

'kommunikasjonsteknologi.html': [
{caption: 'Sender–kanal–mottaker og signalmodulasjon', svg: `
<svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="180" fill="#fafafa"/>
  <defs><marker id="arko" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#1565c0" stroke-width="2"/></marker></defs>
  <!-- Kommunikasjonsmodell -->
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Sender–Kanal–Mottaker</text>
  <!-- Sender -->
  <rect x="20" y="30" width="80" height="50" rx="8" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="60" y="52" text-anchor="middle" font-size="9" font-weight="bold" fill="#0d47a1">Sender</text>
  <text x="60" y="64" text-anchor="middle" font-size="8" fill="#1565c0">Koder informasjon</text>
  <text x="60" y="74" text-anchor="middle" font-size="8" fill="#1565c0">til signal</text>
  <!-- Pil -->
  <path d="M100,55 L170,55" stroke="#1565c0" stroke-width="1.5" marker-end="url(#arko)" fill="none"/>
  <!-- Kanal -->
  <rect x="170" y="30" width="140" height="50" rx="8" fill="#e8f5e9" stroke="#388e3c" stroke-width="1.5"/>
  <text x="240" y="52" text-anchor="middle" font-size="9" font-weight="bold" fill="#1b5e20">Kanal/Medium</text>
  <text x="240" y="64" text-anchor="middle" font-size="8" fill="#2e7d32">Luft, kabel, fiber,</text>
  <text x="240" y="74" text-anchor="middle" font-size="8" fill="#2e7d32">radiobølger, lys</text>
  <!-- Støy -->
  <text x="240" y="96" text-anchor="middle" font-size="8" fill="#c62828">⚡ Støy/interferens</text>
  <!-- Pil -->
  <path d="M310,55 L380,55" stroke="#1565c0" stroke-width="1.5" marker-end="url(#arko)" fill="none"/>
  <!-- Mottaker -->
  <rect x="380" y="30" width="120" height="50" rx="8" fill="#fce4ec" stroke="#c62828" stroke-width="1.5"/>
  <text x="440" y="52" text-anchor="middle" font-size="9" font-weight="bold" fill="#b71c1c">Mottaker</text>
  <text x="440" y="64" text-anchor="middle" font-size="8" fill="#c62828">Dekoder signal</text>
  <text x="440" y="74" text-anchor="middle" font-size="8" fill="#c62828">til informasjon</text>
  <!-- AM vs FM -->
  <text x="130" y="115" text-anchor="middle" font-size="10" font-weight="bold" fill="#333">AM-modulasjon</text>
  <text x="390" y="115" text-anchor="middle" font-size="10" font-weight="bold" fill="#333">FM-modulasjon</text>
  <!-- AM signal -->
  <path d="M20,145 Q30,132 40,145 Q50,158 60,145 Q70,128 80,145 Q90,162 100,145 Q110,135 120,145 Q130,136 140,145 Q150,140 160,145 Q170,143 180,145 Q190,144 200,145 Q210,143 220,145 Q230,144 240,145" fill="none" stroke="#1565c0" stroke-width="1.5"/>
  <text x="130" y="165" text-anchor="middle" font-size="8" fill="#555">Amplitude varierer</text>
  <!-- FM signal -->
  <path d="M270,145 Q276,135 282,145 Q288,155 294,145 Q298,136 302,145 Q305,150 308,145 Q310,140 312,145 Q315,138 318,145 Q322,140 326,145 Q332,135 338,145 Q346,155 354,145 Q360,135 366,145 Q375,135 384,145 Q392,155 400,145 Q404,139 408,145 Q414,136 420,145 Q428,155 436,145 Q440,138 444,145 Q452,135 460,145 Q468,155 476,145 Q481,138 486,145 Q494,135 502,145" fill="none" stroke="#c62828" stroke-width="1.5"/>
  <text x="390" y="165" text-anchor="middle" font-size="8" fill="#555">Frekvens varierer (bedre kvalitet)</text>
</svg>`, width: 1.0}
],

'astronomi.html': [
{caption: 'Solsystemet og månefaser', svg: `
<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="220" fill="#0a0a1a"/>
  <text x="170" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="white">Solsystemet (ikke i skala)</text>
  <text x="420" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="white">Månefaser</text>
  <!-- Sol -->
  <circle cx="30" cy="100" r="22" fill="#fdd835" stroke="#f9a825" stroke-width="2"/>
  <text x="30" y="104" text-anchor="middle" font-size="8" fill="#333" font-weight="bold">Sol</text>
  <!-- Planeter med baner -->
  <g fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5">
    <circle cx="30" cy="100" r="42"/><circle cx="30" cy="100" r="58"/>
    <circle cx="30" cy="100" r="75"/><circle cx="30" cy="100" r="98"/>
    <circle cx="30" cy="100" r="118"/><circle cx="30" cy="100" r="138"/>
    <circle cx="30" cy="100" r="155"/><circle cx="30" cy="100" r="170"/>
  </g>
  <circle cx="72" cy="100" r="3" fill="#b0bec5"/><text x="72" y="92" text-anchor="middle" font-size="7" fill="#ccc">Merkur</text>
  <circle cx="88" cy="100" r="5" fill="#ffcc80"/><text x="88" y="90" text-anchor="middle" font-size="7" fill="#ccc">Venus</text>
  <circle cx="105" cy="100" r="5" fill="#4fc3f7"/><text x="105" y="90" text-anchor="middle" font-size="7" fill="#4fc3f7">Jorda</text>
  <circle cx="128" cy="100" r="4" fill="#ef9a9a"/><text x="128" y="90" text-anchor="middle" font-size="7" fill="#ccc">Mars</text>
  <circle cx="148" cy="100" r="10" fill="#ffe0b2"/><text x="148" y="86" text-anchor="middle" font-size="7" fill="#ccc">Jupiter</text>
  <circle cx="168" cy="100" r="8" fill="#fff9c4"/><text x="168" y="88" text-anchor="middle" font-size="7" fill="#ccc">Saturn</text>
  <circle cx="185" cy="100" r="6" fill="#b3e5fc"/><text x="185" y="90" text-anchor="middle" font-size="7" fill="#ccc">Uranus</text>
  <circle cx="200" cy="100" r="6" fill="#7986cb"/><text x="200" y="90" text-anchor="middle" font-size="7" fill="#ccc">Neptun</text>
  <!-- Månefaser -->
  <circle cx="420" cy="120" r="18" fill="#fdd835" stroke="#f9a825" stroke-width="1.5"/>
  <text x="420" y="124" text-anchor="middle" font-size="7" fill="#333">Sol</text>
  <!-- Månebaner og faser -->
  <circle cx="420" cy="120" r="70" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
  <!-- 8 månefaser rundt -->
  <!-- Nymåne (høyre, sett fra sol) -->
  <circle cx="490" cy="120" r="10" fill="#222" stroke="#555" stroke-width="1"/><text x="490" y="107" text-anchor="middle" font-size="7" fill="#aaa">Ny­måne</text>
  <!-- Voksende halvmåne -->
  <circle cx="470" cy="71" r="10" fill="#222" stroke="#555" stroke-width="1"/>
  <path d="M470,61 Q480,71 470,81 Q462,71 470,61" fill="white"/>
  <!-- Halvmåne -->
  <circle cx="420" cy="50" r="10" fill="#222" stroke="#555" stroke-width="1"/>
  <rect x="420" y="40" width="10" height="20" fill="white"/>
  <text x="420" y="38" text-anchor="middle" font-size="7" fill="#aaa">1.kv.</text>
  <!-- Fullmåne -->
  <circle cx="350" cy="120" r="10" fill="white" stroke="#ddd" stroke-width="1"/>
  <text x="338" y="110" font-size="7" fill="#aaa">Full­måne</text>
  <!-- Avtagende -->
  <circle cx="420" cy="190" r="10" fill="#222" stroke="#555" stroke-width="1"/>
  <rect x="410" y="180" width="10" height="20" fill="white"/>
  <text x="420" y="205" text-anchor="middle" font-size="7" fill="#aaa">3.kv.</text>
</svg>`, width: 1.0}
],

'energiproduksjon.html': [
{caption: 'CO₂-utslipp per kWh – livsløpsanalyse', svg: `
<svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="190" fill="#f8fdf4"/>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Livsløps-CO₂ per kWh – ulike energikilder</text>
  <text x="30" y="34" font-size="9" fill="#888">g CO₂/kWh</text>
  <line x1="50" y1="22" x2="50" y2="165" stroke="#888" stroke-width="1.5"/>
  <line x1="50" y1="165" x2="510" y2="165" stroke="#888" stroke-width="1.5"/>
  <!-- Referanselinjer -->
  <line x1="50" y1="50" x2="510" y2="50" stroke="#eee" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="44" y="54" text-anchor="end" font-size="8" fill="#aaa">750</text>
  <line x1="50" y1="100" x2="510" y2="100" stroke="#eee" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="44" y="104" text-anchor="end" font-size="8" fill="#aaa">500</text>
  <line x1="50" y1="130" x2="510" y2="130" stroke="#eee" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="44" y="134" text-anchor="end" font-size="8" fill="#aaa">250</text>
  <!-- Kull: 900 -->
  <rect x="62" y="29" width="52" height="136" rx="3" fill="rgba(80,80,80,0.6)" stroke="#555" stroke-width="1"/>
  <text x="88" y="25" text-anchor="middle" font-size="8" font-weight="bold" fill="#555">900</text>
  <text x="88" y="178" text-anchor="middle" font-size="8" fill="#555">Kull</text>
  <!-- Olje: 650 -->
  <rect x="128" y="57" width="52" height="108" rx="3" fill="rgba(100,80,60,0.5)" stroke="#7d4e3a" stroke-width="1"/>
  <text x="154" y="53" text-anchor="middle" font-size="8" font-weight="bold" fill="#7d4e3a">650</text>
  <text x="154" y="178" text-anchor="middle" font-size="8" fill="#7d4e3a">Olje</text>
  <!-- Gass: 490 -->
  <rect x="194" y="84" width="52" height="81" rx="3" fill="rgba(100,120,200,0.45)" stroke="#5c7fd0" stroke-width="1"/>
  <text x="220" y="80" text-anchor="middle" font-size="8" font-weight="bold" fill="#5c7fd0">490</text>
  <text x="220" y="178" text-anchor="middle" font-size="8" fill="#5c7fd0">Gass</text>
  <!-- Biomasse: 230 -->
  <rect x="260" y="127" width="52" height="38" rx="3" fill="rgba(120,180,80,0.45)" stroke="#6aad3c" stroke-width="1"/>
  <text x="286" y="123" text-anchor="middle" font-size="8" font-weight="bold" fill="#6aad3c">230</text>
  <text x="286" y="178" text-anchor="middle" font-size="8" fill="#6aad3c">Bio</text>
  <!-- Sol: 40 -->
  <rect x="326" y="158" width="44" height="7" rx="2" fill="rgba(240,200,60,0.7)" stroke="#d4a800" stroke-width="1"/>
  <text x="348" y="154" text-anchor="middle" font-size="8" font-weight="bold" fill="#d4a800">40</text>
  <text x="348" y="178" text-anchor="middle" font-size="8" fill="#d4a800">Sol</text>
  <!-- Kjerne: 12 -->
  <rect x="384" y="163" width="44" height="2" rx="1" fill="rgba(150,80,220,0.7)" stroke="#7b2cbf" stroke-width="1"/>
  <text x="406" y="158" text-anchor="middle" font-size="8" font-weight="bold" fill="#7b2cbf">12</text>
  <text x="406" y="178" text-anchor="middle" font-size="8" fill="#7b2cbf">Kjerne</text>
  <!-- Vind: 11 -->
  <rect x="442" y="163" width="44" height="2" rx="1" fill="rgba(60,180,80,0.8)" stroke="#2e7d32" stroke-width="1"/>
  <text x="464" y="158" text-anchor="middle" font-size="8" font-weight="bold" fill="#2e7d32">11</text>
  <text x="464" y="178" text-anchor="middle" font-size="8" fill="#2e7d32">Vind</text>
  <text x="260" y="192" text-anchor="middle" font-size="8" fill="#555" font-style="italic">Inkl. produksjon og installasjon – kull er ca. 80× mer klimaskadelig enn vind</text>
</svg>`, width: 1.0}
],

'samisk_natur.html': [
{caption: 'Tradisjonell samisk naturkunnskap og moderne forvaltning', svg: `
<svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="180" fill="#f0f8f0"/>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#1b5e20">TEK – Tradisjonell Økologisk Kunnskap</text>
  <!-- Sirkler som overlapper (Venn) -->
  <circle cx="160" cy="100" r="72" fill="rgba(46,125,50,0.12)" stroke="#2e7d32" stroke-width="1.5"/>
  <circle cx="260" cy="100" r="72" fill="rgba(21,101,192,0.1)" stroke="#1565c0" stroke-width="1.5"/>
  <circle cx="360" cy="100" r="72" fill="rgba(230,119,0,0.1)" stroke="#e65100" stroke-width="1.5"/>
  <!-- Labels -->
  <text x="100" y="85" text-anchor="middle" font-size="9" font-weight="bold" fill="#1b5e20">Samisk TEK</text>
  <text x="100" y="97" text-anchor="middle" font-size="8" fill="#2e7d32">Generasjoners</text>
  <text x="100" y="107" text-anchor="middle" font-size="8" fill="#2e7d32">observasjoner</text>
  <text x="100" y="117" text-anchor="middle" font-size="8" fill="#2e7d32">Siida-systemet</text>
  <text x="100" y="127" text-anchor="middle" font-size="8" fill="#2e7d32">300+ snøbegreper</text>
  <text x="260" y="75" text-anchor="middle" font-size="9" font-weight="bold" fill="#0d47a1">Samarbeid</text>
  <text x="260" y="87" text-anchor="middle" font-size="8" fill="#1565c0">Co-management</text>
  <text x="260" y="97" text-anchor="middle" font-size="8" fill="#1565c0">Fefo</text>
  <text x="260" y="107" text-anchor="middle" font-size="8" fill="#1565c0">EALÁT-prosjektet</text>
  <text x="260" y="117" text-anchor="middle" font-size="8" fill="#1565c0">ILO-169</text>
  <text x="420" y="85" text-anchor="middle" font-size="9" font-weight="bold" fill="#e65100">Vestlig vitenskap</text>
  <text x="420" y="97" text-anchor="middle" font-size="8" fill="#e65100">Klimamodeller</text>
  <text x="420" y="107" text-anchor="middle" font-size="8" fill="#e65100">GPS-sporing</text>
  <text x="420" y="117" text-anchor="middle" font-size="8" fill="#e65100">Satellittdata</text>
  <!-- Reindrift -->
  <text x="260" y="155" text-anchor="middle" font-size="9" fill="#333" font-style="italic">Reindrift som bærekraftig ressursforvaltning: nomadisk, syklisk, tilpasningsdyktig</text>
  <text x="260" y="168" text-anchor="middle" font-size="8" fill="#555">Transhumance: sesong­vandring mellom kyst og fjell følger naturlige rytmer</text>
</svg>`, width: 1.0}
],

'organisk_kjemi_karusell.html': [
{caption: 'Strukturformlene til de første alkanene, alkenene og alkynene', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <!-- Alkaner -->
  <text x="86" y="18" text-anchor="middle" font-size="10" font-weight="bold" fill="#1565c0">Alkaner (CₙH₂ₙ₊₂)</text>
  <text x="86" y="30" text-anchor="middle" font-size="8" fill="#555">Enkeltbindinger – «mettede»</text>
  <!-- Metan -->
  <text x="86" y="52" text-anchor="middle" font-size="9" fill="#333">CH₄  Metan</text>
  <circle cx="86" cy="72" r="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="86" y="76" text-anchor="middle" font-size="9" font-weight="bold" fill="#1565c0">C</text>
  <circle cx="62" cy="72" r="7" fill="#f5f5f5" stroke="#888" stroke-width="1"/>
  <text x="62" y="76" text-anchor="middle" font-size="8" fill="#555">H</text>
  <circle cx="110" cy="72" r="7" fill="#f5f5f5" stroke="#888" stroke-width="1"/>
  <text x="110" y="76" text-anchor="middle" font-size="8" fill="#555">H</text>
  <circle cx="86" cy="50" r="7" fill="#f5f5f5" stroke="#888" stroke-width="1"/>
  <text x="86" y="54" text-anchor="middle" font-size="8" fill="#555">H</text>
  <circle cx="86" cy="94" r="7" fill="#f5f5f5" stroke="#888" stroke-width="1"/>
  <text x="86" y="98" text-anchor="middle" font-size="8" fill="#555">H</text>
  <line x1="76" y1="72" x2="69" y2="72" stroke="#555" stroke-width="1.5"/>
  <line x1="96" y1="72" x2="103" y2="72" stroke="#555" stroke-width="1.5"/>
  <line x1="86" y1="62" x2="86" y2="57" stroke="#555" stroke-width="1.5"/>
  <line x1="86" y1="82" x2="86" y2="87" stroke="#555" stroke-width="1.5"/>
  <!-- Etan -->
  <text x="86" y="120" text-anchor="middle" font-size="9" fill="#333">C₂H₆  Etan</text>
  <text x="86" y="132" text-anchor="middle" font-size="11" fill="#1565c0">H₃C — CH₃</text>
  <text x="86" y="148" text-anchor="middle" font-size="8" fill="#555">Kokepunkt: −89°C</text>
  <text x="86" y="162" text-anchor="middle" font-size="8" fill="#555">Propan: C₃H₈, bp −42°C</text>
  <text x="86" y="174" text-anchor="middle" font-size="8" fill="#555">Butan: C₄H₁₀, bp −1°C</text>
  <!-- Separator -->
  <line x1="170" y1="10" x2="170" y2="190" stroke="#ddd" stroke-width="1"/>
  <!-- Alkener -->
  <text x="258" y="18" text-anchor="middle" font-size="10" font-weight="bold" fill="#2e7d32">Alkener (CₙH₂ₙ)</text>
  <text x="258" y="30" text-anchor="middle" font-size="8" fill="#555">Dobbeltbinding – «umettede»</text>
  <text x="258" y="52" text-anchor="middle" font-size="9" fill="#333">C₂H₄  Eten (etylen)</text>
  <text x="258" y="75" text-anchor="middle" font-size="13" fill="#2e7d32">H₂C = CH₂</text>
  <text x="258" y="95" text-anchor="middle" font-size="8" fill="#2e7d32">C=C er kortere og sterkere</text>
  <text x="258" y="107" text-anchor="middle" font-size="8" fill="#2e7d32">enn C–C (addisjon­sreaksjoner)</text>
  <text x="258" y="130" text-anchor="middle" font-size="9" fill="#333">C₃H₆  Propen</text>
  <text x="258" y="148" text-anchor="middle" font-size="12" fill="#2e7d32">H₂C=CH—CH₃</text>
  <text x="258" y="170" text-anchor="middle" font-size="8" fill="#555">Polymerisering: eten → polyetylen (PE-plast)</text>
  <!-- Separator -->
  <line x1="345" y1="10" x2="345" y2="190" stroke="#ddd" stroke-width="1"/>
  <!-- Alkyner -->
  <text x="435" y="18" text-anchor="middle" font-size="10" font-weight="bold" fill="#c62828">Alkyner (CₙH₂ₙ₋₂)</text>
  <text x="435" y="30" text-anchor="middle" font-size="8" fill="#555">Trippelbinding</text>
  <text x="435" y="52" text-anchor="middle" font-size="9" fill="#333">C₂H₂  Etyn (acetylen)</text>
  <text x="435" y="75" text-anchor="middle" font-size="13" fill="#c62828">HC ≡ CH</text>
  <text x="435" y="100" text-anchor="middle" font-size="8" fill="#c62828">Lineær molekyl</text>
  <text x="435" y="112" text-anchor="middle" font-size="8" fill="#c62828">C≡C: 839 kJ/mol</text>
  <text x="435" y="135" text-anchor="middle" font-size="9" fill="#555">Bruk:</text>
  <text x="435" y="149" text-anchor="middle" font-size="8" fill="#555">• Sveising (oxy-acetylen)</text>
  <text x="435" y="163" text-anchor="middle" font-size="8" fill="#555">• Syntetisk gummi</text>
  <text x="435" y="177" text-anchor="middle" font-size="8" fill="#555">• PVC-plast (via klorering)</text>
</svg>`, width: 1.0}
],

'varme_termodynamikk_teori.html': [
{caption: 'Energikvalitetskala og virkningsgrad', svg: `
<svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="180" fill="#fafafa"/>
  <text x="170" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Energikvalitet – fra høy til lav</text>
  <text x="400" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Carnot-virkningsgrad</text>
  <defs><linearGradient id="ekq" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fdd835"/><stop offset="100%" stop-color="#64b5f6"/>
  </linearGradient></defs>
  <rect x="20" y="22" width="16" height="145" rx="4" fill="url(#ekq)"/>
  <text x="12" y="30" text-anchor="end" font-size="8" fill="#f9a825">HØY</text>
  <text x="12" y="165" text-anchor="end" font-size="8" fill="#1565c0">LAV</text>
  <!-- Energinivåer -->
  <line x1="36" y1="35" x2="310" y2="35" stroke="#f9a825" stroke-width="0.5" stroke-dasharray="3,2"/>
  <text x="40" y="32" font-size="9" font-weight="bold" fill="#f9a825">Elektrisitet / mekanisk arbeid</text>
  <text x="40" y="43" font-size="8" fill="#555">100% kan gjøres om til arbeid</text>
  <line x1="36" y1="65" x2="310" y2="65" stroke="#fb8c00" stroke-width="0.5" stroke-dasharray="3,2"/>
  <text x="40" y="62" font-size="9" font-weight="bold" fill="#fb8c00">Kjemisk energi (brensel)</text>
  <text x="40" y="73" font-size="8" fill="#555">~30–45% til arbeid (Carnot-begrenset)</text>
  <line x1="36" y1="100" x2="310" y2="100" stroke="#ef9a9a" stroke-width="0.5" stroke-dasharray="3,2"/>
  <text x="40" y="97" font-size="9" font-weight="bold" fill="#c62828">Varme ved høy temperatur (&gt;400°C)</text>
  <text x="40" y="108" font-size="8" fill="#555">Betydelig Carnot-potensial</text>
  <line x1="36" y1="133" x2="310" y2="133" stroke="#90caf9" stroke-width="0.5" stroke-dasharray="3,2"/>
  <text x="40" y="130" font-size="9" font-weight="bold" fill="#1565c0">Varme ved lav temperatur (&lt;50°C)</text>
  <text x="40" y="141" font-size="8" fill="#555">Nesten ingen arbeidspotensial</text>
  <line x1="36" y1="162" x2="310" y2="162" stroke="#bbdefb" stroke-width="0.5" stroke-dasharray="3,2"/>
  <text x="40" y="159" font-size="9" fill="#1565c0">Romtemperaturvarme – avfall</text>
  <!-- Carnot -->
  <rect x="330" y="22" width="180" height="150" rx="8" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <text x="420" y="42" text-anchor="middle" font-size="11" fill="#e65100">η_max = 1 − T_k/T_v</text>
  <text x="420" y="58" text-anchor="middle" font-size="9" fill="#555">(temperaturer i Kelvin)</text>
  <line x1="340" y1="65" x2="500" y2="65" stroke="#ffe082" stroke-width="1"/>
  <text x="420" y="80" text-anchor="middle" font-size="9" fill="#333">Dampturbin:</text>
  <text x="420" y="92" text-anchor="middle" font-size="9" fill="#e65100">Tv=800K, Tk=300K</text>
  <text x="420" y="104" text-anchor="middle" font-size="9" fill="#333">η_max = 1−300/800 = 62,5%</text>
  <line x1="340" y1="112" x2="500" y2="112" stroke="#ffe082" stroke-width="1"/>
  <text x="420" y="127" text-anchor="middle" font-size="9" fill="#333">Varmepumpe:</text>
  <text x="420" y="139" text-anchor="middle" font-size="9" fill="#2e7d32">COP = Tv/(Tv−Tk)</text>
  <text x="420" y="153" text-anchor="middle" font-size="9" fill="#333">= 3–5 (mer varme enn strøm brukt!)</text>
</svg>`, width: 1.0}
],

'seksualundervisning.html': [
{caption: 'Menstruasjonssyklusen og hormonregulering', svg: `
<svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="190" fill="#fff8f9"/>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#c2624a">Menstruasjonssyklusen (~28 dager)</text>
  <!-- Tidslinje -->
  <line x1="30" y1="60" x2="500" y2="60" stroke="#e0c0bc" stroke-width="1.5"/>
  <!-- Dager -->
  <g font-size="8" fill="#888" text-anchor="middle">
    <text x="30" y="74">1</text><text x="91" y="74">7</text>
    <text x="152" y="74">14</text><text x="213" y="74">21</text>
    <text x="500" y="74">28</text>
  </g>
  <!-- Faser -->
  <rect x="30" y="40" width="61" height="18" rx="3" fill="rgba(244,67,54,0.2)"/>
  <text x="60" y="52" text-anchor="middle" font-size="8" fill="#c62828">Mens­trua­sjon</text>
  <rect x="91" y="40" width="61" height="18" rx="3" fill="rgba(76,175,80,0.2)"/>
  <text x="121" y="52" text-anchor="middle" font-size="8" fill="#2e7d32">Follikkel­fase</text>
  <rect x="152" y="40" width="25" height="18" rx="3" fill="rgba(255,193,7,0.4)"/>
  <text x="164" y="52" text-anchor="middle" font-size="7" fill="#f57f17">Ovu­las.</text>
  <rect x="177" y="40" width="136" height="18" rx="3" fill="rgba(156,39,176,0.15)"/>
  <text x="245" y="52" text-anchor="middle" font-size="8" fill="#7b1fa2">Luteal fase</text>
  <!-- Hormoner -->
  <text x="260" y="95" text-anchor="middle" font-size="9" font-weight="bold" fill="#333">Hormonnivåer</text>
  <!-- Østrogen-kurve -->
  <path d="M30,160 Q60,160 91,145 Q122,130 155,100 Q165,94 175,103 Q190,125 213,155 Q260,180 313,160 Q380,140 500,170" fill="none" stroke="#c2624a" stroke-width="2"/>
  <text x="155" y="92" font-size="8" fill="#c2624a">Østrogen ↑</text>
  <!-- Progesteron-kurve -->
  <path d="M30,175 Q100,175 152,175 Q200,174 230,155 Q260,138 290,132 Q320,138 370,150 Q420,165 500,175" fill="none" stroke="#7b1fa2" stroke-width="2"/>
  <text x="280" y="128" font-size="8" fill="#7b1fa2">Progesteron ↑</text>
  <!-- LH-topp -->
  <path d="M152,175 Q164,100 175,175" fill="none" stroke="#f57f17" stroke-width="2"/>
  <text x="164" y="108" text-anchor="middle" font-size="7" fill="#f57f17">LH-topp</text>
  <!-- Ovulasjon-strek -->
  <line x1="164" y1="38" x2="164" y2="175" stroke="#f57f17" stroke-width="1" stroke-dasharray="3,2"/>
  <!-- Forklaring -->
  <text x="30" y="185" font-size="8" fill="#c2624a">— Østrogen</text>
  <text x="130" y="185" font-size="8" fill="#7b1fa2">— Progesteron</text>
  <text x="240" y="185" font-size="8" fill="#f57f17">— LH</text>
</svg>`, width: 1.0}
],

'cellebiologi.html': [
{caption: 'Mitose – celledeling i fire faser', svg: `
<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="200" fill="#fafafa"/>
  <text x="260" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Mitose – celledeling (somatiske celler)</text>
  <!-- Interfase -->
  <ellipse cx="65" cy="100" rx="55" ry="40" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="65" y="88" text-anchor="middle" font-size="9" font-weight="bold" fill="#1b5e20">Interfase</text>
  <ellipse cx="65" cy="102" rx="22" ry="16" fill="#c8e6c9" stroke="#388e3c" stroke-width="1"/>
  <text x="65" y="106" text-anchor="middle" font-size="7" fill="#1b5e20">Kjerne</text>
  <text x="65" y="145" text-anchor="middle" font-size="8" fill="#555">DNA-replikasjon</text>
  <text x="65" y="155" text-anchor="middle" font-size="8" fill="#555">cellevekst</text>
  <!-- Profase -->
  <ellipse cx="185" cy="100" rx="55" ry="40" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="185" y="88" text-anchor="middle" font-size="9" font-weight="bold" fill="#0d47a1">Profase</text>
  <!-- Kromosomer synlige -->
  <path d="M170,98 Q175,90 180,98 Q185,106 190,98 Q195,90 200,98" fill="none" stroke="#c62828" stroke-width="3" stroke-linecap="round"/>
  <path d="M170,104 Q175,112 180,104 Q185,96 190,104 Q195,112 200,104" fill="none" stroke="#c62828" stroke-width="3" stroke-linecap="round"/>
  <text x="185" y="145" text-anchor="middle" font-size="8" fill="#555">Kromosomer</text>
  <text x="185" y="155" text-anchor="middle" font-size="8" fill="#555">kondenserer</text>
  <!-- Metafase -->
  <ellipse cx="310" cy="100" rx="55" ry="40" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <text x="310" y="88" text-anchor="middle" font-size="9" font-weight="bold" fill="#e65100">Metafase</text>
  <!-- Kromosomer på linje -->
  <line x1="310" y1="75" x2="310" y2="125" stroke="#888" stroke-width="1" stroke-dasharray="3,2"/>
  <rect x="302" y="95" width="16" height="10" rx="2" fill="#c62828"/>
  <rect x="302" y="107" width="16" height="10" rx="2" fill="#c62828"/>
  <text x="310" y="145" text-anchor="middle" font-size="8" fill="#555">Kromosomer på</text>
  <text x="310" y="155" text-anchor="middle" font-size="8" fill="#555">ekvatorplaten</text>
  <!-- Anafase/Telofase -->
  <ellipse cx="440" cy="100" rx="70" ry="40" fill="#fce4ec" stroke="#c62828" stroke-width="1.5"/>
  <text x="440" y="78" text-anchor="middle" font-size="9" font-weight="bold" fill="#b71c1c">Anafase / Telofase</text>
  <!-- Trekk til polene -->
  <rect x="415" y="92" width="12" height="8" rx="1" fill="#c62828"/>
  <rect x="415" y="105" width="12" height="8" rx="1" fill="#1565c0"/>
  <rect x="453" y="92" width="12" height="8" rx="1" fill="#c62828"/>
  <rect x="453" y="105" width="12" height="8" rx="1" fill="#1565c0"/>
  <text x="440" y="142" text-anchor="middle" font-size="8" fill="#555">Søsterkromatider</text>
  <text x="440" y="152" text-anchor="middle" font-size="8" fill="#555">trekkes fra hverandre</text>
  <!-- Resultat -->
  <text x="440" y="170" text-anchor="middle" font-size="8" fill="#c62828">→ 2 identiske datter­celler</text>
  <!-- Piler -->
  <path d="M120,100 L130,100" stroke="#555" stroke-width="1.5" marker-end="url(#arm)"/>
  <path d="M240,100 L250,100" stroke="#555" stroke-width="1.5" marker-end="url(#arm)"/>
  <path d="M365,100 L370,100" stroke="#555" stroke-width="1.5" marker-end="url(#arm)"/>
  <defs><marker id="arm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#555" stroke-width="2"/></marker></defs>
</svg>`, width: 1.0}
],

'rusmidler.html': [
{caption: 'Synapse og rusmidlers angrepspunkter', svg: `
<svg viewBox="0 0 520 210" xmlns="http://www.w3.org/2000/svg" style="font-family:Georgia,serif">
  <rect width="520" height="210" fill="#fafafa"/>
  <text x="175" y="14" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">Synapse – angrepspunkter for rusmidler</text>
  <!-- Presynaptisk terminal -->
  <path d="M40,30 Q40,110 80,130 Q140,160 175,155 Q210,160 250,130 Q290,110 290,30 Z" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.5"/>
  <text x="165" y="48" text-anchor="middle" font-size="9" font-weight="bold" fill="#0d47a1">Presynaptisk terminal</text>
  <!-- Vesikler -->
  <circle cx="120" cy="90" r="14" fill="#bbdefb" stroke="#1565c0" stroke-width="1"/>
  <circle cx="155" cy="100" r="14" fill="#bbdefb" stroke="#1565c0" stroke-width="1"/>
  <circle cx="190" cy="88" r="14" fill="#bbdefb" stroke="#1565c0" stroke-width="1"/>
  <circle cx="215" cy="105" r="14" fill="#bbdefb" stroke="#1565c0" stroke-width="1"/>
  <text x="165" y="118" text-anchor="middle" font-size="8" fill="#1565c0">Vesikler med NT</text>
  <!-- Reopptak-pumpe -->
  <rect x="48" y="100" width="25" height="35" rx="6" fill="#c8e6c9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="35" y="120" font-size="7" fill="#1b5e20">Reopptak</text>
  <!-- Kokain-blokk -->
  <rect x="49" y="101" width="23" height="33" rx="5" fill="rgba(244,67,54,0.3)" stroke="#c62828" stroke-width="1.5"/>
  <text x="35" y="142" font-size="7" fill="#c62828">← Kokain</text>
  <text x="35" y="152" font-size="7" fill="#c62828">blokkerer</text>
  <!-- Synaptisk spalt -->
  <rect x="40" y="155" width="250" height="16" rx="0" fill="rgba(200,230,255,0.3)"/>
  <text x="165" y="166" text-anchor="middle" font-size="8" fill="#555">Synaptisk spalt — NT diffunderer over</text>
  <!-- NT-prikker -->
  <circle cx="110" cy="163" r="3" fill="#6a1b9a"/>
  <circle cx="135" cy="160" r="3" fill="#6a1b9a"/>
  <circle cx="160" cy="163" r="3" fill="#6a1b9a"/>
  <circle cx="185" cy="159" r="3" fill="#6a1b9a"/>
  <circle cx="210" cy="162" r="3" fill="#6a1b9a"/>
  <!-- Postsynaptisk membran -->
  <rect x="40" y="171" width="250" height="35" rx="6" fill="#e8f5e9" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="165" y="185" text-anchor="middle" font-size="9" font-weight="bold" fill="#1b5e20">Postsynaptisk membran – reseptorer</text>
  <!-- Reseptorer -->
  <rect x="70" y="171" width="16" height="15" rx="4" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1"/>
  <rect x="115" y="171" width="16" height="15" rx="4" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1"/>
  <rect x="160" y="171" width="16" height="15" rx="4" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1"/>
  <rect x="205" y="171" width="16" height="15" rx="4" fill="#a5d6a7" stroke="#2e7d32" stroke-width="1"/>
  <!-- Angrepspunkter-tabell -->
  <rect x="305" y="25" width="205" height="175" rx="8" fill="#fff9c4" stroke="#f57f17" stroke-width="1.5"/>
  <text x="407" y="42" text-anchor="middle" font-size="9" font-weight="bold" fill="#e65100">Rusmidlers mekanisme</text>
  <line x1="315" y1="48" x2="500" y2="48" stroke="#ffe082" stroke-width="1"/>
  <text x="315" y="63" font-size="8" fill="#c62828">Kokain/Amfetamin:</text>
  <text x="315" y="74" font-size="8" fill="#555">  Blokkerer dopamin-reopptak</text>
  <text x="315" y="84" font-size="8" fill="#555">  → 350–400% dopaminøkning</text>
  <line x1="315" y1="90" x2="500" y2="90" stroke="#ffe082" stroke-width="1"/>
  <text x="315" y="105" font-size="8" fill="#1565c0">Alkohol:</text>
  <text x="315" y="116" font-size="8" fill="#555">  GABA-A↑ (hemmende NT)</text>
  <text x="315" y="126" font-size="8" fill="#555">  NMDA↓ (ekstatatory NT)</text>
  <line x1="315" y1="132" x2="500" y2="132" stroke="#ffe082" stroke-width="1"/>
  <text x="315" y="147" font-size="8" fill="#7b1fa2">Heroin/Opioider:</text>
  <text x="315" y="158" font-size="8" fill="#555">  μ-reseptor-agonist</text>
  <text x="315" y="168" font-size="8" fill="#555">  → Respirasjonsdepresjon</text>
  <line x1="315" y1="174" x2="500" y2="174" stroke="#ffe082" stroke-width="1"/>
  <text x="315" y="188" font-size="8" fill="#2e7d32">Nalokson = motgift</text>
  <text x="315" y="198" font-size="8" fill="#555">  Blokkerer opioid-reseptorer</text>
</svg>`, width: 1.0}
],


};

// ═══════════════════════════════════════════════════════
// FAGINNHOLD – tekstlig sammendrag per emne for PDF
// ═══════════════════════════════════════════════════════
const FAGINNHOLD = {
'celle.html': {
  tittel: 'Cellens anatomi',
  km: ['KM14'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Cellen er livets minste funksjonelle enhet. Alle levende organismer er bygd av celler – enten én (unicellulær) eller mange (multicellulær).',
  seksjoner: [
    { tittel: 'Prokaryot vs. eukaryot celle', innhold: 'Prokaryote celler (bakterier, arkeer) mangler cellekjerne – DNA ligger fritt i cytoplasma som et nukleoid. De har ingen membranomsluttede organeller, men kan ha plasmider (ekstra DNA-ringer) og flageller. Størrelse: 0,5–5 µm.\n\nEukaryote celler (planter, dyr, sopp) har cellekjerne omgitt av dobbel kjernemembran. Organellene er membranomsluttede og spesialiserte. Størrelse: 10–100 µm.' },
    { tittel: 'Viktige organeller (eukaryot)', innhold: '• Cellekjerne: inneholder DNA, styrer celleaktivitet\n• Mitokondrier: celleånding, ATP-produksjon («cellens kraftverk»)\n• Endoplasmatisk retikulum (ER): proteinsyntese (ru ER) og lipidmetabolisme (glatt ER)\n• Golgi-apparatet: modifiserer og pakker proteiner for eksport\n• Lysosomer: bryter ned avfall (dyreceller)\n• Kloroplaster (planteceller): fotosyntese\n• Cellevegg (planter, sopp): struktur og støtte' },
    { tittel: 'Cellemembranens funksjon', innhold: 'Fosfolipid-dobbeltlaget er semipermabelt – slipper inn/ut selektivt. Hydrofil (vannelskende) hode utover, hydrofob (vannavvisende) hale innover. Proteiner i membranen: transportproteiner (kanaler, pumper), reseptorer og enzymer. Passiv transport: diffusjon, osmose. Aktiv transport: mot konsentrasjonsgradient, krever ATP.' },
  ]
},

'fotosyntese.html': {
  tittel: 'Fotosyntese og celleånding',
  km: ['KM15','KM18'],
  tf: ['Bærekraftig utvikling'],
  ingress: 'Fotosyntese og aerob celleånding er speilvendte reaksjoner som kobler energistrøm og stoffkretsløp i naturen.',
  seksjoner: [
    { tittel: 'Fotosyntesens totalreaksjon', innhold: '6CO₂ + 6H₂O + lysenergi → C₆H₁₂O₆ + 6O₂\n\nReaksjonen skjer i kloroplasten og er delt i to:\n• Lysreaksjonene (thylakoid): lys spalter vann (H₂O → O₂ + H⁺ + e⁻). ATP og NADPH dannes.\n• Calvin-syklusen (stroma): CO₂ bindes til RuBP via enzymet Rubisco. Glukose dannes ved hjelp av ATP og NADPH fra lysreaksjonene.' },
    { tittel: 'Aerob celleånding', innhold: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (energi)\n\nTre faser:\n1. Glykolyse (cytoplasma): glukose → 2 pyrodruesyre + 2 ATP\n2. Sitronsyresyklusen (mitokondriet): pyrodruesyre brytes ned, CO₂ frigjøres, NADH dannes\n3. Elektrontransportkjeden (indre mitokondriemembran): oksidativ fosforylering, nettoproduksjon ~36–38 ATP per glukose' },
    { tittel: 'Begrensende faktorer', innhold: '• Lysmengde: under lyskompensasjonspunktet er respirasjon > fotosyntese. Over lysmettingspunktet: Rubisco er mettet.\n• CO₂-konsentrasjon: begrenset ved lav konsentrasjon → stomata åpner seg.\n• Temperatur: enzymer (Rubisco) har optimum ~25–35°C; over dette denaturering.\n\nC4-planter (mais, sukkerrør) konsentrerer CO₂ rundt Rubisco → unngår fotorespirering, mer effektiv ved høy temperatur.\nCAM-planter (kaktus, ananas): tar opp CO₂ om natten, Calvin-syklus om dagen – ekstremt vannsparende.' },
  ]
},

'klima.html': {
  tittel: 'Klima og drivhuseffekten',
  km: ['KM10','KM12'],
  tf: ['Bærekraftig utvikling'],
  ingress: 'Klimaendringer er vår tids største miljøutfordring. Menneskeskapte drivhusgassutslipp forstyrrerer det naturlige energibudsjettet til jorda.',
  seksjoner: [
    { tittel: 'Drivhuseffekten', innhold: 'Kortbølget solstråling passerer atmosfæren og varmer jordoverflaten. Bakken sender ut langbølget infrarød stråling. Drivhusgassene (CO₂, CH₄, H₂O, N₂O, F-gasser) absorberer denne og sender den tilbake – naturlig drivhuseffekt uten atmosfæren: −18°C, med: +15°C.\n\nForsterket drivhuseffekt: fossil­forbrenning øker CO₂-konsentrasjonen fra 280 ppm (pre-industrielt) til 420+ ppm (2024). Klimaforskerenes konsensus: menneskelig aktivitet er «utvetydig» årsak til global oppvarming siden 1950 (IPCC AR6).' },
    { tittel: 'Tipping points – vippepunkter', innhold: '• Grønlandsisen (~1,5–2°C): 7 m havnivåstigning om den smelter – selvforsterkende prosess\n• Amazonas-savannisering (>20–25% avskoging): skogen skaper sin egen nedbør – kan kollapse til savanne\n• Permafrost-metanutslipp (~2°C): Sibirsk tundra frigjør CH₄ – kraftig drivhusgass (80× CO₂ på 20 år)\n• Atlanterhavssirkulasjonen (AMOC): svekkes nå av ferskvann fra Grønland → dramatisk avkjøling i N-Europa\n• Korallrev (1,5°C): 70–90% borte ved 1,5°C, 99% ved 2°C' },
    { tittel: 'Klimatiltak', innhold: '• Energi: fornybar (sol, vind, vann) erstatter fossile brensler\n• Transport: el-bil, tog, redusere flyreiser\n• Kosthold: redusere rødt kjøtt (60 kg CO₂/kg storfekjøtt vs. 2 kg/kg bønner)\n• Avskoging: stoppe avskogingen, plante trær\n• Karbonprising: CO₂-avgift gjør utslipp dyrere\n• CO₂-fangst (CCS): kontroversielt, dyrt, men kan bli nødvendig' },
  ]
},

'okologi.html': {
  tittel: 'Økologi',
  km: ['KM15','KM16'],
  tf: ['Bærekraftig utvikling'],
  ingress: 'Økologi studerer samspillet mellom organismer og deres miljø. Næringsnett, kretsløp og populasjonsdynamikk er sentrale konsepter.',
  seksjoner: [
    { tittel: 'Næringspyramide og energiflyt', innhold: 'Energi strømmer enveis gjennom næringsnivåene – fra produsenter (planter, alger som binder sollys) via primærkonsumenter (plantesetere) og sekundærkonsumenter (kjøttetere) til topprovdyr. 10%-regelen: bare ~10% av energien overføres oppover; resten (90%) tapes som varme i celleåndingen. Jo færre trofiske nivåer, desto mer energieffektivt kosthold.' },
    { tittel: 'Nitrogenkretsløpet', innhold: 'N₂ i atmosfæren → nitrogenbinding av bakterier (Rhizobium, Azotobacter) → NH₄⁺ (ammonium) → nitrifikasjon (Nitrosomonas) → NO₃⁻ (nitrat) → planteopptak → dyr spiser planter → ammonifikasjon (nedbryting) → NH₄⁺ tilbake, eller denitrifikasjon → N₂ tilbake.\n\nMenneskelig påvirkning: kunstgjødsel tilfører reaktivt nitrogen → eutrofiering (algeoppblomstring → oksygenmangel → fiskedød i Oslofjorden m.fl.).' },
    { tittel: 'Fosfor- og vannkretsløpet', innhold: 'Fosforkretsløpet er sedimentært – ingen gassfase. Fosfatbergarter eroderes → fosfor i jord og vann → planteopptak → dyr → nedbryting → sedimentering i hav → tektoniske prosesser løfter opp igjen. Svært langsomt kretsløp (millioner av år). Fosfatstein er en begrenset ressurs.\n\nVannkretsløpet drives av solenergi: fordampning → kondensasjon (skyer) → nedbør → avrenning/grunnvann. Amazonas: ~50–75% av nedbøren resirkuleres via transpirering. Klimaendringer intensiverer syklusen.' },
    { tittel: 'Trussel mot biologisk mangfold', innhold: 'Habitattap er den største trusselen (~75% av landoverflaten endret av mennesker). Invasive arter, forurensning, overbeskatning og klimaendringer forsterker tapet. IPCC/IPBES: opp til 1 million arter trues av utryddelse innen 2050.' },
  ]
},

'evolusjon.html': {
  tittel: 'Evolusjonsteorien',
  km: ['KM13'],
  tf: ['Bærekraftig utvikling'],
  ingress: 'Evolusjon ved naturlig seleksjon forklarer det biologiske mangfoldet på jorda. Det er en av de best dokumenterte teoriene i naturvitenskapen.',
  seksjoner: [
    { tittel: 'Darwins fire prinsipper', innhold: '1. Variasjon: individer i en populasjon varierer i arvelige egenskaper\n2. Arvelighet: variasjoner overføres til avkom via DNA\n3. Kamp for tilværelsen: det produseres langt flere avkom enn som kan overleve\n4. Differensiell overlevelse: individer med gunstige egenskaper overlever og reproduserer bedre\n\nResultat: genfrekvenser endrer seg over generasjoner → evolusjon.' },
    { tittel: 'Bevisene for evolusjon', innhold: '• Fossiler: progresjon fra enkle til komplekse former, overgangsformer (Tiktaalik, Archaeopteryx)\n• Molekylærbiologi: DNA-sekvenser bekrefter slektskap (menneske–sjimpanse: 98,7% lik DNA)\n• Homologe strukturer: menneskehånd, flaggermusevinge og hvalefinne – samme grunnstruktur\n• Direkte observasjon: antibiotikaresistens, peppered moths, Darwins finker etter El Niño\n• Endogene retroviruser (ERV): samme virus integrert på samme sted i menneske og sjimpanse-DNA' },
    { tittel: 'Lamarck vs. Darwin', innhold: 'Lamarck (1809): tilegnet egenskaper arves (giraffens hals strekkes → avkommet arver lengre hals). Feil: DNA endres ikke av muskelbruk.\n\nDarwin (1859): variasjon finnes i populasjonen – de med lengst hals overlever best og reproduserer mer → naturlig seleksjon.\n\nIntelligent design (ID) er ikke vitenskap: ikke falsifiserbar, ingen mulig observasjon kan motbevise det. Kitzmiller v. Dover (2005): US-domstol fastslo ID er religiøs tro.' },
  ]
},

'atom.html': {
  tittel: 'Atomets oppbygning',
  km: ['KM9'],
  tf: [],
  ingress: 'Alt stoff er bygd opp av atomer. Atomets struktur bestemmer grunnstoffets kjemiske egenskaper.',
  seksjoner: [
    { tittel: 'Subatomære partikler', innhold: '• Proton (p⁺): i kjernen, ladning +1, masse ≈ 1 u. Antall protoner = atomnummer Z = definerer grunnstoffet\n• Nøytron (n⁰): i kjernen, ingen ladning, masse ≈ 1 u. Antall nøytroner = N = A − Z\n• Elektron (e⁻): i skall rundt kjernen, ladning −1, masse ≈ 0 u (1/1836 av proton)\n\nMassetall A = Z + N. Nøytralt atom: antall protoner = antall elektroner.' },
    { tittel: 'Elektronskall og Bohr-modellen', innhold: 'Elektroner befinner seg i skall (energinivåer) rundt kjernen:\n• K-skall (n=1): maks 2 elektroner\n• L-skall (n=2): maks 8 elektroner\n• M-skall (n=3): maks 18 elektroner\n\nValenselektroner (ytterste skall) bestemmer kjemisk reaktivitet. Edle gasser har fylt ytterste skall (oktettregel) → inerte.' },
    { tittel: 'Isotoper og periodesystemet', innhold: 'Isotoper er atomer av samme grunnstoff med ulikt antall nøytroner. Eksempel: ¹²C (6p, 6n) og ¹⁴C (6p, 8n). Kjemiske egenskaper like, men ulik masse og radioaktivitet.\n\nPeriodesystemet: ordnet etter stigende atomnummer. Perioder (rader) = antall elektronskal. Grupper (kolonner) = antall valenselektroner. Alkalimetaller (gruppe 1): 1 valenselektron, reaktive. Halogener (gruppe 17): 7 valenselektroner.' },
  ]
},

'kjemiske_reaksjoner.html': {
  tittel: 'Kjemiske reaksjoner',
  km: ['KM8'],
  tf: [],
  ingress: 'Kjemiske reaksjoner er prosesser der stoffer omdannes til nye stoffer med andre egenskaper. Massen bevares alltid.',
  seksjoner: [
    { tittel: 'Grunnleggende prinsipper', innhold: 'Massebevaringsloven (Lavoisier 1789): summen av reaktantmasser = summen av produktmasser. En kjemisk likning balanseres ved å justere koeffisientene slik at antall atomer av hvert grunnstoff er likt på begge sider.\n\nReaksjonstegn: eksoterm (−ΔH, frigjør varme), endoterm (+ΔH, absorberer varme). Forbrenning er alltid eksoterm.' },
    { tittel: 'Redoksreaksjoner', innhold: 'Redoks: oxidation is loss (OIL), reduction is gain (RIG) av elektroner.\n\nOksidasjonstall: fiktivt tall som viser elektronfordeling. O er vanligvis −2, H er +1, rent grunnstoff = 0.\n\nEksempel: Zn + Cu²⁺ → Zn²⁺ + Cu\n• Zn: 0 → +2 (oksideres – avgir 2e⁻, er reduktionsmiddel)\n• Cu²⁺: +2 → 0 (reduseres – tar imot 2e⁻, er oksidasjonsmiddel)\n\nRedoks er grunnlaget for galvaniske celler og batterier.' },
    { tittel: 'Reaksjonshastighet og katalysatorer', innhold: 'Reaksjonshastigheten øker med: høyere temperatur (mer kinetisk energi → flere vellykkede kollisjoner), høyere konsentrasjon (flere kollisjoner), større overflate­areal, og katalysator.\n\nKatalysator senker aktiveringsenergien (Ea) uten å forbrukes. Enzymer er biologiske katalysatorer (proteiner) – svært spesifikke for sine substrater.' },
  ]
},

'kontinentaldrift.html': {
  tittel: 'Kontinentaldrift og platetektonikk',
  km: ['KM19'],
  tf: [],
  ingress: 'Jordens ytre er delt i tektoniske plater som beveger seg på den seigtflytende mantelen. Denne bevegelsen former geografi, skaperjordskjelv og vulkaner.',
  seksjoner: [
    { tittel: 'Wegener og bevisene', innhold: 'Alfred Wegener fremmet kontinentaldrift i 1912. Bevisene:\n• Kontinentenes form passer sammen (spesielt Afrika og Sør-Amerika)\n• Fossil-match: Glossopteris (bregne) og Mesosaurus (ferskvannssøgle) funnet identisk på adskilte kontinenter\n• Glasiale spor fra Perm ved ekvator i dag\n• Fjellkjeder matcher på tvers av Atlanteren (Appalachene = Kaledonidene)\n\nWegener ble avvist fordi han ikke kunne forklare mekanismen. Teorien ble akseptert ca. 1970 da paleomagnetisme og havbunnsspredning ga bevis.' },
    { tittel: 'Tre typer plategrenser', innhold: '• Divergente grenser: platene beveger seg fra hverandre → ny havbunn dannes (midthavsrygg). Eksempel: Mid-Atlanterhavsryggen (N-Amerika og Europa drifter 2,5 cm/år fra hverandre)\n• Konvergente grenser: platene kolliderer → subduksjon (tettere plate synker under) eller fjellkjedebygging. Eksempel: Himalaya (India–Asia), Andesfjellene\n• Transform­grenser: platene glir sidelengs forbi hverandre → jordskjelv. Eksempel: San Andreas-forkastningen' },
    { tittel: 'Bevis fra havbunnen', innhold: 'Paleomagnetisme: symmetrisk magnetisk striping langs midthavsrygger bekrefter havbunnsspredning. GPS måler platebevegelse direkte (N-Amerika og Europa: 2,5 cm/år). Ingen havbunn eldre enn ~180 millioner år – gammel havbunn subduseres.' },
  ]
},

'nervesystemet.html': {
  tittel: 'Nervesystemet',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Nervesystemet styrer og koordinerer kroppens funksjoner via elektriske signaler (aksjons­potensialer) og kjemisk signaloverføring (nevrotransmittere).',
  seksjoner: [
    { tittel: 'Nevronets oppbygning', innhold: 'Nevroner (nerveceller) er nervesystemets signalenhet. Deler:\n• Dendtitter: mottar signaler fra andre nevroner\n• Cellekropp (soma): inneholder kjernen, metabolsk senter\n• Akson: leder impulsen bort fra cellekroppen – kan være opp til 1 m lang\n• Myelinskjede (schwann-celler): isolerer aksonen, øker impulshastigheten (saltatorisk ledning: 70–120 m/s)\n• Aksonterminaler: frigjør nevrotransmittere i synapsen' },
    { tittel: 'Aksjonspotensialet', innhold: 'Nervecellen er normalt polarisert (−70 mV indre). Stimulering → Na⁺-kanaler åpner seg → Na⁺ strømmer inn → depolarisering (0 → +30 mV) → K⁺-kanaler åpner → repolarisering. Alt-eller-intet: impulsen er like sterk uansett stimulusstyrke. Frekvensen (antall impulser/sekund) koder for stimulusstyrke.' },
    { tittel: 'Synaptisk overføring', innhold: 'I synapsen:\n1. Impulsen ankommer presynaptisk terminal\n2. Vesikler med nevrotransmitter fusjonerer med membranen\n3. NT frigjøres i synaptisk spalt (20 nm)\n4. NT binder reseptorer på postsynaptisk membran → ny impuls eller hemming\n5. NT gjenopptas (reopptak) eller brytes ned\n\nViktige NT: Dopamin (belønning), Serotonin (humør), Acetylkolin (muskelkontraksjon), GABA (hemning), Glutamat (aktivering)' },
  ]
},

'immunforsvar.html': {
  tittel: 'Immunforsvar og vaksiner',
  km: ['KM22'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Immunsystemet beskytter kroppen mot infeksjoner og fremmedlegemer via et lagdelt forsvar med barrierer, uspesifikke og spesifikke mekanismer.',
  seksjoner: [
    { tittel: 'Tre forsvarslinjer', innhold: '1. Fysiske barrierer: hud (tørr, lav pH), slimhinner, magesyre, flimmerhår\n2. Medfødt (uspesifikt) immunforsvar: betennelse (histamin, cytokiner), feber, fagocytose (nøytrofiler, makrofager). Timer.\n3. Adaptivt (spesifikt) immunforsvar: B-celler (antistoffer), T-celler (CD4⁺ hjelper, CD8⁺ cytotoksisk). Dager → immunhukommelse.' },
    { tittel: 'Vaksinasjon', innhold: 'Vaksinasjon trener immunhukommelsen trygt:\n• Inaktivert vaksine: drept patogen (influensa, Salk-polio)\n• Levende svekket: attenuert patogen (MMR, vannkopper) – sterk, langvarig immunitet\n• mRNA-vaksine: instruksjoner for å produsere ett antigen (COVID-19). mRNA brytes ned etter noen dager, endrer ikke DNA.\n• Subunit: kun deler av patogenet (Hep B, HPV)\n\nFlokkimmunitetgrense: p = 1 − 1/R₀. Meslinger (R₀=15): p = 93%.' },
    { tittel: 'Allergier og autoimmunitet', innhold: 'Allergi: IgE-mediert overreaksjon mot uskadelige allergener → mastceller frigjør histamin → betennelse. Anafylaksi er livsfarlig.\n\nAutoimmunitet: immunsystemet angriper eget vev (type 1-diabetes: beta-celler; MS: myelinskjeder; leddgikt: ledd).\n\nHIV: dreper CD4⁺ T-celler → AIDS ved <200 CD4/µl. ART (antiretroviral terapi) kontrollerer viruset.' },
  ]
},

'rusmidler.html': {
  tittel: 'Rusmidler og signalsystemene',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Nesten alle rusmidler kaprer hjernens belønningssystem ved å påvirke synaptisk nevrotransmisjon – særlig dopaminsignalering i nucleus accumbens.',
  seksjoner: [
    { tittel: 'Synapsen som angrepspunkt', innhold: 'Tre mekanismer:\n• Agonister: etterligner nevrotransmitter og aktiverer reseptoren (heroin etterligner endorfiner)\n• Antagonister: blokkerer reseptoren (nalokson blokkerer opioidreseptorer)\n• Reopptakshemmere: hindrer at NT fjernes → lengre signalering (kokain blokkerer dopaminreopptak)\n\nBelønningssystemet: dopamin i nucleus accumbens frigjøres ved mat, sex og sosial kontakt. Alle avhengighetsskapende stoffer øker dopamin her.' },
    { tittel: 'Spesifikke rusmidler', innhold: '• Alkohol: GABA-A↑ + NMDA↓ → CNS-depressant. Livsfarlig abstinens (delirium tremens). FASD ved graviditet.\n• Cannabis: THC binder CB1-reseptorer (endokannabinoid). Hippokampus → hukommelse↓. Unghjerne spesielt sårbar (psykoserisiko 2–5×).\n• Kokain: blokkerer dopaminreopptak → 350–400% dopaminøkning. Vasokonstriktiv.\n• Opioider (heroin, morfin, fentanyl): μ-reseptor-agonister → respirasjonsdepresjon → overdosedød. Nalokson = motgift.\n• Doping/AAS: testosteron-agonist → testikkelatrofi (negativ tilbakekobling). EPO → blodpropp.' },
    { tittel: 'Avhengighet og behandling', innhold: 'Toleranse: gjentatt bruk → hjernens reseptorer ned-reguleres → økt dose gir samme effekt.\nAbstinens: uten stoffet mangler hjernen normal nevrotransmitternivå → ubehag/smerte.\n\nLegemiddelbehandling: metadon/buprenorfin (opioidsubstitusjon), naltrexon (opioid/alkohol), SSRI (alkoholavhengighet). NALOKSOn (Narcan) = livredder ved opioidoverdose.' },
  ]
},

'genetikk.html': {
  tittel: 'Genetikk og arv',
  km: ['KM13','KM14'],
  tf: ['Folkehelse og livsmestring','Bærekraftig utvikling'],
  ingress: 'Genetikk handler om arv og variasjon. DNA er arvematerialet som koder for alle proteiner og dermed alle egenskaper.',
  seksjoner: [
    { tittel: 'DNA-struktur', innhold: 'DNA (deoksyribonukleinsyre) er en dobbeltstrenget helix. Hvert nukleotid: fosfatgruppe + deoksyribose + nitrogenbase (A, T, G, C). A pares med T (2 H-bindinger), G parer med C (3 H-bindinger).\n\nGen: sekvens av baser som koder for et protein. Kromosom: pakket DNA-molekyl. Mennesket: 46 kromosomer (23 par), ~20 000–25 000 gener, ~3,2 milliarder basepar.' },
    { tittel: 'Mendels arvelover', innhold: 'Gregor Mendel (1866): eksperimenter med erteplanter.\n\n1. Segregasjonsloven: allelpar separeres under meiosen → hvert kjønnscell mottar ett allel\n2. Uavhengig fordelingslov: alleler for ulike egenskaper segregeres uavhengig\n\nDominant/recessivt: dominant allel (A) skjuler recessivt (a). Heterozygot (Aa): ser ut som dominant (fenotype), bærer recessivt (genotype). Punnett-kvadrat brukes til å beregne sannsynlighet for fenotyper i avkommet.' },
    { tittel: 'Mutasjoner og genetisk variasjon', innhold: 'Mutasjoner er varige endringer i DNA-sekvensen. Typer: punktmutasjon (ett basepar), innsetting, sletting, kromosomaberrasjon.\n\nKilder til variasjon: mutasjoner, crossing-over under meiose, tilfeldig fordeling av homologe kromosomer. Genmutasjoner kan være nøytrale, gunstige (naturlig seleksjon) eller skadelige.\n\nCRISPR-Cas9 (2012): presisjonsverktøy for genredigering. Første godkjente behandling: sigdcelleanemi (2024).' },
  ]
},

'elektrisitetsteori.html': {
  tittel: 'Elektrisitetsteori',
  km: ['KM6','KM11'],
  tf: [],
  ingress: 'Elektrisitet er bevegelse av elektriske ladninger. Ohms lov og Kirchhoffs lover beskriver strøm, spenning og motstand i elektriske kretser.',
  seksjoner: [
    { tittel: 'Grunnbegreper', innhold: '• Elektrisk ladning (Q): måles i Coulomb (C). Proton: +1,6×10⁻¹⁹ C\n• Spenning (U/V): potensialdifferanse i Volt (V). «Trykket» som driver strømmen\n• Strøm (I): ladningsflyt per sekund, måles i Ampere (A). I = ΔQ/Δt\n• Motstand (R): hindring av strømflyt, måles i Ohm (Ω)\n\nOhms lov: U = I · R (holder for ohmske ledere ved konstant temperatur)' },
    { tittel: 'Serie og parallell', innhold: 'Seriekobling:\n• Samme strøm gjennom alle komponenter: I_tot = I₁ = I₂ = I₃\n• Spenningen fordeles: U_tot = U₁ + U₂ + U₃\n• Total motstand øker: R_tot = R₁ + R₂ + R₃\n\nParallellkobling:\n• Samme spenning over alle komponenter: U_tot = U₁ = U₂ = U₃\n• Strømmen fordeles: I_tot = I₁ + I₂ + I₃\n• Total motstand minker: 1/R_tot = 1/R₁ + 1/R₂ + 1/R₃\n\nEffekt: P = U · I = I²·R = U²/R (Watt)' },
  ]
},

'syr_base_ph.html': {
  tittel: 'Syre, base og pH',
  km: ['KM8'],
  tf: [],
  ingress: 'Syrer avgir H⁺-ioner (proton) og baser mottar dem. pH-skalaen måler konsentrasjonen av H⁺-ioner i en løsning.',
  seksjoner: [
    { tittel: 'Definisjoner og pH', innhold: 'Brønsted-Lowry: syre = protondonor (avgir H⁺), base = protonakseptor (mottar H⁺).\n\npH = −log₁₀[H⁺]. Skala 0–14:\n• pH < 7: surt (overskudd av H⁺)\n• pH = 7: nøytralt (rent vann, 25°C)\n• pH > 7: basisk (overskudd av OH⁻)\n\nNøytralisering: syre + base → salt + vann. HCl + NaOH → NaCl + H₂O' },
    { tittel: 'Sterke og svake syrer/baser', innhold: 'Sterke syrer/baser dissosier fullstendig: HCl → H⁺ + Cl⁻ (100%). Svake syrer/baser dissosier delvis: CH₃COOH ⇌ H⁺ + CH₃COO⁻ (delvis).\n\nBuffersystemer: motstår pH-endring ved tilsats av syre/base. Viktigst i kroppen: bikarbonat-system (CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻). Blodets pH: 7,35–7,45 – avvik på ±0,1 kan være livstruende.' },
  ]
},

'bolger_lyd.html': {
  tittel: 'Bølger og lyd',
  km: ['KM6'],
  tf: [],
  ingress: 'Bølger overfører energi uten at stoff forflyttes permanent. Lyd er longitudinale mekaniske bølger, lys er transversale elektromagnetiske bølger.',
  seksjoner: [
    { tittel: 'Bølgeparametre', innhold: '• Bølgelengde (λ): avstand mellom to tilsvarende punkter (m)\n• Frekvens (f): antall svingninger per sekund (Hz)\n• Amplitude (A): maksimal utslag fra likevektsposisjon\n• Bølgehastighet: v = f · λ\n\nTransversal bølge: svingning vinkelrett på utbredelse (lys, bølger på vann).\nLongitudinal bølge: svingning parallelt med utbredelse (lyd, P-bølger).' },
    { tittel: 'Lyd', innhold: 'Lyd er trykkvariasjoner i et medium. Hastighet: luft ≈ 340 m/s, vann ≈ 1500 m/s, stål ≈ 5000 m/s. Krever medium – ikke i vakuum.\n\nHørbart område: 20 Hz – 20 000 Hz. Ultralyd: > 20 000 Hz (medisinske undersøkelser, sonar). Infralyd: < 20 Hz (jordskjelv, elefantkommunikasjon).\n\nDopplereffekt: kilde beveger seg mot lytter → høyere tilsynelatende frekvens. Brukes i radarfartsmåling og medisinsk ultralyd.' },
  ]
},

'varme_termodynamikk_teori.html': {
  tittel: 'Varme og termodynamikk',
  km: ['KM11'],
  tf: [],
  ingress: 'Termodynamikken handler om energi, varme og temperatur. Termodynamikkens lover setter grenser for hva som er mulig i naturen.',
  seksjoner: [
    { tittel: 'Grunnbegreper', innhold: '• Temperatur: mål på gjennomsnittlig kinetisk energi til molekylene (Kelvin: K = °C + 273)\n• Varme (Q): energi som overføres pga. temperaturdifferanse (Joule)\n• Varmekapasitet (c): energi som trengs for å varme 1 kg 1°C. Vann: 4200 J/(kg·K)\n\nVarmeoverføring: ledning (konduksjon), konveksjon (strøm), stråling (infrarød)' },
    { tittel: 'Termodynamikkens lover', innhold: '0. lov: termisk likevekt definerer temperatur\n1. lov (energibevaring): ΔU = Q − W (indre energi = tilsatt varme minus utført arbeid)\n2. lov (entropi): varme flyter spontant fra varm til kald. Entropien (uorden) øker alltid i et isolert system. Ingen maskin kan ha 100% virkningsgrad.\n\nVirkningsgrad: η = W_ut/Q_inn < 1. Carnot-maksimum: η_max = 1 − T_kald/T_varm (Kelvin)' },
    { tittel: 'Energikvalitet', innhold: 'Høyverdig energi (elektrisitet, mekanisk arbeid) kan omdannes til andre former nær 100%. Lavverdig energi (varme ved lav temperatur) har lite arbeidspotensial – 2. termodynamikkens lov.\n\nEnergi degraderes: kjemisk energi → varme i motor → friksjon → lavtemperaturvarme. Varmepumpe: COP = 3–5 (3–5× mer varme enn elektrisitet brukt). Kraftvarmeverk (CHP): utnytter ~80–90% av brenslets energi.' },
  ]
},

'elektrokjemi.html': {
  tittel: 'Elektrokjemi',
  km: ['KM8','KM11'],
  tf: ['Bærekraftig utvikling'],
  ingress: 'Elektrokjemi handler om samspillet mellom kjemiske reaksjoner og elektrisk energi. Batterier og brenselceller er elektrokjemiske systemer.',
  seksjoner: [
    { tittel: 'Galvanisk celle', innhold: 'En galvanisk celle omdanner kjemisk energi til elektrisk energi via spontan redoksreaksjon.\n\nZn-Cu-celle (Daniell-element):\n• Anoden (−, Zn): Zn → Zn²⁺ + 2e⁻ (oksidasjon)\n• Katoden (+, Cu): Cu²⁺ + 2e⁻ → Cu (reduksjon)\n• Saltbro: opprettholder elektrisk nøytralitet ved å transportere ioner mellom de to halvene\n• EMF (Zn-Cu) = +1,10 V\n\nMer reaktivt metall = mer negativt standard elektrode­potensial.' },
    { tittel: 'Batterier og ladbare celler', innhold: '• Litium-ion (Li-ion): gjennomgår reversibel Li⁺-intercalering. Energitetthet: 100–250 Wh/kg. Lades hundrevis av ganger. Brukes i elbiler, smarttelefoner.\n• Blyakkumulator (bilbatteri): Pb/PbO₂ i H₂SO₄. Ladbar, tung, ~40 Wh/kg. Starter­batteri.\n• Brenselcelle (H₂/O₂): H₂ + ½O₂ → H₂O + elektrisitet + varme. 60–65% effektivitet. Eneste biprodukt: vann.' },
  ]
},

'kjemiske_bindinger.html': {
  tittel: 'Kjemiske bindinger',
  km: ['KM9'],
  tf: [],
  ingress: 'Kjemiske bindinger dannes når atomer deler eller overfører elektroner for å oppnå stabil elektronkonfigurasjon (oktettregel).',
  seksjoner: [
    { tittel: 'Bindingstyper', innhold: '• Ionisk binding (ΔEN > 1,7): fullt elektron­overføring. Danner ionegitter med høy smeltepunkt, løses i vann, leder strøm i smeltet form. Eks: NaCl (Na⁺ + Cl⁻).\n• Polær kovalent (ΔEN 0,5–1,7): delt elektronpar, men forskjøvet mot mer elektronegativt atom. Delladninger δ+/δ–. Eks: H₂O, HCl.\n• Apolar kovalent (ΔEN < 0,5): likt delt elektronpar. Eks: H₂, Cl₂, C–H.\n• Metallisk binding: "elektronhav" – gir elektrisk ledning og formbarhet.' },
    { tittel: 'Lewis-strukturer og VSEPR', innhold: 'Lewis-strukturer tegner valenselektroner som prikker. Oktettregel: hvert atom vil ha 8 elektroner i ytterste skall (H: 2).\n\nVSEPR (valence shell electron pair repulsion): elektronpar frastøter hverandre → bestemmer molekylgeometri:\n• Lineær (180°): CO₂ – apolart (symmetri)\n• Bøyd (104,5°): H₂O – polært (asymmetri + ensomme par)\n• Pyramidal (107°): NH₃ – polært\n• Tetraedisk (109,5°): CH₄ – apolart (symmetri)' },
    { tittel: 'Bindingsstyrke og egenskaper', innhold: 'Enkel < dobbel < trippel (sterkere og kortere). C–C: 347 kJ/mol, C=C: 614, C≡C: 839. N≡N: 945 kJ/mol – ekstremt stabil, derfor er N₂ inert.\n\n«Likt løser likt»: polære løsemidler løser ioniske og polære stoffer. Apolare løsemidler løser apolare stoffer (fett/oljer i bensin, ikke i vann).\n\nHydrogenbinding (H bundet til F, O, N): forklarer H₂O-koking ved 100°C, DNA-dobbelthelix og proteinfolding.' },
  ]
},

'organisk_kjemi_karusell.html': {
  tittel: 'Organisk kjemi',
  km: ['KM8','KM9'],
  tf: [],
  ingress: 'Organisk kjemi er kjemien til karbon­forbindelser. Karbon danner 4 bindinger og kan lage karbonkjeder av varierende lengde og form.',
  seksjoner: [
    { tittel: 'Homologe serier', innhold: '• Alkaner (CₙH₂ₙ₊₂): bare enkelt­bindinger. Metan (CH₄), etan, propan, butan… Lavt kokepunkt (London-dispersjonskrefter). Brukes som brensel.\n• Alkener (CₙH₂ₙ): én dobbelt­binding (C=C). Eten (C₂H₄), propen. Mer reaktivt enn alkaner (addisjonsreaksjoner).\n• Alkyner (CₙH₂ₙ₋₂): én trippel­binding (C≡C). Etyn/acetylen (C₂H₂). Brukes i sveising.' },
    { tittel: 'Funksjonelle grupper', innhold: '• –OH (hydroksyl) → Alkohol. Etanol (C₂H₅OH). Løselig i vann, moderat kokepunkt (hydrogenbindinger).\n• –COOH (karboksyl) → Karboksylsyre. Eddiksyre (CH₃COOH). Sur.\n• –NH₂ (amino) → Amin. Basisk. Grunnlag for aminosyrer.\n• –CO– (karbonyl) → Keton eller aldehyd. Aceton.\n• –COO– → Ester. Søtluktende, brukes i parfyme og kunstige smaker.' },
    { tittel: 'Isomerer', innhold: 'Isomerer har samme molekylformel men ulik struktur → ulike egenskaper.\n• Strukturisomerer: ulik karbonkjedeforbindelsestopologi. n-butan vs. isobutan (2-metylpropan): samme C₄H₁₀, ulik form, ulik kokepunkt.\n• Cistransisomerer (geometriske): ulik plassering rundt dobbeltbinding.\n• Enantiomerer (speilbilledisomerer): speilvende strukturer som ikke er identiske. Kritisk i farmasi – en form kan være medikament, den andre giftig.' },
  ]
},

'cellebiologi.html': {
  tittel: 'Cellebiologi – prosesser og deling',
  km: ['KM14'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Cellebiologi handler om cellens prosesser: mitose, meiose og DNA-kopiering er fundamentale for liv og arv.',
  seksjoner: [
    { tittel: 'Mitose – somatisk celledeling', innhold: `Mitose produserer to genetisk identiske datterceller:
• G1-fase: cellevekst, proteinsyntese. Kontrollpunkt: er cellen stor nok?
• S-fase: DNA-replikasjon – alle 46 kromosomer kopieres (46 → 92 kromatider)
• G2-fase: vekst og DNA-skadessjekk
• M-fase (mitose): Profase (kromosomarkondensering) → Metafase (ekvatorplaten) → Anafase (trekking) → Telofase + cytokinese (todeling)

Resultat: 2 diploide (2n=46) datterceller.` },
    { tittel: 'Meiose – kjønnscelledeling', innhold: `Meiose produserer fire haploide (n=23) kjønnsceller:
• Meiose I: homologe kromosomer separeres (reduksjonsdeling). Crossing-over i profase I skaper rekombinasjon.
• Meiose II: søsterkromatider separeres (som mitose)

Resultat: 4 haploide kjønnsceller med unikt genetisk innhold. Befruktning: 23 + 23 = 46 kromosomer.` },
    { tittel: 'Kreft og cellesykluskontroll', innhold: `p53 («genomets vokter»): oppdager DNA-skade → stopper cellesyklusen → initierer apoptose om skaden er irreversibel. Mutert p53 i ~50% av alle krefttyper.

Proto-onkogener (normale vekstgener) → mutasjon → onkogener → ukontrollert vekst. Tumor-suppressorgener (Rb, BRCA1/2) bremser deling – tap av begge kopier → bremsen forsvinner.

Apoptose: programmert celledød via kaspaser. Nødvendig for utvikling og homeostase.` },
  ]
},

'hjertet.html': {
  tittel: 'Hjertet',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Hjertet er en muskelpumpe som sirkulerer blod gjennom det store og det lille kretsløpet.',
  seksjoner: [
    { tittel: 'Hjertets anatomi og funksjon', innhold: `Hjertet har fire kamre:
• Høyre forkammer: mottar oksygenfattig blod fra kroppen via vena cava
• Høyre hjertekammer: pumper blodet til lungene via lungearterien (lite kretsløp)
• Venstre forkammer: mottar oksygenrikt blod fra lungene via lungevenene
• Venstre hjertekammer: pumper oksygenrikt blod til kroppen via aorta (store kretsløp)

Fire klaffer hindrer tilbakestrøm: trikuspidal, mitralklaff, aorta- og lungeklafff.` },
    { tittel: 'Hjerterytme og EKG', innhold: `Sinusknuten (SA-knuten) i høyre forkammer genererer det elektriske signalet (~70 slag/min i hvile). Signalet sprer seg til AV-knuten, His-bunten og Purkinje-fibrene.

EKG: P-bølge (forkammerkontraksjon), QRS-kompleks (hjertekammerkontraksjon), T-bølge (repolarisering).

Hjertets minuttvolumet: HV = slag­volum × pulsfrekvens. I hvile: ~5 L/min. Ved hard trening: opptil 25 L/min.` },
  ]
},

'hjernen.html': {
  tittel: 'Hjernen',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Hjernen er sentralnervesystemets kontrollsenter med ~86 milliarder nevroner og ~100 000 milliarder synapser.',
  seksjoner: [
    { tittel: 'Hjernens lober og funksjoner', innhold: `• Pannelapp (frontal): planlegging, personlighet, beslutningstaking, motorikk, Brocas område (språkproduksjon)
• Isselapp (parietal): sanseinformasjon fra kroppen, romlig orientering, matematikk
• Tinningelapp (temporal): hørsel, hukommelse, Wernickes område (språkforståelse)
• Bakhodelapp (occipital): visuell bearbeiding
• Lillehjerne (cerebellum): balanse, koordinasjon, finmotorikk
• Hjernestammen: pust, puls, søvn, bevissthetsnivå` },
    { tittel: 'Hukommelse og plastisitet', innhold: `Korttidshukommelse: prefrontal cortex, kapasitet ~7 ± 2 elementer, sekunder–minutter.
Langtidshukommelse: hippokampus konsoliderer til kortikal lagring. Søvn er kritisk for konsolidering.

Neuroplastisitet: hjernen omstrukturerer synapser basert på erfaring. LTP (long-term potentiation) er den cellulære mekanismen for læring – gjentatt aktivering styrker synaptiske forbindelser.

Puberteten: myelinisering av prefrontal cortex ikke fullført før ~25 år – forklarer ungdommelig risikoatferd.` },
  ]
},

'lungene.html': {
  tittel: 'Lungene og åndedrett',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Lungene er ansvarlige for gassutveksling – oksygen inn og karbondioksid ut – og regulerer blodets pH via CO₂-nivå.',
  seksjoner: [
    { tittel: 'Luftveiene og lungestruktur', innhold: `Luftvei: nese/munn → svelg → strupehodet (larynx) → luftrøret (trakea) → to bronkier → bronkioler → alveolene.

Alveoler: ~300 millioner lungeblærer. Total overflate: ~70 m². Veggen er kun én celle tykk. Surfaktant (fra type II-pneumocytter) hindrer alveoler i å kollapse.

Tall: pust i hvile 12–16/min · lungekapasitet ~6 L · tidalvolum ~0,5 L · vitalt volum ~4,5 L` },
    { tittel: 'Gassutveksling og transport', innhold: `Diffusjon styres av partialtrykksforskjeller:
• I lungene: PO₂ luft (21 kPa) > PO₂ blod → O₂ diffunderer inn
• PCO₂ blod > PCO₂ luft → CO₂ diffunderer ut

Blodtransport:
• Oksygen: 98% bundet til hemoglobin (HbO₂), 2% løst
• CO₂: 70% som HCO₃⁻ (bikarbonat), 23% bundet til Hb, 7% løst

Pusteregulering: kjemoreseptorer i hjernestammen måler CO₂/pH. Hyperkapni (høy CO₂) stimulerer økt pusterate.` },
  ]
},

'nyrene.html': {
  tittel: 'Nyrene',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Nyrene filtrerer ~180 liter primærurin per dag og produserer ~1,5 L konsentrert urin. De regulerer blodtrykk, pH og osmolalitet.',
  seksjoner: [
    { tittel: 'Nefronets tre prosesser', innhold: `1. Filtrasjon (Bowmans kapsel/Glomerulus): blodtrykk presser vann, ioner, glukose, aminosyrer og urea ut av kapillærene → primærurin (~180 L/dag). Proteiner og blodceller filtreres IKKE (for store).

2. Reabsorpsjon (proksimalt tubulus, Henles slynge, distalt tubulus): glukose, aminosyrer og mest vann og Na⁺ suges aktivt tilbake til blodet. Henles slynge skaper osmotisk gradient.

3. Sekresjon: avfallsstoffer (urinsyre, medikamenter, H⁺) skilles aktivt ut fra blodet til tubulus.` },
    { tittel: 'Hormonal regulering', innhold: `ADH (antidiuretisk hormon, vasopressin): frigjøres fra hypofysen ved dehydrering → øker vannpermeabiliteten i samlerøret → konsentrert urin.

Aldosteron (binyrene): øker Na⁺-reabsorpsjon → mer vann følger → økt blodvolum → økt blodtrykk.

Renin-angiotensin-system (RAS): nyren oppdager lavt blodtrykk → renin → angiotensinogen → angiotensin II → vasokonstriksjon + aldosteron.` },
  ]
},

'oyet.html': {
  tittel: 'Øyets anatomi',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Øyet er det primære sansorganet for syn. Linsen fokuserer lys på netthinnen der fotoreseptorer konverterer lys til nervesignaler.',
  seksjoner: [
    { tittel: 'Øyets struktur', innhold: `• Hornhinne (cornea): gjennomsiktig fremre del. Bryter lyset (~2/3 av total refraksjon). Ingen blodkar.
• Iris: gir øyet farge. Kontraherer/dilater pupillen via glatt muskel (refleks).
• Linse: finjusterer fokus via akkommodasjon (ciliærmusklene). Nærsynt: for lang øyeball → prøver foran netthinnen. Langsynt: for kort.
• Glasslegeme: gjennomsiktig gel fyller øyeballen.
• Netthinne (retina): inneholder staver og tapper. Gul flekk (fovea): høyest konsentrasjon av tapper → skarpest syn.` },
    { tittel: 'Fotoreseptorer og signaloverføring', innhold: `Staver (~120 millioner): svart/hvitt syn, aktiveres ved svakt lys. Rhodopsin + lys → nervesignal.
Tapper (~6 millioner, konsentrert i fovea): fargesyn. Tre typer (S/M/L) reagerer på blå, grønn, rød bølgelengde.

Fargeblindhet: manglende/endret M- eller L-tapper. Rødgrønn fargeblindhet: X-bundet, ~8% av menn.

Signalvei: fotoreseptor → bipolær celle → ganglioncelle → synsnervens fibre krysser i chiasma opticum → primær synsbark (V1 i bakhodelappen).` },
  ]
},

'hormonsystemet.html': {
  tittel: 'Hormonsystemet',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Hormonsystemet (endokrint system) kommuniserer via kjemiske budbringere (hormoner) som frigjøres i blodet og påvirker målorganer.',
  seksjoner: [
    { tittel: 'Viktige hormoner og kjertler', innhold: `• Hypotalamus + hypofyse: overordnet kontroll. Frigjøringshormoner (CRH, TRH, GnRH) → stimulerer hypofysen → tropiske hormoner → målkjertler.
• Skjoldbruskkjertelen: T3/T4 – regulerer metabolisme, vekst, varmeproduksjon.
• Binyrebarken: kortisol (stresshormon), aldosteron (blodtrykk). Binyremarg: adrenalin (kamp/flukt-respons).
• Bukspyttkjertelen: insulin (senker blodsukker) og glukagon (hever blodsukker).
• Kjønnkjertler: testosteron (testiklene), østrogen og progesteron (eggstokker).` },
    { tittel: 'Negativ tilbakekobling', innhold: `Hormonakser reguleres via negativ tilbakekobling:
1. Hypotalamus frigjør TRH
2. Hypofysen frigjør TSH
3. Skjoldbruskkjertelen produserer T3/T4
4. Høye T3/T4-nivåer hemmer TRH og TSH-frigjøring → T3/T4 synker
5. Lave T3/T4 → TRH øker igjen

Sykdommer: hypotyreose (lav T3/T4 → tretthet, vektøkning). Hypertyreose (høy T3/T4 → hjertebank, vekttap). Diabetes type 1 (ingen insulin). Diabetes type 2 (insulinresistens).` },
  ]
},

'kroppens_organer.html': {
  tittel: 'Kroppens organer',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Kroppen er organisert i organsystemer der hvert organ utfører spesialiserte funksjoner i samarbeid med resten.',
  seksjoner: [
    { tittel: 'Organsystemer – oversikt', innhold: `• Sirkulasjonssystemet: hjerte + blodkar + blod. Transporterer O₂, næring, hormoner og avfall.
• Respirasjonssystemet: lunger + luftveier. Gassutveksling.
• Fordøyelsessystemet: munn→endetarm + lever + pankreas. Bryter ned mat og absorberer næring.
• Urinveissystemet: nyrer + urinleder + urinblære. Filtrerer blod og fjerner avfallsstoffer.
• Nervesystemet: hjerne + ryggmarg + nerver. Rask kommunikasjon og kontroll.
• Endokrint system: kjertler + hormoner. Langsam kjemisk regulering.
• Immunsystemet: hvite blodceller + lymfesystem. Forsvar mot infeksjoner.
• Bevegelsesapparatet: skjelett + muskler. Støtte, bevegelse, kalsiumlagring.` },
    { tittel: 'Homeostase', innhold: `Homeostase er kroppens evne til å opprettholde stabile indre forhold (temperatur 37°C, blod-pH 7,35–7,45, blodsukker 4–7 mmol/L, osmolalitet).

Regulering via tilbakekoblingssystemer:
• Sensor registrerer avvik
• Kontrollsenter (oftest hjerne/hypotalamus) prosesserer
• Effektor (muskler/kjertler) korrigerer

Feber: homeostase-sett­punkt heves bevisst som immunrespons (pyrogenene fra makrofager virker på hypotalamus).` },
  ]
},

'mikrobiologi.html': {
  tittel: 'Mikrobiologi',
  km: ['KM22'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Mikrobiologi studerer mikroorganismer: bakterier, virus, sopp og protister – noen er patogene, de fleste er nyttige eller nøytrale.',
  seksjoner: [
    { tittel: 'Bakterier vs. virus', innhold: `Bakterier:
• Prokaryote celler (ingen kjerne)
• 0,5–5 µm
• Formerer seg ved binær fisjon (kan dele seg hvert 20. minutt under ideelle forhold)
• Behandles med antibiotika (hemmer cellevegg, proteinsyntese, DNA-replikasjon)
• De fleste er ufarlige; mange er nyttige (tarmbakterier, Rhizobium)

Virus:
• Ikke-levende: kun arvemateriale (DNA eller RNA) + proteinkapsid
• 20–300 nm – 10–100× mindre enn bakterier
• Kan IKKE formere seg uten vertscelle – kaprer cellens maskineri
• Behandles IKKE med antibiotika – antiviralia (HIV, influensa) finnes for noen` },
    { tittel: 'Smitte og folkehelse', innhold: `Smitteveier: dråpesmitte (luftveier), kontaktsmitte, fekal-oral, blodbåren, vektorbåren (mygg, flått).

R₀ (basisreproduksjonstall): antall nye smittede per smittet i en ikke-immun populasjon. Meslinger: R₀ ≈ 15 (svært smittsomt). COVID-19 (Delta): R₀ ≈ 5–8. Influensa: R₀ ≈ 2–3.

Flokkimmunitet: p_krit = 1 − 1/R₀. Meslinger: 93% vaksinasjon nødvendig.

Antibiotika­resistens (AMR): WHO-topp­prioritet. MRSA og andre multiresistente bakterier. Årsaker: overforbruk, dårlig etterlevelse, bruk i landbruk.` },
  ]
},

'fordoyelsen.html': {
  tittel: 'Fordøyelsessystemet',
  km: ['KM21'],
  tf: ['Folkehelse og livsmestring'],
  ingress: 'Fordøyelsessystemet bryter ned mat til absorberbare molekyler og absorberer næringsstoffer, vitaminer og vann.',
  seksjoner: [
    { tittel: 'Mekanisk og kjemisk fordøyelse', innhold: `Munn: tygge + amylase i spytt bryter ned stivelse → maltose.
Spiserøret: peristaltikk (bølgebevegelse) transporterer mat.
Mage: HCl (pH 1–2) dreper bakterier, pepsinogen → pepsin bryter ned proteiner. Chyme dannes.
Tolv­fingertarmen (duodenum): galle fra lever (emulgerer fett) + enzymer fra pankreas (lipase, protease, amylase) → full fordøyelse.
Tynntarm (6–7 m): enzymer på tarmveggoverflaten. Villi og mikrovilli (~250 m² absorpsjonsflate). Monosakkarider og aminosyrer → portåren. Fettsyrer → lymfe.` },
    { tittel: 'Tykktarm og tarmflora', innhold: `Tykktarm (1,5 m): absorberer vann og elektroly­tter fra ufordøyd materiale. Gjenstår: fiber, cellulose, døde celler → avføring.

Tarmflora (mikrobiom): ~100 billioner bakterier (~1,5 kg). Produserer vitamin K og B12, bryter ned fiber, regulerer immunsystemet. Dysbiose (forstyrret mikrobiom) er knyttet til IBS, fedme, diabetes type 2 og mental helse.

Lever: produserer galle, metaboliserer fett/proteiner/karbohydrater, avgifter blod, lagrer glykogen, produserer blodproteiner.` },
  ]
},

'optikk.html': {
  tittel: 'Optikk – lys og syn',
  km: ['KM6'],
  tf: [],
  ingress: 'Optikk handler om lysets natur, utbredelse og samspill med stoffer: refleksjon, refraksjons, diffraksjons og polarisering.',
  seksjoner: [
    { tittel: 'Snells lov og refraksjons', innhold: `Snells lov: n₁ · sin θ₁ = n₂ · sin θ₂

Brefsnings­indeks: n = c/v (c = lyshastighet i vakuum, v = i medium). n_luft ≈ 1,0, n_vann = 1,33, n_glass ≈ 1,5.

Når lys går fra et tynnere til tettere medium: θ₂ < θ₁ (bøyes mot lodd­linjen). Totalrefleksjon: ved vinkel ≥ θ_kritisk → lyset reflekteres fullstendig. Grunnlag for fiber­optikk (lys trappes inne i fiberen).

Linser: konveks linse (samlende) brukes ved langsynt­het. Konkav linse (spredende) brukes ved nærsynt­het.` },
    { tittel: 'Lys som bølge og partikkel', innhold: `Elektromagnetisk bølge: transversal, trenger ikke medium. Spekter:
• Radiobølger (km) → mikrobølger → infrarød (IR) → synlig lys (400–700 nm) → UV → røntgen → gamma­stråling (pm)

Fotoelektrisk effekt (Einstein 1905): lys er kvantisert i fotoner med energi E = h·f. Bevis på partikkelnaturen.

Dobbelt­spalteforsøk (Young): lysets interferensmønster bekrefter bølgenaturen.

Bølge-partikkel-dualitet: lys er begge deler – dualismen avhenger av hva vi måler.` },
  ]
},

'krefter_bevegelse_teori.html': {
  tittel: 'Krefter og bevegelse',
  km: ['KM11'],
  tf: [],
  ingress: 'Newtons lover beskriver sammenhengen mellom krefter og bevegelse. Friksjon, normalkraft og tyngde er de vanligste kreftene i dagliglivet.',
  seksjoner: [
    { tittel: 'Newtons tre lover', innhold: `1. Treghetslov: et legeme fortsetter i ro eller rettlinjet bevegelse med konstant fart med mindre det virker en netto kraft på det.
2. F = m · a: Netto kraft (N) = masse (kg) × akselerasjon (m/s²). Kraft og akselerasjon peker i samme retning.
3. Aksjon og reaksjon: for enhver kraft virker det en like stor og motsatt rettet kraft. Rakettmotoren: gass skytes bakover → raketten skyves fremover.` },
    { tittel: 'Viktige krefter', innhold: `• Tyngde (G = mg): m = masse (kg), g = 9,81 m/s² ved jordoverflaten. Alltid loddrett nedover.
• Normalkraft (N): vinkelrett på underlaget, mot legemets tyngdekomponent.
• Friksjon (Ff = μ · N): μ = friksjonskoe­ffisient (stål–stål: 0,15, gummi–asfalt: 0,7). Statisk friksjon > kinetisk friksjon.
• Sentripetal­kraft: F = mv²/r, alltid mot sirkelbevegelsens sentrum.

Fritt fall: a = g = 9,81 m/s² (uten luftmotstand). v = g·t, s = ½·g·t²` },
  ]
},

'kommunikasjonsteknologi.html': {
  tittel: 'Kommunikasjonsteknologi',
  km: ['KM6'],
  tf: [],
  ingress: 'Kommunikasjonsteknologi muliggjør overføring av informasjon via elektriske, elektromagnetiske og optiske signaler over korte og lange avstander.',
  seksjoner: [
    { tittel: 'Sender–kanal–mottaker', innhold: `Shannon-Weavers kommunikasjonsmodell:
• Sender: koder informasjon til signal (mikrofon → analog lyd → digital datastrøm)
• Kanal/medium: luft (radiobølger), kobberkabel, glassfiberkabel
• Mottaker: dekoder signalet tilbake til informasjon
• Støy: forstyrrelser som degraderer signalet

Analog vs. digital: analoge signaler er kontinuerlige (AM-radio, telefon). Digitale signaler er diskrete (0/1). ADC (Analog-to-Digital Converter) digitaliserer ved sampling (Nyquist: samplingsrate ≥ 2× høyeste frekvens).` },
    { tittel: 'Teknologier', innhold: `• AM/FM-radio: Amplityde/frekvens­modulasjon av bærebølge. FM: bedre støytoleranse.
• Mobilnett: 2G (GSM, tale+SMS) → 3G (datapakker) → 4G/LTE (~100 Mbit/s) → 5G (opptil 10 Gbit/s, lav latens). Basert på mikrobølger (700 MHz – 60 GHz for 5G).
• Fiber­optikk: lys i glassfibere via totalrefleksjon. Kapasitet: 10+ Tbit/s per fiber. Lav tap (~0,2 dB/km).
• GPS: trilaterasjon fra ≥4 satellitter (signaltid × lyshastighet = avstand). Nøyaktighet: 2–5 m.
• Wi-Fi: IEEE 802.11, 2,4 GHz og 5 GHz. Bluetooth: 2,4 GHz, kortdistanse.` },
  ]
},

'astronomi.html': {
  tittel: 'Astronomi',
  km: ['KM3'],
  tf: [],
  ingress: 'Astronomi studerer universets innhold fra planeter og stjerner til galakser og Big Bang. Moderne astronomi bruker elektromagnetisk stråling fra hele spekteret.',
  seksjoner: [
    { tittel: 'Solsystemet', innhold: `Solen (G-type stjerne, 1,4 mill. km diameter) inneholder 99,86% av solsystemets masse. Åtte planeter:
• Indre (terrestriske): Merkur, Venus, Jorda, Mars – steinplaneter
• Ytre (gassplaneter): Jupiter, Saturn, Uranus, Neptun

Avstander i astronomiske enheter (AE): 1 AE = Jord–Sol-avstand = 149,6 mill. km. Neptun: 30 AE. Lysår: ~63 240 AE. Nærmeste stjerne (Proxima Centauri): 4,24 lysår.

Månen: Jordas eneste naturlige satellitt. Diameter: 3 474 km (~27% av Jorda). Tidevann: tyngdekraften fra Månen og Solen.` },
    { tittel: 'Stjernenes liv og universet', innhold: `Stjerners livssyklus: nebulosa → protostar → main sequence-stjerne → rødkjempe → (avhengig av masse) hvit dverg / nøytronstjerne / svart hull.

Solen: midtveis i sin levetid (~5 mill. år igjen). Vil ekspandere til rødkjempe og svelge de indre planetene.

Galakser: Melkeveien er en spiralgalakse med ~200–400 milliarder stjerner. Diameter ~100 000 lysår. Det observerbare universet: ~93 milliard lysår diameter. Big Bang: ~13,8 milliarder år siden. Hubbles lov: galakser beveger seg fra oss med hastighet v = H₀ · d.` },
  ]
},

'havet.html': {
  tittel: 'Havet og havets dybdesoner',
  km: ['KM15'],
  tf: ['Bærekraftig utvikling'],
  ingress: 'Verdenshavene dekker 71% av jordoverflaten og er delt i vertikale dybdesoner med dramatisk ulike livsbetingelser.',
  seksjoner: [
    { tittel: 'Dybdesoner', innhold: `• Epipelagisk (0–200 m): sollys, fotosyntese, primærproduksjon. Korallrev, plankton, pelagisk fisk.
• Mesopelagisk (200–1000 m): skumringssone. Mange dyr gjør daglig vertikalvandring.
• Bathypelagisk (1000–4000 m): totalt mørkt, kaldt (~4°C), høyt trykk. Bioluminescens.
• Abyssopelagisk (4000–6000 m): ekstremt trykk (400 atm), nær frysing.
• Hadspelagisk (6000+ m): havgrøfter. Mariana­grøften: 11 034 m.` },
    { tittel: 'Havets rolle og trusler', innhold: `Havet absorberer ~30% av CO₂-utslippene → havforsuring (pH fra 8,2 til 8,1 siden 1800 – 26% mer surt). Koraller og skalldyr løses opp ved lavere pH.

Havet absorberer ~93% av overskuddsvarmen fra drivhuseffekten.

Oseanisk sirkulasjon (AMOC): transporten varme til N-Europa. Svekkes nå pga. ferskvann fra Grønland.

Plastforurensning: ~8 mill. tonn plast dumpes i havet per år. Mikroplast finnes i alle dybder og i marine organismer. Havfisket: ~90% av fiskebestander er fullt utnyttet eller overutnyttet.` },
  ]
},

'vaer_atmosfaere.html': {
  tittel: 'Vær og atmosfære',
  km: ['KM10'],
  tf: ['Bærekraftig utvikling'],
  ingress: 'Atmosfæren er Jordas gasskappe, delt i lag med ulike egenskaper. Vær er atmosfærens kortsiktige tilstand; klima er det langsiktige gjennomsnittet.',
  seksjoner: [
    { tittel: 'Atmosfærens lag', innhold: `• Troposfæren (0–12 km): ~75% av atmosfærens masse. Alle værsystemer her. Temperatur synker med 6,5°C/km.
• Stratosfæren (12–50 km): ozonlaget (~25 km) absorberer UV-stråling. Temperaturen stiger (O₃ absorberer energi). Jetstrømmen her.
• Mesosfæren (50–80 km): temperaturen synker igjen. Meteorer brenner opp her.
• Termosfæren (80–500 km): ionosfæren reflekterer radiobølger. ISS. Nordlys.
• Eksosfæren (500+ km): gradvis overgang til verdensrommet.` },
    { tittel: 'Værsystemer og klimasoner', innhold: `Lufttrykk: lavtrykk (L) = stigende luft = nedbør og vind. Høytrykk (H) = synkende luft = klart vær.

Klimasoner skyldes jordaksens helning (23,5°) og ulik solinnstråling: tropisk (ekvator, regn), subtropisk (ørken), temperert (Skandinavia), polar.

El Niño/La Niña: temperaturen i det tropiske Stillehavet svinger → global værpåvirkning.

Norge: maritimt klima på kysten (milde vintre, kjølige somre) vs. kontinentalt klima i innlandet (kaldere vintre, varmere somre). Vestlandet: orografisk nedbør (luft tvinges opp langs fjell).` },
  ]
},

'energiproduksjon.html': {
  tittel: 'Energiproduksjon',
  km: ['KM11','KM12'],
  tf: ['Bærekraftig utvikling'],
  ingress: 'Energiproduksjon omdanner primærenergi (sol, vind, kull, olje) til brukbare former (elektrisitet, varme). Valg av kilde har store klimamessige og miljømessige konsekvenser.',
  seksjoner: [
    { tittel: 'Energikilder – oversikt', innhold: `Ikke-fornybare:
• Kull, olje, naturgass: fossile brensler – lagret solenergi. Høy energitetthet, enkel lagring, men CO₂-utslipp.
• Kjernekraft (fisjon): uran-235 spaltes → enorme energimengder. Nær null CO₂, men radioaktivt avfall og risiko.

Fornybare:
• Solkraft: PV-celler (fotoelektrisk effekt). Termisk sol (varmtvannsanlegg). Kostnader falt 90% siden 2010.
• Vindkraft: kinetisk energi i vind → mekanisk → elektrisk. Lavest livsløps-CO₂ (~11 g/kWh).
• Vannkraft: potensielle energi i vann → elektrisk. Norge: 90% av strøm.
• Biomasse: biologisk materiale → forbrenning, biogass, etanol.` },
    { tittel: 'Energiomforming og virkningsgrad', innhold: `Energikjede eksempel: kull → forbrenning (termisk) → damp (mekanisk) → generator (elektrisk) → motor (mekanisk) → varme (friksjon).

Hvert ledd har tap (2. termodynamikkvlov). Total virkningsgrad: produkt av alle delledd. Kullkraftverk: ~38% elektrisk virkningsgrad.

Norges energimiks: 90% vannkraft, ~7% vindkraft, resten termisk og kjernekraft. Norge er verdens 7. største eksportør av gass og en stor olje­produsent – oljeparadokset.` },
  ]
},

'samisk_natur.html': {
  tittel: 'Samisk naturkunnskap',
  km: ['KM17'],
  tf: ['Bærekraftig utvikling','Demokrati og medborgerskap'],
  ingress: 'Samenes tradisjonelle naturkunnskap (TEK – Traditional Ecological Knowledge) er akkumulert over generasjoner og representerer et komplementært perspektiv til vestlig naturvitenskap.',
  seksjoner: [
    { tittel: 'Tradisjonell kunnskap', innhold: `TEK (Tradisjonell Økologisk Kunnskap) kjennetegnes av:
• Lokalt og historisk forankret (generasjoners observasjoner)
• Helhetlig (samspill mellom naturelementene)
• Praktisk og erfaringsbasert
• Overlevert muntlig og gjennom praksis

Eksempler: 300+ ord for snø og is i nordsamisk – hvert begrep koder viktig informasjon om snøkvalitet og ferdselssikkerhet. Siida-systemet: tradisjonell reindrifts­forvaltningsenhet som balanserer ressursbruk i beitemarker.` },
    { tittel: 'Reindrift og bærekraft', innhold: `Transhumance: nomadisk sesong­vandring mellom sommerbeite (kyst/fjell) og vinterbeite (innland/lavere skog). Følger reinens naturlige trekkruter.

Bærekraftsprinsipper i reindrift: rotering av beitemarker, uttak som matcher bestandens vekst, kunnskap om naturens bæreevne.

Klimaendringer og TEK: gjevdni (is­skorpe på bakken) hindrer reinens mattilgang → krisescenarioer. Samiske observasjoner fanges opp av EALÁT-prosjektet og brukes i klimamodeller.

Fosen-saken (2021): vindkraftutbygging på Fosen brøt samenes rettigheter etter ILO-konvensjonen 169 om urfolks rettigheter.` },
  ]
},

'seksualundervisning.html': {
  tittel: 'Seksualundervisning',
  km: ['KM20'],
  tf: ['Folkehelse og livsmestring','Demokrati og medborgerskap'],
  ingress: 'Seksuell og reproduktiv helse er en grunnleggende menneskerettighet. God seksualundervisning reduserer uønskede svangerskap og SOI-smitte og fremmer sunne relasjoner.',
  seksjoner: [
    { tittel: 'Pubertet og hormonforandringer', innhold: `Puberteten utløses av økt GnRH fra hypotalamus → LH og FSH fra hypofysen → kjønnshormoner.

Jenter: Østrogen → brystutvikling, bredere hofter, menstruasjon. Starter: 8–13 år.
Gutter: Testosteron → stemmeskifte, muskelutvikling, spermproduksjon. Starter: 9–14 år.

Menstruasjonssyklusen (~28 dager): follikkelmodning (dag 1–14, østrogen↑) → ovulasjon (dag 14, LH-topp) → lutealfase (dag 14–28, progesteron↑) → menstruasjon hvis ingen befruktning.` },
    { tittel: 'Seksuell og reproduktiv helse', innhold: `WHO: seksuell helse er «en tilstand av fysisk, emosjonell, mental og sosial velvære knyttet til seksualitet».

Prevensjon:
• P-pille: østrogen + progesteron hemmer eggløsning. ~99% effektiv ved korrekt bruk.
• Kondom: eneste metode som beskytter mot både graviditet og SOI.
• Hormonspiral (Mirena): 5+ år, svært effektiv.
• Nødprevensjon (Norlevo): opp til 72 timer etter ubeskyttet sex.

Sexuelt overførbare infeksjoner (SOI): klamydia (vanligste i Norge), gonoré, syfilis, HIV. Test og behandle – klamydia og gonoré kureres med antibiotika.

Samtykke: straffeloven 2024 – sex uten samtykke er voldtekt.` },
  ]
},


};

// ═══════════════════════════════════════════════════════
// PDF-GENERATOR
// ═══════════════════════════════════════════════════════

let jsPDFLastet = false;
let jsPDFLoader = null;

function lastJsPDF() {
  if (jsPDFLastet) return Promise.resolve();
  if (jsPDFLoader) return jsPDFLoader;
  
  jsPDFLoader = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = () => { jsPDFLastet = true; resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return jsPDFLoader;
}

// Normaliser href til nøkkel
function normHref(href) {
  return href.split('/').pop().replace(/[?#].*$/, '');
}

function genererPDF(href) {
  const nøkkel = normHref(href);
  const innhold = FAGINNHOLD[nøkkel];
  
  if (!innhold) {
    alert('PDF-innhold for denne siden er ikke tilgjengelig ennå.');
    return;
  }
  
  lastJsPDF().then(() => {
    byggPDF([nøkkel], false);
  }).catch(() => {
    alert('Kunne ikke laste PDF-bibliotek. Sjekk internettilkobling.');
  });
}

function genererBokPDF(hrefs) {
  const nøkler = hrefs.map(normHref).filter(k => FAGINNHOLD[k]);
  
  if (nøkler.length === 0) {
    alert('Ingen av de valgte sidene har PDF-innhold tilgjengelig.');
    return;
  }
  
  lastJsPDF().then(() => {
    byggPDF(nøkler, true);
  }).catch(() => {
    alert('Kunne ikke laste PDF-bibliotek. Sjekk internettilkobling.');
  });
}

function byggPDF(nøkler, erBok) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  const W = 210, H = 297;
  const mgL = 20, mgR = 20, mgT = 22, mgB = 22;
  const tekstBredde = W - mgL - mgR;
  
  // Farger og stiler
  const FARGE = {
    mørk: [20, 30, 50],
    mellom: [60, 80, 110],
    lys: [140, 160, 190],
    svak: [220, 228, 240],
    kropp: [40, 45, 55],
    bakgrunn: [248, 250, 255],
    grønn: [30, 120, 80],
    blå: [20, 80, 160],
    rød: [160, 40, 40],
  };
  
  let side = 1;
  let y = mgT;
  
  function nyLinje(høyde) {
    y += høyde;
    if (y > H - mgB - 10) {
      doc.addPage();
      side++;
      y = mgT;
      tegnHode();
    }
  }
  
  function tegnHode() {
    doc.setFillColor(...FARGE.mørk);
    doc.rect(0, 0, W, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('SkapLab – Naturfag', mgL, 8);
    doc.text(`Side ${side}`, W - mgR, 8, { align: 'right' });
    if (y < 15) y = 15;
  }
  
  function tegnBund(tekst) {
    doc.setFillColor(...FARGE.svak);
    doc.rect(0, H - 10, W, 10, 'F');
    doc.setTextColor(...FARGE.mellom);
    doc.setFontSize(7);
    doc.text(tekst, W / 2, H - 4, { align: 'center' });
  }
  
  function settTekst(tekst, x, y, opts = {}) {
    const { størrelse = 10, farge = FARGE.kropp, font = 'normal', maks = tekstBredde } = opts;
    doc.setFontSize(størrelse);
    doc.setTextColor(...farge);
    doc.setFont('helvetica', font);
    const linjer = doc.splitTextToSize(tekst, maks);
    doc.text(linjer, x, y);
    return linjer.length * (størrelse * 0.4 + 0.5);
  }
  
  function tegnSVG(svgStreng, xPos, yPos, bredde) {
    // SVG tegnes som inline-bilde via canvas
    // Siden jsPDF ikke nativt støtter SVG, bruker vi en enkel SVG-to-canvas-konvertering
    try {
      const svgBlob = new Blob([svgStreng], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      return new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const høyde = bredde * (canvas.height / canvas.width);
          doc.addImage(dataUrl, 'JPEG', xPos, yPos, bredde, høyde);
          resolve(høyde);
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(0); };
        img.src = url;
      });
    } catch (e) {
      return Promise.resolve(0);
    }
  }
  
  // === BYGG PDF ASYNKRONT ===
  async function byggSider() {
    
    // FORSIDE (kun for bok med flere emner)
    if (erBok && nøkler.length > 1) {
      doc.setFillColor(...FARGE.bakgrunn);
      doc.rect(0, 0, W, H, 'F');
      
      doc.setFillColor(...FARGE.mørk);
      doc.rect(0, 70, W, 80, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.text('SkapLab', W / 2, 100, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Naturfag – Kompendium', W / 2, 112, { align: 'center' });
      
      doc.setTextColor(...FARGE.kropp);
      doc.setFontSize(11);
      y = 165;
      doc.text('Inneholder:', mgL, y);
      y += 8;
      
      for (const nøkkel of nøkler) {
        const inn = FAGINNHOLD[nøkkel];
        if (!inn) continue;
        doc.setFontSize(10);
        doc.setTextColor(...FARGE.mellom);
        doc.text(`• ${inn.tittel}`, mgL + 4, y);
        
        if (inn.km.length > 0) {
          doc.setFontSize(8);
          doc.setTextColor(...FARGE.lys);
          doc.text(inn.km.join(', '), mgL + 4 + doc.getTextWidth(`• ${inn.tittel}`) + 4, y);
        }
        y += 7;
      }
      
      tegnBund(`Generert ${new Date().toLocaleDateString('no-NO')} · lk20 naturfag 10. trinn`);
      doc.addPage();
      side++;
    }
    
    // === EMNESIDER ===
    for (let ei = 0; ei < nøkler.length; ei++) {
      const nøkkel = nøkler[ei];
      const inn = FAGINNHOLD[nøkkel];
      if (!inn) continue;
      
      if (ei > 0) { doc.addPage(); side++; }
      y = mgT;
      
      // Bakgrunn
      doc.setFillColor(...FARGE.bakgrunn);
      doc.rect(0, 0, W, H, 'F');
      
      tegnHode();
      
      // Emnehode – fargeblokk
      doc.setFillColor(...FARGE.mørk);
      doc.rect(mgL - 5, y - 4, tekstBredde + 10, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text(inn.tittel, mgL, y + 8);
      
      // KM-badges
      if (inn.km.length > 0) {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        let bx = W - mgR;
        for (const km of [...inn.km].reverse()) {
          const bw = doc.getTextWidth(km) + 4;
          bx -= bw + 2;
          doc.setFillColor(80, 140, 200);
          doc.roundedRect(bx, y + 1, bw, 6, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text(km, bx + 2, y + 5.5);
        }
      }
      
      // Tverrfaglige tema
      if (inn.tf.length > 0) {
        doc.setFontSize(7);
        let tx = mgL;
        const tfy = y + 18 + 5;
        for (const tf of inn.tf) {
          const farge = tf.includes('Bær') ? [30,120,80] : tf.includes('Folk') ? [180,60,40] : [100,50,160];
          const tw = doc.getTextWidth(tf) + 4;
          doc.setFillColor(...farge);
          doc.roundedRect(tx, tfy, tw, 5.5, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text(tf, tx + 2, tfy + 4);
          tx += tw + 3;
        }
        y += 28;
      } else {
        y += 22;
      }
      
      // Separator
      y += 6;
      doc.setDrawColor(...FARGE.svak);
      doc.setLineWidth(0.5);
      doc.line(mgL, y, W - mgR, y);
      y += 6;
      
      // Ingress
      const ingressHøyde = settTekst(inn.ingress, mgL, y, {
        størrelse: 10, farge: FARGE.mellom, font: 'italic'
      });
      y += ingressHøyde + 5;
      
      // SVG-ILLUSTRASJONER (for dette emnet)
      const illustr = ILLUSTRASJONER[nøkkel];
      if (illustr) {
        for (const ill of illustr) {
          if (!ill.svg) {
            // Bare caption
            if (ill.caption) {
              const h = settTekst(`ℹ ${ill.caption}`, mgL, y, {
                størrelse: 8, farge: FARGE.lys, font: 'italic'
              });
              y += h + 4;
            }
            continue;
          }
          
          // Tegn SVG via canvas
          const imgBredde = tekstBredde * ill.width;
          const imgX = mgL + (tekstBredde - imgBredde) / 2;
          
          // Ramme
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(...FARGE.svak);
          doc.setLineWidth(0.3);
          
          try {
            const svgHøyde = await tegnSVG(ill.svg, imgX, y, imgBredde);
            if (svgHøyde > 0) {
              doc.rect(imgX - 1, y - 1, imgBredde + 2, svgHøyde + 2);
              y += svgHøyde + 4;
            }
          } catch (e) {
            // Illustrasjon feilet – fortsett
          }
          
          // Caption
          if (ill.caption) {
            const h = settTekst(ill.caption, mgL, y, {
              størrelse: 8, farge: FARGE.lys, font: 'italic'
            });
            y += h + 6;
          }
          
          // Sjekk sideskift
          if (y > H - mgB - 20) {
            doc.addPage();
            side++;
            y = mgT;
            tegnHode();
          }
        }
      }
      
      // SEKSJONER MED FAGINNHOLD
      for (const sek of inn.seksjoner) {
        // Sjekk om det er plass til seksjonstittel + litt innhold
        if (y > H - mgB - 30) {
          doc.addPage();
          side++;
          y = mgT;
          tegnHode();
        }
        
        // Seksjonstittel
        doc.setFillColor(...FARGE.svak);
        doc.rect(mgL - 2, y - 3, tekstBredde + 4, 9, 'F');
        doc.setFillColor(20, 80, 160);
        doc.rect(mgL - 2, y - 3, 3, 9, 'F');
        const tittelHøyde = settTekst(sek.tittel, mgL + 3, y + 4, {
          størrelse: 10, farge: FARGE.mørk, font: 'bold'
        });
        y += 10;
        
        // Innhold – splittet på linjeskift
        const avsnitt = sek.innhold.split('\n');
        for (const avs of avsnitt) {
          if (!avs.trim()) { y += 2; continue; }
          
          const erPunktliste = avs.trim().startsWith('•');
          const innrykk = erPunktliste ? mgL + 4 : mgL;
          const bMax = tekstBredde - (erPunktliste ? 4 : 0);
          
          if (y > H - mgB - 15) {
            doc.addPage();
            side++;
            y = mgT;
            tegnHode();
          }
          
          const h = settTekst(avs.trim(), innrykk, y, {
            størrelse: 9.5, farge: FARGE.kropp, font: 'normal', maks: bMax
          });
          y += h + 2;
        }
        y += 5;
      }
      
      tegnBund(`SkapLab · ${inn.tittel} · ${inn.km.join(', ') || 'Naturfag'}`);
    }
    
    // Lagre
    const filnavn = erBok && nøkler.length > 1
      ? `skaplab_kompendium_${new Date().toISOString().slice(0,10)}.pdf`
      : `skaplab_${nøkler[0].replace('.html','')}.pdf`;
    
    doc.save(filnavn);
  }
  
  byggSider().catch(e => {
    console.error('PDF-feil:', e);
    alert('Det oppsto en feil under PDF-generering. Se konsoll for detaljer.');
  });
}

// Eksporter til global scope
global.genererPDF = genererPDF;
global.genererBokPDF = genererBokPDF;

})(window);
