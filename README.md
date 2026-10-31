# Mlezi

**« Celui qui éduque et veille »** — un jeu sur téléphone pour apprendre aux jeunes Comoriens à protéger au lieu de partager.

Projet de l'équipe **Mes Dames** pour le hackathon **Cyber Sentinelles 2026** (OCOI · IndabaX × CyberFest × FCOI Madagascar).

**Jouer :** https://numerielles-a11y.github.io/mlezi/
**Pitch animé :** https://numerielles-a11y.github.io/mlezi/pitch.html

## Le jeu

- Le joueur est **le témoin** d'un cyberharcèlement et choisit sa réaction. Chaque choix change la suite de l'histoire.
- **3 niveaux, 15 situations** : *La photo du groupe* (lycée, Moroni), *Le grand mariage* (village), *Le compte piraté* (TikTok et WhatsApp).
- **Niveau 1 en shingazidja**, avec la narration enregistrée par l'équipe. Niveaux 2 et 3 en français, traduction en shingazidja en cours.
- **Infos clés** disponibles hors ligne : 6 bons réflexes et 4 contacts d'aide sourcés.
- Partage du résultat et défi entre amis sur WhatsApp.

## Principes

- Aucune donnée collectée, aucun compte, aucun classement public.
- Histoires, personnages et images entièrement fictifs.
- Fonctionne hors ligne après la première ouverture ; installable sur Android et iPhone.

## Installer

- **Android (Chrome)** : ouvrir le lien, puis toucher **« Installer Mlezi »**.
- **iPhone (Safari)** : ouvrir le lien, puis **Partager → Sur l'écran d'accueil**.

## Documents

- [Fiche projet](docs/Fiche_projet_Mlezi.pdf)
- [Support de pitch](docs/Pitch_Mlezi.pdf)
- [Fiche d'auto-évaluation](docs/Auto-evaluation_Mlezi.pdf)

## Structure

| Fichier | Rôle |
|---|---|
| `index.html`, `style.css`, `app.js` | Le jeu |
| `contenu.js` | Tous les textes (français et shingazidja), les contacts d'aide |
| `scenes.js` | Les illustrations des situations |
| `audio/sh/` | Les narrations enregistrées en shingazidja |
| `sw.js`, `manifest.json`, `icons/` | Installation et fonctionnement hors ligne |
