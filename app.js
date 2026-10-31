(function () {
  "use strict";
  var C = window.MLEZI, SC = window.MLEZI_SCENES || {};
  var LS = "mlezi:v1";

  /* ---------- État (stocké seulement sur le téléphone) ---------- */
  var etat = lire() || {};
  etat.langue = etat.langue || "sh";
  etat.profil = etat.profil || "fille";
  etat.meilleurs = etat.meilleurs || {};
  if (etat.son == null) etat.son = true;
  var partie = null, jeton = 0;

  function lire() { try { return JSON.parse(localStorage.getItem(LS)); } catch (e) { return null; } }
  function sauver() { try { localStorage.setItem(LS, JSON.stringify(etat)); } catch (e) {} }

  /* ---------- Textes ---------- */
  function t(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    var v = obj[etat.langue];
    return (v && v.trim()) ? v : (obj.fr || "");
  }
  function aTraduction(obj) { return !!(obj && obj[etat.langue] && obj[etat.langue].trim()); }
  function remplir(txt) {
    var p = C.profils[etat.profil] || C.profils.fille;
    return txt.replace(/\{(groupe|amie|Amie)\}/g, function (_, k) { return t(p[k]); });
  }
  function T(cle) { return t(C.ui[cle]); }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function attendre(ms) { var j = jeton; return new Promise(function (ok, ko) { setTimeout(function () { j === jeton ? ok() : ko("annule"); }, ms); }); }

  function traduireInterface() {
    document.documentElement.lang = etat.langue === "fr" ? "fr" : "zdj";
    document.querySelectorAll("[data-t]").forEach(function (n) { n.textContent = T(n.getAttribute("data-t")); });
    document.querySelectorAll("#choix-langue button").forEach(function (b) { b.classList.toggle("choisi", b.dataset.langue === etat.langue); });
    document.querySelectorAll("#choix-profil button").forEach(function (b) { b.classList.toggle("choisi", b.dataset.profil === etat.profil); });
    $("btn-son").setAttribute("aria-pressed", etat.son ? "true" : "false");
    afficherNiveaux();
  }

  /* ---------- Navigation ---------- */
  var ecranPrecedent = "ecran-accueil";
  function aller(id) {
    var actuel = document.querySelector(".ecran.actif");
    if (actuel && id === "ecran-infos") ecranPrecedent = actuel.id;
    document.querySelectorAll(".ecran").forEach(function (s) { s.classList.toggle("actif", s.id === id); });
    window.scrollTo(0, 0);
  }

  /* ---------- Sons (générés, aucun fichier) ---------- */
  var ac = null;
  function ton(freqs, duree, type, vol) {
    if (!etat.son) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      var t0 = ac.currentTime;
      freqs.forEach(function (f, i) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = type || "sine"; o.frequency.value = f;
        var d = t0 + i * duree;
        g.gain.setValueAtTime(0.0001, d);
        g.gain.exponentialRampToValueAtTime(vol || 0.12, d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, d + duree);
        o.connect(g); g.connect(ac.destination); o.start(d); o.stop(d + duree + 0.02);
      });
    } catch (e) {}
  }
  var sons = {
    notif: function () { ton([880, 1320], 0.09); if (etat.son && navigator.vibrate) navigator.vibrate(40); },
    bon: function () { ton([523, 659, 784], 0.11, "triangle", 0.14); },
    moyen: function () { ton([440, 440], 0.12, "triangle", 0.1); },
    mauvais: function () { ton([330, 220], 0.18, "sawtooth", 0.06); if (etat.son && navigator.vibrate) navigator.vibrate([60, 40, 60]); }
  };

  /* ---------- Voix : fichier audio enregistré, sinon voix du téléphone (français) ---------- */
  var audio = null;
  function arreterVoix() {
    if (audio) { try { audio.pause(); } catch (e) {} audio = null; }
    if (window.speechSynthesis) try { speechSynthesis.cancel(); } catch (e) {}
  }
  var enregistre = false;
  /* Voix enregistrée (audio/sh/n1-s1.mp3…) si elle existe, sinon lecture du texte */
  function dire(texte, fichier) {
    arreterVoix(); enregistre = false;
    if (!etat.son) return;
    if (fichier && etat.langue !== "fr" && !(partie && partie.niveau.traductionEnCours)) {
      var a = new Audio("audio/" + etat.langue + "/" + fichier + ".mp3");
      audio = a;
      enregistre = false;
      a.play().then(function () { enregistre = true; }).catch(function () { if (audio === a) { audio = null; direTTS(texte); } });
      return;
    }
    direTTS(texte);
  }
  function voixPour(code) {
    if (!window.speechSynthesis) return null;
    var vs = speechSynthesis.getVoices() || [];
    return vs.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf(code) === 0; }) || null;
  }
  function direTTS(texte) {
    if (!etat.son || !window.speechSynthesis || !texte) return;
    try {
      var u = new SpeechSynthesisUtterance(texte.replace(/[\u{1F300}-\u{1FAFF}]/gu, ""));
      var lg = (partie && partie.niveau && partie.niveau.traductionEnCours) ? "fr" : etat.langue;
      if (lg === "fr") { u.lang = "fr-FR"; var vf = voixPour("fr"); if (vf) u.voice = vf; }
      else {
        /* Aucune voix shingazidja n'existe : on prend la voix la plus proche à l'oreille.
           Swahili d'abord, puis des langues qui prononcent les voyelles comme le comorien
           (indonésien, italien, espagnol). Jamais la voix française, qui déforme le texte. */
        var v = voixPour("sw") || voixPour("id") || voixPour("it") || voixPour("es");
        if (!v) return;
        u.voice = v; u.lang = v.lang;
      }
      u.rate = 0.98;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  if (window.speechSynthesis) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () {}; } catch (e) {} }

  /* ---------- Accueil ---------- */
  function afficherNiveaux() {
    var ol = $("liste-niveaux"); ol.innerHTML = "";
    C.niveaux.forEach(function (n, i) {
      var li = el("li");
      var b = el("button", "niveau");
      b.appendChild(el("span", "num", String(i + 1)));
      var tx = el("span", "txt");
      tx.appendChild(el("strong", null, t(n.titre)));
      tx.appendChild(el("span", null, t(n.lieu)));
      if (n.traductionEnCours && etat.langue !== "fr") tx.appendChild(el("em", "trad", T("tradEnCours")));
      b.appendChild(tx);
      if (n.verrouille) {
        b.disabled = true;
        b.appendChild(el("span", "meta", T("bientot")));
      } else {
        var m = etat.meilleurs[n.id];
        b.appendChild(el("span", "meta", m != null ? m + "/" + (n.situations.length * 2) : "▶"));
        b.addEventListener("click", function () { demarrer(n); });
      }
      li.appendChild(b); ol.appendChild(li);
    });
  }

  /* ---------- Jeu (mode histoire) ---------- */
  function demarrer(niveau) {
    partie = { niveau: niveau, i: 0, score: 0, res: [] };
    $("jeu-titre").textContent = t(niveau.titre);
    $("jeu-lieu").textContent = t(niveau.lieu);
    aller("ecran-jeu");
    afficherSituation();
  }

  function afficherProgression() {
    var p = $("jeu-progression"); p.innerHTML = "";
    partie.niveau.situations.forEach(function (_, k) {
      var i = el("i");
      if (partie.res[k] != null) i.className = ["mauvais", "moyen", "bon"][partie.res[k]];
      else if (k === partie.i) i.className = "encours";
      p.appendChild(i);
    });
  }

  function ajouterBulle(m) {
    var sys = m.de === "Système";
    var b = el("div", "bulle" + (m.prive ? " privee" : "") + (sys ? " systeme" : "") + (m.reaction ? " reaction" : ""));
    if (!m.prive && !sys) b.appendChild(el("b", null, m.de));
    if (m.image) b.appendChild(el("div", "image-floue", remplir(t(m.texte))));
    else b.appendChild(document.createTextNode(remplir(t(m.texte))));
    $("bulles").appendChild(b);
    return b;
  }

  function ecrit(nom) {
    var e = el("div", "ecrit", nom + " " + T("ecrit"));
    $("bulles").appendChild(e);
    return e;
  }

  function afficherSituation() {
    jeton++;
    var s = partie.niveau.situations[partie.i];
    arreterVoix();
    afficherProgression();
    $("num-situation").textContent = (partie.i + 1) + "/" + partie.niveau.situations.length;
    $("carte-retour").hidden = true;
    $("carte-question").hidden = true;
    $("scene").innerHTML = SC[s.scene] || "";
    $("narration").textContent = remplir(t(s.narration));

    var prive = s.messages.some(function (m) { return m.prive; });
    var nomConv = s.conv ? remplir(t(s.conv)) : (prive ? "Faïza" : remplir("{groupe}"));
    partie.prive = prive;
    $("conv-nom").textContent = nomConv;
    document.querySelector(".avatar-groupe").textContent = prive ? nomConv.charAt(0) : "#";
    $("conv-sous").textContent = "";
    $("bulles").innerHTML = "";

    var narr = remplir(t(s.narration));
    dire(narr, s.audio);

    var chaine = attendre(etat.son ? 1400 : 500);
    s.messages.forEach(function (m) {
      chaine = chaine.then(function () {
        var e = ecrit(m.de === "Inconnu" ? "…" : m.de);
        return attendre(700).then(function () { e.remove(); ajouterBulle(m); sons.notif(); });
      }).then(function () { return attendre(500); });
    });
    chaine.then(function () { poserQuestion(s); }).catch(function () {});
  }

  function poserQuestion(s) {
    $("question").textContent = remplir(t(s.question));
    var zc = $("choix"); zc.innerHTML = "";
    melanger(s.choix.slice()).forEach(function (c, k) {
      var b = el("button");
      b.appendChild(el("span", "lettre", "ABC"[k]));
      b.appendChild(el("span", null, remplir(t(c.texte))));
      b.addEventListener("click", function () { repondre(c, b); });
      zc.appendChild(b);
    });
    var q = $("carte-question");
    q.hidden = false;
    if (!enregistre) direTTS(remplir(t(s.question)));
    setTimeout(function () { q.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 60);
  }

  function repondre(c, bouton) {
    jeton++;
    var cls = ["mauvais", "moyen", "bon"][c.points];
    document.querySelectorAll("#choix button").forEach(function (b) {
      b.disabled = true;
      if (b !== bouton) b.classList.add("estompe");
    });
    bouton.classList.add(cls);
    partie.res[partie.i] = c.points;
    partie.score += c.points;
    afficherProgression();
    arreterVoix();

    var suite = Promise.resolve();
    if (c.reaction) {
      suite = attendre(400).then(function () {
        var sys = c.reaction.de === "Système";
        var e = sys ? null : ecrit(c.reaction.de);
        $("bulles").scrollIntoView({ behavior: "smooth", block: "end" });
        return attendre(sys ? 200 : 900).then(function () {
          if (e) e.remove();
          var b = ajouterBulle({ de: c.reaction.de, texte: c.reaction.texte, reaction: true, prive: partie.prive && c.reaction.de !== "Système" });
          sons.notif();
          b.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }).then(function () { return attendre(1100); });
    }
    suite.then(function () {
      sons[cls]();
      var r = $("carte-retour");
      r.className = "carte-retour " + cls;
      $("verdict").textContent = T(["mauvaisChoix", "moyenChoix", "bonChoix"][c.points]);
      $("retour-texte").textContent = remplir(t(c.retour));
      r.hidden = false;
      direTTS(remplir(t(c.retour)));
      setTimeout(function () { r.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 60);
    }).catch(function () {});
  }

  $("btn-continuer").addEventListener("click", function () {
    partie.i++;
    window.scrollTo(0, 0);
    if (partie.i < partie.niveau.situations.length) afficherSituation();
    else finir();
  });

  function titrePour(score) {
    var r = C.titres[0];
    C.titres.forEach(function (x) { if (score >= x.min) r = x; });
    return r;
  }

  function finir() {
    jeton++; arreterVoix();
    var n = partie.niveau, max = n.situations.length * 2;
    var ancien = etat.meilleurs[n.id];
    if (ancien == null || partie.score > ancien) etat.meilleurs[n.id] = partie.score;
    sauver();
    var ti = titrePour(partie.score);
    $("res-fin").textContent = t(ti.fin);
    $("res-score").textContent = partie.score;
    $("res-max").textContent = max;
    $("res-titre").textContent = t(ti.nom);
    $("res-texte").textContent = t(ti.texte);
    $("res-meilleur").textContent = etat.meilleurs[n.id] + "/" + max;
    partie.titre = t(ti.nom);
    aller("ecran-resultat");
    sons[partie.score >= 9 ? "bon" : partie.score >= 5 ? "moyen" : "mauvais"]();
    direTTS(t(ti.fin));
  }

  function melanger(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }

  /* ---------- Bouton son ---------- */
  $("btn-son").addEventListener("click", function () {
    etat.son = !etat.son; sauver();
    $("btn-son").setAttribute("aria-pressed", etat.son ? "true" : "false");
    if (!etat.son) arreterVoix(); else sons.notif();
  });

  /* ---------- Partage WhatsApp ---------- */
  function urlJeu() { return location.origin + location.pathname.replace(/index\.html$/, ""); }
  $("btn-defier").addEventListener("click", function () {
    var n = partie.niveau;
    var msg = T("partageTexte")
      .replace("{score}", partie.score)
      .replace("{max}", n.situations.length * 2)
      .replace("{niveau}", t(n.titre))
      .replace("{titre}", partie.titre) + " " + urlJeu();
    window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
  });

  /* ---------- Infos clés ---------- */
  function afficherInfos() {
    var ol = $("liste-gestes"); ol.innerHTML = "";
    C.infos.gestes.forEach(function (g) {
      var li = el("li");
      li.appendChild(el("strong", null, t(g.titre)));
      li.appendChild(el("p", null, t(g.texte)));
      ol.appendChild(li);
    });
    var zc = $("liste-contacts"); zc.innerHTML = "";
    C.infos.contacts.forEach(function (c) {
      var d = el("div", "contact");
      d.appendChild(el("strong", null, t(c.nom)));
      if (t(c.public)) d.appendChild(el("p", "public", T("pour") + " : " + t(c.public)));
      if (t(c.detail)) d.appendChild(el("p", null, t(c.detail)));
      if (c.telephone) { var a = el("a", "tel", c.telephone); a.href = "tel:" + c.telephone.replace(/\s/g, ""); d.appendChild(a); }
      if (c.url) { var f = el("a", "tel", T("pageFacebook")); f.href = c.url; f.target = "_blank"; f.rel = "noopener"; d.appendChild(f); }
      if (c.source) d.appendChild(el("p", "src", "Source : " + c.source));
      zc.appendChild(d);
    });
  }
  function ouvrirInfos() { jeton++; arreterVoix(); afficherInfos(); aller("ecran-infos"); }
  $("btn-infos-accueil").addEventListener("click", ouvrirInfos);
  $("btn-infos-resultat").addEventListener("click", ouvrirInfos);
  $("btn-infos-retour").addEventListener("click", function () { aller(ecranPrecedent); });

  /* ---------- Boutons ---------- */
  $("btn-quitter").addEventListener("click", function () { jeton++; arreterVoix(); afficherNiveaux(); aller("ecran-accueil"); });
  $("btn-rejouer").addEventListener("click", function () { demarrer(partie.niveau); });
  $("btn-accueil").addEventListener("click", function () { afficherNiveaux(); aller("ecran-accueil"); });
  document.querySelectorAll("#choix-langue button").forEach(function (b) {
    b.addEventListener("click", function () { etat.langue = b.dataset.langue; sauver(); traduireInterface(); });
  });
  document.querySelectorAll("#choix-profil button").forEach(function (b) {
    b.addEventListener("click", function () { etat.profil = b.dataset.profil; sauver(); traduireInterface(); });
  });

  /* ---------- Installation (PWA) ---------- */
  var invite = null;
  var estInstalle = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); invite = e;
    if (!estInstalle) $("btn-installer").hidden = false;
  });
  $("btn-installer").addEventListener("click", function () {
    if (!invite) return;
    invite.prompt();
    invite.userChoice.finally(function () { invite = null; $("btn-installer").hidden = true; });
  });
  window.addEventListener("appinstalled", function () { $("btn-installer").hidden = true; });
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (ios && !estInstalle) $("note-ios").hidden = false;

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }

  traduireInterface();
})();
