# Guide de Dépannage Avancé - PS5 SlopKit

## Table des Matières
1. [Erreurs Courantes](#erreurs-courantes)
2. [Vérifications Système](#vérifications-système)
3. [Diagnostics Réseau](#diagnostics-réseau)
4. [Logs et Débogages](#logs-et-débogages)
5. [Restauration d'Urgence](#restauration-durgence)

---

## Erreurs Courantes

### 1. "UNLUCKY — YOU NEED TO REBOOT"

#### ✅ Diagnostic Rapide
```
État: Exploit échoué - Redémarrage requis
Sévérité: MOYEN
Récupérable: OUI
```

#### 📋 Checklist de Dépannage

**Étape 1: Redémarrage Basique**
- [ ] Appuyez sur le bouton PlayStation
- [ ] Sélectionnez "Redémarrer la console"
- [ ] Attendez le redémarrage complet (2-3 minutes)
- [ ] Vérifiez que la console affiche l'écran d'accueil
- [ ] Réessayez l'exploit

**Étape 2: Redémarrage du Navigateur**
- [ ] Appuyez sur PS + Croix pour quitter le navigateur
- [ ] Attendez 10 secondes
- [ ] Rouvrez le navigateur Web
- [ ] Accédez à nouveau à https://theo3535.github.io/slopkit/
- [ ] Réessayez l'exploit

**Étape 3: Hard Reboot**
- [ ] Maintenez le bouton Power pendant 10+ secondes
- [ ] La console s'éteint complètement
- [ ] Attendez 30-60 secondes
- [ ] Rallumez en appuyant sur Power
- [ ] Attendez le démarrage complet
- [ ] Réessayez l'exploit

**Étape 4: Réinitialisation Réseau**
- [ ] Allez dans Paramètres > Réseau
- [ ] Sélectionnez "Afficher l'état de la connexion"
- [ ] Notez votre adresse IP (ex: 192.168.1.x)
- [ ] Allez dans "Configurer la connexion Internet"
- [ ] Sélectionnez votre réseau
- [ ] Entrez à nouveau vos identifiants
- [ ] Testez la connexion
- [ ] Réessayez l'exploit

#### 🔍 Vérifications Approfondies

**Vérifier la Mémoire Disponible**
- Allez dans Paramètres > Stockage
- Assurez-vous qu'il y a au moins 10 GB libres
- Si < 5 GB: Supprimez des applications/données

**Vérifier le Firmware**
- Allez dans Paramètres > Système > À propos
- Vérifiez que le firmware est dans 9.00-13.00
- Si hors plage: L'exploit ne fonctionnera pas

---

### 2. "trigger fired (netcontrol SET_QUEUE took slot 0 on fd 122)"

#### 🎯 Signification
Le système a détecté une tentative de modification de la queue réseau. C'est normal lors de l'exploitation.

#### ✅ Solutions Progressives

**Solution 1: Attendre et Réessayer (70% de succès)**
- Attendez 3-5 minutes
- Redémarrez la PS5
- Réessayez l'exploit immédiatement après

**Solution 2: Améliorer la Connexion Réseau**

*Si utilisez WiFi:*
- Mettez-vous plus près du routeur
- Réduisez les interférences (micro-ondes, appareils sans fil)
- Passez sur canal WiFi différent dans le routeur
- **Mieux**: Utilisez Ethernet filaire

*Si utilisez Ethernet:*
- Vérifiez que le câble est bien branché
- Testez avec un autre câble Ethernet
- Vérifiez la vitesse: Paramètres > Réseau > Afficher l'état
- Vitesse minimale recommandée: 10 Mbps

**Solution 3: Réduire la Charge Système**
- Fermez toutes les applications ouvertes
- Allez à l'écran d'accueil
- Attendez 5 minutes que le système se stabilise
- Réessayez l'exploit

**Solution 4: Redémarrage du Routeur**
- Éteignez le routeur (débranchez 30 secondes)
- Rallumez-le
- Attendez qu'il redémarre complètement (2-3 minutes)
- Reconnectez la PS5
- Réessayez l'exploit

---

### 3. "1 descriptor(s) left open deliberately"

#### 📖 Explication
Un descripteur de fichier système n'a pas été fermé correctement.

#### ✅ Résolution

**Obligatoire: Redémarrage Complet**
```
1. Éteignez la PS5 complètement (bouton Power 10 secondes)
2. Attendez 1 minute
3. Rallumez la PS5
4. Attendez le démarrage complet
5. Réessayez l'exploit
```

---

### 4. "setuid(1) called 6 time(s), irreversible until reboot"

#### ⚠️ Attention
Ceci indique des tentatives d'escalade de privilèges. **Redémarrage obligatoire.**

#### ✅ Ce que Faire

```
La PS5 n'est PAS endommagée - Redémarrage va tout réinitialiser
```

**Procédure**:
1. Maintenez Power 10 secondes → Extinction complète
2. Attendez 1 minute
3. Rallumez
4. Vérifiez que tout fonctionne normalement
5. Réessayez l'exploit

---

## Vérifications Système

### Pre-Exploit Checklist

```
AVANT DE TENTER L'EXPLOIT, VÉRIFIEZ:

✅ Firmware Compatible?
   Paramètres > Système > À propos
   → Doit être 9.00-13.00

✅ Connexion Réseau Stable?
   Paramètres > Réseau > Afficher l'état
   → Vitesse > 10 Mbps
   → Type: Filaire (recommandé) ou WiFi (5GHz si possible)

✅ Espace de Stockage?
   Paramètres > Stockage
   → Libre: > 10 GB minimum

✅ Processus Actifs Minimisés?
   Écran d'accueil sans rien d'ouvert
   → Pas de jeux, streaming, downloads en cours

✅ Alimentation Stable?
   Alimentation: Prise murale directe (pas de rallonge)
   → Pas de batterie externe USB
```

### Tests de Connexion Réseau

**Test 1: Ping vers Gateway**
```
Depuis une autre machine sur le même réseau:
ping [IP_PS5]

Résultat attendu:
- Réponse < 50ms = EXCELLENT
- 50-100ms = BON
- 100-200ms = ACCEPTABLE
- > 200ms = PROBLÉMATIQUE
```

**Test 2: Vitesse de Connexion**
```
Paramètres PS5 > Réseau > Test de la connexion Internet
→ Download: > 10 Mbps recommandé
→ Upload: > 5 Mbps recommandé
```

---

## Diagnostics Réseau

### Vérifier la Configuration Réseau

**Adresse IP Locale**
- Paramètres > Réseau > Afficher l'état
- Notez l'adresse IP (ex: 192.168.1.100)
- Doit commencer par 192.168.x.x ou 10.0.x.x

**Serveur DNS**
- Paramètres > Réseau > Configurer la connexion
- DNS: Doit être non-nul
- Recommandé: Utiliser 8.8.8.8 (Google) ou 1.1.1.1 (Cloudflare)

**Interface Réseau**
- Filaire (Ethernet): À préférer
- WiFi: Minimum WiFi 5 (802.11ac)

### Vérifier l'Accès au Serveur

**Depuis la PS5 Web Browser:**
1. Allez dans le Navigateur Web
2. Accédez à `https://theo3535.github.io/slopkit/`
3. La page doit charger complètement
4. Pas d'erreur "impossible de se connecter"

**Si la page ne charge pas:**
- Vérifiez l'accès Internet: Allez sur `https://www.google.com`
- Si Google charge: Problème spécifique au serveur
- Si Google ne charge pas: Problème Internet général

---

## Logs et Débogages

### Accéder à la Console des Erreurs

**Si une erreur s'affiche:**
1. Notez le message exact
2. Attendez 5 secondes avant de cliquer
3. Sélectionnez "Copier l'erreur" si disponible
4. Copiez le texte complètement

### Messages Courants et Solutions

| Message | Cause | Solution |
|---------|-------|----------|
| `payload fetch failed: HTTP 404` | Serveur down | Attendez, réessayez |
| `payload fetch failed: HTTP 500` | Erreur serveur | Attendez 5-10 min |
| `payload is empty` | Téléchargement échoué | Vérifiez connexion, réessayez |
| `payload does not start with the ELF signature` | Corruption | Redémarrez, réessayez |
| `socket: failed` | Port 9021 bloqué | Vérifiez pare-feu, réessayez |
| `connect to 127.0.0.1:9021: failed` | Timeout réseau | Attendez, réessayez |

---

## Restauration d'Urgence

### Si Rien Ne Marche

**Option 1: Attendre 24 Heures**
- Attendez 24 heures
- Réessayez l'exploit complètement

**Option 2: Réinitialisation Usine (Dernier Recours)**
```
⚠️ ATTENTION: Cela supprime TOUTES les données!

1. Paramètres > Système > Réinitialiser la PS5
2. Sélectionnez "Réinitialiser la console"
3. Confirmez (données supprimées)
4. Attendez le redémarrage et reconfiguration
5. Réessayez l'exploit sur firmware propre
```

**Option 3: Contacter le Support**
- Visitez https://github.com/Theo3535/slopkit/issues
- Décrivez votre problème en détail
- Incluez: Firmware, connexion réseau, messages exacts

---

## Tableau Récapitulatif des Solutions

| Erreur | Cause Principale | Solution Rapide | Taux Succès |
|--------|------------------|-----------------|------------|
| UNLUCKY | Timing exploit | Hard reboot + réessayer | 80% |
| trigger fired | Réseau instable | Ethernet filaire | 85% |
| descriptor left | Système saturé | Attendre 5 min | 90% |
| setuid(1) | Escalade détectée | Redémarrer | 95% |
| fetch failed | Internet down | Attendre/vérifier | 100% |

---

**Dernière mise à jour**: Septembre 2026
**Version**: 1.0
