/* Mlezi — illustrations des situations (SVG plats, sans image externe) */
window.MLEZI_SCENES = (function () {
  var V = "#0B5D45", J = "#F2C230", E = "#16201C", C = "#F6F4EF", R = "#B83A2B", S = "#D9D3C7", B = "#ECE7DD";
  function svg(inner) { return '<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">' + inner + "</svg>"; }
  function tel(x, y, w, h, ecran) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (w * 0.14) + '" fill="' + E + '"/>' +
      '<rect x="' + (x + 3) + '" y="' + (y + 6) + '" width="' + (w - 6) + '" height="' + (h - 12) + '" rx="' + (w * 0.08) + '" fill="' + (ecran || C) + '"/>';
  }
  function badge(x, y, n) {
    return '<g class="pulse"><circle cx="' + x + '" cy="' + y + '" r="9" fill="' + R + '"/><text x="' + x + '" y="' + (y + 4) + '" font-size="11" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif">' + n + "</text></g>";
  }
  function perso(x, y, couleur, s) {
    s = s || 1;
    return '<circle cx="' + x + '" cy="' + (y - 34 * s) + '" r="' + (11 * s) + '" fill="' + E + '"/>' +
      '<path d="M' + (x - 18 * s) + " " + y + " q0 -22 " + (18 * s) + " -22 q" + (18 * s) + " 0 " + (18 * s) + ' 22z" fill="' + couleur + '"/>';
  }
  return {
    nuit: svg(
      '<rect width="320" height="140" fill="' + B + '"/>' +
      '<rect x="22" y="18" width="82" height="64" rx="4" fill="#26364C"/><circle cx="82" cy="38" r="9" fill="' + C + '"/><rect x="60" y="18" width="4" height="64" fill="' + B + '"/><rect x="22" y="48" width="82" height="4" fill="' + B + '"/>' +
      '<rect x="0" y="108" width="320" height="32" fill="' + S + '"/>' +
      '<rect x="150" y="84" width="150" height="30" rx="6" fill="' + V + '"/><rect x="150" y="76" width="44" height="16" rx="6" fill="' + C + '"/>' +
      tel(212, 34, 34, 58, J) + badge(246, 34, "9") +
      '<path d="M200 46 l-8 -4 M200 58 h-9 M200 70 l-8 4 M258 46 l8 -4 M258 58 h9 M258 70 l8 4" stroke="' + E + '" stroke-width="3" stroke-linecap="round"/>'
    ),
    partage: svg(
      '<rect width="320" height="140" fill="' + B + '"/>' +
      tel(142, 34, 36, 66, S) + '<rect x="149" y="52" width="22" height="18" rx="2" fill="' + R + '" opacity=".75"/>' +
      [[40, 22], [40, 82], [250, 22], [250, 82]].map(function (p) {
        return tel(p[0], p[1], 26, 44, S) + '<rect x="' + (p[0] + 6) + '" y="' + (p[1] + 14) + '" width="14" height="12" rx="2" fill="' + R + '" opacity=".75"/>';
      }).join("") +
      '<path d="M140 52 L72 40 M140 82 L72 100 M180 52 L248 40 M180 82 L248 100" stroke="' + E + '" stroke-width="2.5" stroke-dasharray="5 5"/>' +
      badge(178, 34, "37")
    ),
    chantage: svg(
      '<rect width="320" height="140" fill="' + B + '"/>' +
      tel(120, 16, 80, 112, C) +
      '<circle cx="160" cy="54" r="20" fill="' + E + '"/><text x="160" y="62" font-size="24" font-weight="800" text-anchor="middle" fill="' + C + '" font-family="sans-serif">?</text>' +
      '<rect x="134" y="84" width="52" height="8" rx="4" fill="' + S + '"/><rect x="140" y="98" width="40" height="8" rx="4" fill="' + S + '"/>' +
      '<circle cx="262" cy="70" r="26" fill="' + J + '"/><text x="262" y="77" font-size="16" font-weight="800" text-anchor="middle" fill="' + E + '" font-family="monospace">KMF</text>' +
      '<path d="M240 48 L284 92" stroke="' + R + '" stroke-width="6" stroke-linecap="round"/>' +
      '<rect x="36" y="46" width="44" height="34" rx="6" fill="' + V + '"/><path d="M46 46 v-8 a12 12 0 0 1 24 0 v8" fill="none" stroke="' + V + '" stroke-width="6"/>'
    ),
    honte: svg(
      '<rect width="320" height="140" fill="' + B + '"/><rect x="0" y="112" width="320" height="28" fill="' + S + '"/>' +
      '<rect x="40" y="96" width="100" height="16" rx="4" fill="' + E + '" opacity=".2"/>' +
      perso(92, 112, V) +
      '<rect x="112" y="40" width="44" height="24" rx="10" fill="' + C + '"/><text x="134" y="56" font-size="16" font-weight="800" text-anchor="middle" fill="' + E + '" font-family="sans-serif">…</text>' +
      perso(226, 112, J) +
      '<path d="M196 70 q-16 -10 -40 4" fill="none" stroke="' + E + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 6"/>'
    ),
    public: svg(
      '<rect width="320" height="140" fill="' + B + '"/>' +
      '<rect x="70" y="14" width="180" height="114" rx="10" fill="' + C + '"/>' +
      '<circle cx="90" cy="32" r="9" fill="' + E + '"/><rect x="106" y="27" width="70" height="9" rx="4" fill="' + S + '"/>' +
      '<rect x="82" y="48" width="156" height="52" rx="4" fill="' + S + '"/><text x="160" y="78" font-size="11" text-anchor="middle" fill="#6B665C" font-family="sans-serif" font-weight="700">[photo floutée]</text>' +
      '<rect x="82" y="108" width="40" height="10" rx="5" fill="' + S + '"/><rect x="128" y="108" width="40" height="10" rx="5" fill="' + S + '"/>' +
      '<g class="pulse"><rect x="208" y="104" width="30" height="18" rx="5" fill="' + R + '"/><path d="M217 108 v10 M217 108 h11 l-3 4 l3 4 h-11" stroke="#fff" stroke-width="2" fill="none"/></g>'
    )    ,mariage: svg(
      '<rect width="320" height="140" fill="#26364C"/>' +
      [30,90,150,210,270].map(function(x,i){return '<circle cx="'+(x+15)+'" cy="'+(18+(i%2)*8)+'" r="4" fill="'+J+'" class="pulse"/>';}).join("") +
      '<path d="M20 40 L160 22 L300 40 Z" fill="'+V+'"/><rect x="20" y="40" width="280" height="6" fill="'+J+'"/>' +
      '<rect x="0" y="112" width="320" height="28" fill="'+S+'"/>' +
      perso(70,112,J) + perso(120,112,R,0.9) + perso(200,112,V,0.95) + perso(250,112,C) +
      '<ellipse cx="160" cy="104" rx="14" ry="8" fill="'+C+'"/><rect x="146" y="104" width="28" height="10" fill="'+C+'"/>' +
      tel(283,60,22,36,J)
    ),
    video: svg(
      '<rect width="320" height="140" fill="'+B+'"/>' +
      tel(110,10,100,122,S) +
      '<circle cx="160" cy="62" r="20" fill="'+E+'" opacity=".85"/><path d="M154 52 l16 10 l-16 10z" fill="'+C+'"/>' +
      '<rect x="122" y="96" width="76" height="6" rx="3" fill="'+C+'"/><rect x="122" y="96" width="30" height="6" rx="3" fill="'+R+'"/>' +
      '<g class="pulse"><rect x="226" y="40" width="70" height="26" rx="6" fill="'+R+'"/><text x="261" y="58" font-size="12" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">TRUQUÉ</text></g>' +
      '<path d="M40 50 h40 M40 64 h28 M40 78 h36" stroke="'+E+'" stroke-width="5" stroke-linecap="round" opacity=".25"/>'
    ),
    famille: svg(
      '<rect width="320" height="140" fill="'+B+'"/><rect x="0" y="112" width="320" height="28" fill="'+S+'"/>' +
      perso(60,112,V) + perso(110,112,J,0.9) + perso(210,112,C,0.95) + perso(260,112,V,1.05) +
      '<rect x="44" y="20" width="60" height="26" rx="10" fill="'+C+'"/><text x="74" y="38" font-size="15" font-weight="800" text-anchor="middle" fill="'+R+'" font-family="sans-serif">!!</text>' +
      '<rect x="222" y="16" width="60" height="26" rx="10" fill="'+C+'"/><text x="252" y="34" font-size="15" font-weight="800" text-anchor="middle" fill="'+R+'" font-family="sans-serif">!!</text>' +
      '<circle cx="160" cy="66" r="12" fill="'+E+'" opacity=".55"/><path d="M144 112 q0 -26 16 -26 q16 0 16 26z" fill="'+R+'" opacity=".55"/>'
    ),
    code: svg(
      '<rect width="320" height="140" fill="'+B+'"/>' +
      tel(120,10,80,122,C) +
      '<rect x="130" y="36" width="60" height="38" rx="8" fill="'+S+'"/><text x="160" y="61" font-size="15" font-weight="800" text-anchor="middle" fill="'+E+'" font-family="monospace">482 913</text>' +
      '<rect x="130" y="82" width="44" height="8" rx="4" fill="'+S+'"/>' +
      '<g class="pulse"><circle cx="252" cy="62" r="24" fill="'+R+'"/><path d="M240 50 l24 24 M264 50 l-24 24" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>' +
      '<rect x="40" y="56" width="44" height="34" rx="6" fill="'+V+'"/><path d="M50 56 v-8 a12 12 0 0 1 24 0 v8" fill="none" stroke="'+V+'" stroke-width="6"/><circle cx="62" cy="72" r="5" fill="'+J+'"/>'
    ),
    piratage: svg(
      '<rect width="320" height="140" fill="'+B+'"/>' +
      tel(70,14,70,114,E) + '<circle cx="105" cy="56" r="16" fill="'+S+'"/><rect x="85" y="80" width="40" height="8" rx="4" fill="'+S+'"/>' +
      '<path d="M150 70 h40" stroke="'+R+'" stroke-width="4" stroke-dasharray="6 5"/><path d="M186 62 l10 8 l-10 8" fill="none" stroke="'+R+'" stroke-width="4"/>' +
      '<circle cx="240" cy="54" r="22" fill="'+E+'"/><rect x="222" y="48" width="36" height="10" rx="4" fill="'+C+'"/><circle cx="231" cy="53" r="3" fill="'+E+'"/><circle cx="249" cy="53" r="3" fill="'+E+'"/>' +
      '<path d="M212 112 q0 -30 28 -30 q28 0 28 30z" fill="'+E+'"/>'
    )
  };
})();
