# Chrome Web Store

Statut : 0.1.3 envoyée pour examen le 26/11/2026 (publication automatique une fois approuvée).

Chrome refuse `background.scripts`. `scripts/build.ps1` produit `dist/chromium/` et `dist/patreon-live-chat-<version>-chromium.zip` avec `background.service_worker`, sans le bloc propre à Firefox.

ID de l’élément : `ijjiookceiimcgohpfconacccgkcfada`. Éditeur : kramelCase, compte non professionnel.

- [x] Copie du projet avec `service_worker` à la place de `scripts`
- [x] Le paquet se charge et le service worker démarre (Edge, profil de test)
- [x] Essayer les fonctions sur un vrai live dans Chrome (charger `dist/chromium` en mode développeur)
- [x] Compte Chrome Web Store (frais d’inscription, e-mail de contact validé)
- [x] Page de politique de confidentialité (`PRIVACY.md`)
- [x] Captures : `screenshot-1280x800.jpg` et vignette `promo-440x280.jpg` (rendues depuis `screenshot.html` et `promo.html`, pseudos fictifs)
- [ ] Vérifier que l’icône passe la revue (symbole Patreon)
- [x] Zip de cette variante
- [x] Soumission
- [ ] Revue acceptée
- [ ] En ligne
