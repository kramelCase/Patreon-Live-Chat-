# Chrome Web Store

Statut : pas soumis.

Chrome refuse `background.scripts`. `scripts/build.ps1` produit `dist/chromium/` et `dist/patreon-live-chat-<version>-chromium.zip` avec `background.service_worker`, sans le bloc propre à Firefox.

- [x] Copie du projet avec `service_worker` à la place de `scripts`
- [x] Le paquet se charge et le service worker démarre (Edge, profil de test)
- [x] Essayer les fonctions sur un vrai live dans Chrome (charger `dist/chromium` en mode développeur)
- [ ] Compte Chrome Web Store (frais d’inscription)
- [x] Page de politique de confidentialité (`PRIVACY.md`)
- [ ] Captures (au moins une, faites sur `mock/chat.html` pour ne montrer aucun vrai pseudo)
- [ ] Vérifier que l’icône passe la revue (symbole Patreon)
- [x] Zip de cette variante
- [ ] Soumission
- [ ] Revue acceptée
- [ ] En ligne
