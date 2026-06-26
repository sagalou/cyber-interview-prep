import { useState, useEffect, useRef, useMemo } from "react";
import {
  Shield, Network, KeyRound, Bug, AlertTriangle, Terminal, Wrench,
  MessageSquare, Code2, Timer, ArrowLeft, ChevronRight, ChevronLeft,
  Check, X, Trophy, RotateCcw, Lightbulb, Lock, Flame
} from "lucide-react";

/* ─── PALETTE & FONTS ──────────────────────────────────────────────────── */
const C = {
  bg: "#0d1117",
  surface: "#161b22",
  border: "#21262d",
  muted: "#8b949e",
  text: "#e6edf3",
  amber: "#f0a500",
  teal: "#2dd4bf",
  violet: "#a78bfa",
  red: "#f85149",
  green: "#3fb950",
};

const font = `'Space Grotesk', 'IBM Plex Mono', system-ui, sans-serif`;
const mono = `'IBM Plex Mono', 'Fira Code', monospace`;

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const MODULES = [
  {
    id: "fondamentaux",
    label: "Fondamentaux",
    icon: Shield,
    color: C.amber,
    flashcards: [
      { q: "Qu'est-ce que la triade CIA ?", a: "Confidentialité, Intégrité, Disponibilité (Availability). C'est le socle de tout système de sécurité — chaque contrôle doit protéger au moins l'un de ces trois piliers.", why: "Toujours posée en ouverture d'entretien pour tester les bases." },
      { q: "Différence entre authentification et autorisation ?", a: "L'authentification vérifie QUI tu es (identité). L'autorisation vérifie CE QUE tu as le droit de faire (permissions). Auth ≠ Authz.", why: "Erreur classique à ne pas faire devant un recruteur tech." },
      { q: "C'est quoi le principe du moindre privilège ?", a: "Donner à chaque utilisateur/processus uniquement les droits strictement nécessaires à sa tâche, rien de plus. Limite la surface d'attaque en cas de compromission.", why: "Fondamental en IAM, SOC, et architecture sécurité." },
      { q: "Qu'est-ce que le Zero Trust ?", a: "Modèle : 'Ne jamais faire confiance, toujours vérifier'. Aucun utilisateur ou appareil n'est de confiance par défaut, même à l'intérieur du réseau. Chaque accès est authentifié et vérifié.", why: "Très demandé depuis la montée du télétravail et des clouds." },
      { q: "Qu'est-ce que le RGPD ?", a: "Règlement Général sur la Protection des Données (UE, 2018). Encadre la collecte, le traitement et la conservation des données personnelles. DPO, consentement, droit à l'effacement, breach notification sous 72h.", why: "Incontournable en France — les recruteurs vérifient que tu connais le cadre légal." },
      { q: "Rôle de l'ANSSI ?", a: "Agence Nationale de la Sécurité des Systèmes d'Information. Autorité nationale cyber en France : certifications, recommandations (PAMS, guides), gestion des crises nationales, coordination avec les OIV/OSE.", why: "Référence française clé — à connaître pour tout poste en France." },
    ],
    quiz: [
      { q: "Lequel N'appartient PAS à la triade CIA ?", opts: ["Confidentialité", "Intégrité", "Authentification", "Disponibilité"], ans: 2, exp: "La triade CIA = Confidentialité, Intégrité, Disponibilité. L'authentification est un contrôle de sécurité, pas un pilier de la triade." },
      { q: "Le Zero Trust suppose que…", opts: ["Le réseau interne est sûr", "Rien n'est fiable par défaut", "Les VPN remplacent tout", "Les firewalls suffisent"], ans: 1, exp: "Zero Trust : on ne fait confiance à rien ni personne par défaut. Chaque accès est vérifié, même depuis le réseau interne." },
      { q: "Le principe du moindre privilège signifie…", opts: ["Donner tous les droits admin", "Restreindre les droits au strict nécessaire", "Utiliser un seul compte partagé", "Désactiver les logs"], ans: 1, exp: "Least privilege = droits minimaux requis pour la tâche. Réduit la surface d'attaque en cas de compromission." },
      { q: "Sous combien d'heures notifier une violation de données (RGPD) ?", opts: ["24h", "48h", "72h", "1 semaine"], ans: 2, exp: "Art. 33 RGPD : notification à la CNIL dans les 72h suivant la découverte d'une violation de données personnelles." },
      { q: "L'authentification vérifie…", opts: ["Ce que tu peux faire", "Qui tu es", "Tes logs", "Ton réseau"], ans: 1, exp: "Authentification = vérifier l'identité. Autorisation = vérifier les permissions. Auth ≠ Authz." },
      { q: "L'ANSSI est…", opts: ["Une entreprise privée", "Un organisme européen", "L'autorité nationale cyber française", "Un éditeur antivirus"], ans: 2, exp: "L'ANSSI est l'autorité nationale française de cybersécurité, sous tutelle du Premier ministre." },
    ],
  },
  {
    id: "reseaux",
    label: "Réseaux",
    icon: Network,
    color: C.teal,
    flashcards: [
      { q: "Les 7 couches du modèle OSI ?", a: "1-Physique, 2-Liaison, 3-Réseau, 4-Transport, 5-Session, 6-Présentation, 7-Application. Mémo : 'Physique Liaison Réseau Transport Session Présent Application'.", why: "Modèle de référence cité dans 90% des entretiens réseau/sécurité." },
      { q: "TCP vs UDP : quelle différence ?", a: "TCP : connexion orientée (handshake 3-way), fiable, ordonné. UDP : sans connexion, rapide mais sans garantie. TCP pour HTTP/SSH, UDP pour DNS/streaming.", why: "Question quasi-systématique pour un junior — il faut pouvoir l'expliquer vite." },
      { q: "Qu'est-ce que le DNS ?", a: "Domain Name System : traduit les noms de domaine (google.com) en adresses IP. Vulnérabilités : DNS poisoning, DNS hijacking, exfiltration DNS.", why: "Cible d'attaque courante — les recruteurs SOC attendent que tu connaisses les attaques associées." },
      { q: "Rôle d'un firewall ?", a: "Filtre le trafic réseau selon des règles (IP, port, protocole). Stateful = suit l'état des connexions. Statefull > stateless en sécurité. WAF = firewall applicatif (couche 7).", why: "Composant de base de toute infrastructure — attendu en entretien junior." },
      { q: "C'est quoi un VPN ?", a: "Virtual Private Network : crée un tunnel chiffré entre le client et le serveur. Protocols : OpenVPN, WireGuard, IPSec. Pas une solution magique — ne remplace pas Zero Trust.", why: "Souvent survendu — les recruteurs testent si tu connais ses limites." },
      { q: "Qu'est-ce que le protocole TLS ?", a: "Transport Layer Security : chiffre les communications réseau (HTTPS, SMTPS…). Succède à SSL (deprecated). TLS 1.3 = version actuelle recommandée. Handshake pour négocier clés et algorithmes.", why: "Fondamental pour comprendre HTTPS et la sécurité des APIs." },
    ],
    quiz: [
      { q: "À quelle couche OSI opère TCP ?", opts: ["Couche 2", "Couche 3", "Couche 4", "Couche 7"], ans: 2, exp: "TCP/UDP opèrent en couche 4 (Transport). IP est en couche 3 (Réseau). HTTP est en couche 7 (Application)." },
      { q: "UDP est préféré à TCP pour…", opts: ["Les transactions bancaires", "Le streaming vidéo en direct", "Les emails", "Le téléchargement de fichiers"], ans: 1, exp: "UDP est choisi quand la vitesse prime sur la fiabilité : streaming, gaming, DNS. La perte de quelques paquets est acceptable." },
      { q: "Le DNS poisoning consiste à…", opts: ["Chiffrer les requêtes DNS", "Injecter de fausses réponses DNS", "Bloquer toutes les requêtes DNS", "Accélérer la résolution DNS"], ans: 1, exp: "DNS poisoning = corrompre le cache DNS pour rediriger les victimes vers de faux serveurs (phishing, MITM)." },
      { q: "Un WAF opère à quelle couche ?", opts: ["Couche 3", "Couche 4", "Couche 7", "Couche 1"], ans: 2, exp: "WAF = Web Application Firewall, couche 7 (Application). Il analyse le contenu HTTP/HTTPS, contrairement aux firewalls réseau classiques." },
      { q: "TLS 1.0 et 1.1 sont…", opts: ["Recommandés", "Deprecated / à éviter", "Équivalents à TLS 1.3", "Utilisés pour SSH"], ans: 1, exp: "TLS 1.0 et 1.1 sont deprecated (nombreuses vulnérabilités). TLS 1.2 minimum, TLS 1.3 recommandé." },
      { q: "Le handshake TCP à 3 étapes : SYN →", opts: ["ACK → FIN", "SYN-ACK → ACK", "SYN → FIN", "ACK → SYN"], ans: 1, exp: "SYN → SYN-ACK → ACK. Les SYN flood exploitent ce mécanisme en envoyant des milliers de SYN sans jamais compléter le handshake." },
    ],
  },
  {
    id: "crypto",
    label: "Cryptographie",
    icon: KeyRound,
    color: C.violet,
    flashcards: [
      { q: "Chiffrement symétrique vs asymétrique ?", a: "Symétrique : même clé pour chiffrer/déchiffrer (AES, rapide). Asymétrique : paire clé publique/privée (RSA, lent). En pratique : on chiffre la clé symétrique avec asymétrique (hybrid).", why: "Question fondamentale — mal répondre ici ferme des portes." },
      { q: "C'est quoi une fonction de hachage ?", a: "Transforme une entrée en empreinte de taille fixe (hash). Propriétés : déterministe, irréversible, résistante aux collisions. SHA-256, SHA-3. MD5/SHA-1 = cassés, à ne plus utiliser.", why: "Utilisé partout : mots de passe, intégrité, signatures. Essentiel." },
      { q: "Différence entre hash et chiffrement ?", a: "Hash = sens unique, impossible à inverser. Chiffrement = réversible avec la bonne clé. On hache les mots de passe (+ salt), on ne les chiffre pas.", why: "Erreur de débutant fréquente — les recruteurs la testent exprès." },
      { q: "C'est quoi un salt dans le hachage ?", a: "Valeur aléatoire unique ajoutée au mot de passe AVANT le hash. Empêche les rainbow tables et les attaques par dictionnaire. Bcrypt et Argon2 intègrent le salt automatiquement.", why: "Indispensable si on te parle de stockage de mots de passe." },
      { q: "Comment fonctionne TLS (handshake) ?", a: "1. Client Hello (versions, ciphers) → 2. Server Hello + certificat → 3. Échange de clés (ECDHE) → 4. Clé de session symétrique générée → 5. Communications chiffrées AES.", why: "Comprendre TLS = comprendre HTTPS. Question technique courante." },
      { q: "C'est quoi une PKI ?", a: "Public Key Infrastructure : système de gestion des certificats numériques. Composants : CA (autorité), certificats X.509, CRL/OCSP (révocation). Garantit l'authenticité des clés publiques.", why: "Clé pour comprendre HTTPS, VPN, signatures numériques." },
    ],
    quiz: [
      { q: "AES est un algorithme de chiffrement…", opts: ["Asymétrique", "Symétrique", "De hachage", "De signature"], ans: 1, exp: "AES (Advanced Encryption Standard) est symétrique : même clé pour chiffrer et déchiffrer. Rapide, utilisé dans TLS, WiFi (WPA2/3), disques chiffrés." },
      { q: "Pourquoi MD5 ne doit plus être utilisé pour les mots de passe ?", opts: ["Trop lent", "Trop rapide et cassé — collisions connues", "Ne fonctionne pas sur Linux", "Produit des hash trop longs"], ans: 1, exp: "MD5 est cryptographiquement cassé (collisions en quelques secondes). Pour les mots de passe : bcrypt, scrypt, ou Argon2 obligatoires." },
      { q: "Un salt sert à…", opts: ["Accélérer le hachage", "Rendre unique chaque hash même pour mots de passe identiques", "Chiffrer le mot de passe", "Compresser la base de données"], ans: 1, exp: "Le salt rend unique chaque hash. Même si deux utilisateurs ont le même mot de passe, leurs hash seront différents. Contre les rainbow tables." },
      { q: "Dans le chiffrement hybride, la clé symétrique est…", opts: ["Transmise en clair", "Chiffrée avec la clé publique", "Hachée avec SHA-256", "Inutilisée"], ans: 1, exp: "Chiffrement hybride : on chiffre les données avec AES (rapide), et on chiffre la clé AES avec RSA/ECDH (sûr). C'est ce que fait TLS." },
      { q: "RSA est…", opts: ["Un algorithme symétrique", "Un algorithme de hachage", "Un algorithme asymétrique", "Un protocole réseau"], ans: 2, exp: "RSA est asymétrique : clé publique pour chiffrer/vérifier, clé privée pour déchiffrer/signer. Lent — utilisé pour l'échange de clés, pas le chiffrement de données en masse." },
      { q: "OCSP sert à…", opts: ["Chiffrer les certificats", "Vérifier si un certificat est révoqué", "Générer des clés publiques", "Hacher les signatures"], ans: 1, exp: "OCSP (Online Certificate Status Protocol) permet de vérifier en temps réel si un certificat SSL/TLS est toujours valide ou révoqué." },
    ],
  },
  {
    id: "web",
    label: "Attaques Web",
    icon: Bug,
    color: C.red,
    flashcards: [
      { q: "C'est quoi une injection SQL ?", a: "Injection de code SQL malveillant dans une entrée utilisateur pour manipuler la base de données. Ex: ' OR '1'='1. Prévention : requêtes préparées (prepared statements), ORM, validation des entrées.", why: "OWASP #1 historiquement — question incontournable." },
      { q: "C'est quoi le XSS ?", a: "Cross-Site Scripting : injection de scripts malveillants dans des pages web. Stored (persistant), Reflected (URL), DOM-based. Vol de cookies, redirection, keylogging. Prévention : échapper les sorties, CSP.", why: "Très fréquent en pentest web — attendu en entretien." },
      { q: "C'est quoi le CSRF ?", a: "Cross-Site Request Forgery : force un utilisateur authentifié à effectuer une action non voulue. Ex: clic sur lien = virement bancaire. Prévention : tokens CSRF, SameSite cookies, vérification Referer.", why: "Différence XSS/CSRF souvent demandée en entretien." },
      { q: "C'est quoi le SSRF ?", a: "Server-Side Request Forgery : force le serveur à faire des requêtes vers des ressources internes. Peut exposer AWS metadata (169.254.169.254), services internes. Prévention : whitelist d'URLs, pas de redirections.", why: "Vulnérabilité cloud critique — très tendance en pentest." },
      { q: "Qu'est-ce que l'OWASP Top 10 ?", a: "Liste des 10 risques web les plus critiques publiée par l'OWASP. 2021 : Broken Access Control, Crypto Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Auth Failures, SSRF, Logging Failures, Integrity Failures.", why: "Référence absolue — sache citer les 3-4 premiers sans hésiter." },
      { q: "Différence entre XSS et CSRF ?", a: "XSS : injecte du code qui s'exécute dans le navigateur de la victime (côté client). CSRF : exploite la session authentifiée de la victime pour faire des actions en son nom (côté serveur). XSS peut faciliter le CSRF.", why: "Question piège classique pour tester la précision de ta compréhension." },
    ],
    quiz: [
      { q: "Comment prévenir les injections SQL ?", opts: ["Limiter la longueur des inputs", "Utiliser des requêtes préparées", "Chiffrer la base de données", "Utiliser HTTPS"], ans: 1, exp: "Les requêtes préparées (prepared statements) séparent le code SQL des données. L'input utilisateur ne peut jamais modifier la structure de la requête." },
      { q: "Le XSS stored (persistant) est dangereux car…", opts: ["Il disparaît après 1 heure", "Le payload est stocké et exécuté pour chaque visiteur", "Il nécessite une connexion admin", "Il ne fonctionne qu'en HTTP"], ans: 1, exp: "XSS stored : le script malveillant est enregistré en base de données. Chaque utilisateur qui charge la page exécute le script — impact massif." },
      { q: "Un token CSRF sert à…", opts: ["Chiffrer les formulaires", "Vérifier que la requête vient bien de l'utilisateur légitime", "Accélérer les requêtes", "Logger les actions"], ans: 1, exp: "Le token CSRF est unique par session et inclus dans les formulaires. Si la requête ne contient pas le token valide, le serveur la rejette." },
      { q: "SSRF peut permettre d'accéder à…", opts: ["La base de données des users", "Les métadonnées AWS (169.254.169.254)", "Les cookies du navigateur", "Le code source JS"], ans: 1, exp: "SSRF classique : forcer le serveur à appeler l'API metadata d'AWS. Peut exposer les credentials IAM de l'instance EC2." },
      { q: "Le #1 de l'OWASP Top 10 2021 est…", opts: ["Injection", "XSS", "Broken Access Control", "Crypto Failures"], ans: 2, exp: "OWASP 2021 : #1 = Broken Access Control (monté de #5 en 2017). Les injections sont passées en #3." },
      { q: "Content Security Policy (CSP) protège contre…", opts: ["CSRF", "SQLi", "XSS", "SSRF"], ans: 2, exp: "CSP est un header HTTP qui contrôle les sources autorisées pour les scripts, styles, images. Mitigation efficace contre XSS en bloquant les scripts inline non autorisés." },
    ],
  },
  {
    id: "attaques",
    label: "Attaques Systèmes",
    icon: AlertTriangle,
    color: "#f97316",
    flashcards: [
      { q: "C'est quoi une attaque MITM ?", a: "Man-In-The-Middle : l'attaquant s'interpose dans une communication entre deux parties sans qu'elles le sachent. Techniques : ARP spoofing, SSL stripping. Prévention : HTTPS, HSTS, certificats.", why: "Attaque de réseau classique — attendue en entretien SOC/réseau." },
      { q: "C'est quoi un DDoS ?", a: "Distributed Denial of Service : saturer un service avec un volume massif de requêtes (botnet). Types : volumétrique (UDP flood), applicatif (HTTP flood), protocolaire (SYN flood). Mitigation : CDN, rate limiting, scrubbing centers.", why: "Menace majeure pour les entreprises — recruteurs testent ta compréhension des mécanismes." },
      { q: "C'est quoi le phishing ?", a: "Ingénierie sociale par email (ou SMS = smishing, voix = vishing) pour voler credentials ou installer un malware. Spear phishing = ciblé sur une personne. Whaling = ciblé sur cadres dirigeants.", why: "Vecteur #1 d'intrusion — SOC analyst doit bien le connaître." },
      { q: "C'est quoi un ransomware ?", a: "Malware qui chiffre les fichiers de la victime et réclame une rançon pour la clé de déchiffrement. Propagation : phishing, RDP exposé, vuln exploitée. Double extorsion : chiffrement + exfiltration.", why: "Menace critique pour les entreprises — très présente dans les entretiens CTI/SOC." },
      { q: "C'est quoi l'escalade de privilèges ?", a: "Technique pour obtenir des permissions supérieures à celles initialement accordées. Horizontale : autre compte même niveau. Verticale : accès root/admin. Techniques : SUID, sudo mal configuré, CVE kernel.", why: "Fondamental en pentest et CTF — attendu si tu mentionnes des labs Hack The Box." },
      { q: "C'est quoi un APT ?", a: "Advanced Persistent Threat : acteur sophistiqué (souvent étatique) qui s'infiltre discrètement sur le long terme. TTPs : spear phishing → foothold → lateral movement → C2 → exfiltration. Ex: APT28 (Russie), APT41 (Chine).", why: "Clé pour la CTI — montre que tu comprends les menaces avancées." },
    ],
    quiz: [
      { q: "L'ARP spoofing est utilisé pour…", opts: ["Voler des cookies", "Réaliser une attaque MITM sur un LAN", "Injecter du SQL", "Faire du DDoS"], ans: 1, exp: "ARP spoofing : l'attaquant répond aux requêtes ARP avec sa propre adresse MAC pour intercepter le trafic réseau local. Prérequis pour MITM sur LAN." },
      { q: "Un SYN flood exploite…", opts: ["Le chiffrement TLS", "Le mécanisme de handshake TCP", "Le DNS", "Le protocole HTTP"], ans: 1, exp: "SYN flood : l'attaquant envoie des milliers de SYN sans jamais compléter le handshake. Le serveur épuise ses ressources à attendre les ACK." },
      { q: "Le spear phishing se distingue par…", opts: ["Son volume élevé", "Son ciblage précis d'une victime spécifique", "L'utilisation de SMS", "L'absence de lien malveillant"], ans: 1, exp: "Spear phishing = hautement ciblé et personnalisé (nom, contexte, entreprise de la victime). Beaucoup plus efficace que le phishing en masse." },
      { q: "La double extorsion dans les ransomwares consiste à…", opts: ["Chiffrer deux fois les fichiers", "Chiffrer ET exfiltrer les données pour menacer de les publier", "Attaquer deux entreprises simultanément", "Demander deux rançons successives"], ans: 1, exp: "Double extorsion : en plus de chiffrer, les attaquants exfiltrent les données. Si la victime ne paie pas, les données sont publiées. Cible aussi les backups." },
      { q: "L'escalade de privilèges verticale, c'est…", opts: ["Passer d'un compte user à un autre", "Obtenir des droits admin/root depuis un compte standard", "Changer de service dans l'entreprise", "Voler les credentials d'un admin"], ans: 1, exp: "Verticale = monter en droits (user → root). Horizontale = pivoter vers d'autres comptes du même niveau. Les deux sont utilisées en post-exploitation." },
      { q: "APT signifie…", opts: ["Advanced Phishing Technique", "Advanced Persistent Threat", "Automated Penetration Testing", "Application Protocol Transfer"], ans: 1, exp: "APT = Advanced Persistent Threat. Acteurs étatiques ou très bien organisés qui restent discrets longtemps (mois, années) dans les systèmes cibles." },
    ],
  },
  {
    id: "linux",
    label: "Linux & Sys",
    icon: Terminal,
    color: C.green,
    flashcards: [
      { q: "Comment lire les permissions Linux ?", a: "Format : rwxrwxrwx (user|group|others). r=4, w=2, x=1. Ex: chmod 755 = rwxr-xr-x. SUID (s) = s'exécute avec les droits du propriétaire — risque d'escalade.", why: "Question quasi-certaine si tu mentionnes Linux ou CTF en entretien." },
      { q: "Quels logs Linux surveiller en sécurité ?", a: "/var/log/auth.log (authent, sudo, SSH), /var/log/syslog (système), /var/log/apache2/access.log (web), /var/log/kern.log (kernel). Commandes : last, lastb, who, journalctl.", why: "Un analyste SOC doit savoir où chercher les traces d'intrusion." },
      { q: "Comment sécuriser SSH ?", a: "Désactiver root login (PermitRootLogin no), auth par clé uniquement (PasswordAuthentication no), changer le port, fail2ban, AllowUsers. Utiliser ed25519 plutôt que RSA 2048.", why: "SSH est un vecteur d'attaque majeur — recruteurs testent tes bonnes pratiques." },
      { q: "C'est quoi un cron job malveillant ?", a: "Attaquant qui ajoute une tâche cron pour maintenir sa persistance. Vérifier : crontab -l, /etc/cron*, /var/spool/cron. IOC : connexions sortantes régulières à heure fixe.", why: "Technique de persistance classique — important pour les analystes SOC/forensics." },
      { q: "Commandes essentielles pour investiguer une intrusion Linux ?", a: "ps aux (processus), netstat -tulnp / ss -tulnp (connexions réseau), lsof (fichiers ouverts), last/lastb (connexions), find / -mtime -1 (fichiers récents), strings (analyser binaires).", why: "Forensics Linux de base — attendu si tu parles d'analyse de compromission." },
      { q: "C'est quoi le sticky bit ?", a: "Permission spéciale sur répertoires : seul le propriétaire d'un fichier peut le supprimer, même si d'autres ont droit d'écriture. Ex : /tmp (chmod 1777). Prévient la suppression de fichiers d'autres utilisateurs.", why: "Souvent demandé pour tester la précision des connaissances Linux." },
    ],
    quiz: [
      { q: "chmod 644 donne…", opts: ["rwxrwxrwx", "rw-r--r--", "rwxr-xr-x", "r--------"], ans: 1, exp: "6 = rw- (user), 4 = r-- (group), 4 = r-- (others). Permissions standard pour les fichiers de configuration." },
      { q: "Le fichier /var/log/auth.log contient…", opts: ["Les logs Apache", "Les logs d'authentification et sudo", "Les logs kernel", "Les logs réseau"], ans: 1, exp: "/var/log/auth.log trace toutes les authentifications : SSH, sudo, su, PAM. Premier fichier à consulter lors d'une investigation d'intrusion." },
      { q: "Pour interdire la connexion SSH root, on définit…", opts: ["RootLogin disabled", "PermitRootLogin no", "DenyRoot yes", "BlockRoot true"], ans: 1, exp: "Dans /etc/ssh/sshd_config : PermitRootLogin no. Toujours faire cela + désactiver l'auth par mot de passe (PasswordAuthentication no)." },
      { q: "Le SUID bit est dangereux car…", opts: ["Il supprime les logs", "Il permet d'exécuter un binaire avec les droits de son propriétaire (souvent root)", "Il désactive le firewall", "Il ouvre le port 22"], ans: 1, exp: "SUID sur un binaire root = s'exécute en root même si lancé par un user. Exploitable pour l'escalade de privilèges (ex: /usr/bin/python3 avec SUID)." },
      { q: "La commande 'ss -tulnp' affiche…", opts: ["Les processus actifs", "Les ports en écoute et leurs processus", "Les dernières connexions SSH", "Les règles iptables"], ans: 1, exp: "ss -tulnp : t=TCP, u=UDP, l=listening, n=numérique, p=processus. Essentiel pour détecter des portes dérobées ou services non autorisés." },
      { q: "Le répertoire /tmp a typiquement les permissions…", opts: ["755", "644", "1777", "700"], ans: 2, exp: "1777 = sticky bit + rwx pour tout le monde. Le sticky bit empêche les utilisateurs de supprimer les fichiers des autres dans /tmp." },
    ],
  },
  {
    id: "outils",
    label: "Outils Sécu",
    icon: Wrench,
    color: "#60a5fa",
    flashcards: [
      { q: "À quoi sert Wireshark ?", a: "Analyseur de protocoles réseau (packet capture). Capture et analyse le trafic réseau en temps réel. Filtres utiles : http, tcp.port==443, ip.addr==x.x.x.x. Détection d'anomalies, credentials en clair, malware C2.", why: "Outil de base SOC/forensics réseau — sache l'expliquer et donner des cas d'usage." },
      { q: "À quoi sert Nmap ?", a: "Scanner réseau : découverte d'hôtes, scan de ports, détection de services et versions, scripts NSE. Commandes clés : nmap -sV -sC -O target. Passive recon avant pentest.", why: "Outil de reconnaissance standard — presque obligatoire à mentionner en pentest." },
      { q: "À quoi sert Burp Suite ?", a: "Proxy HTTP pour tester la sécurité des applications web. Intercept, Repeater, Intruder (fuzzing), Scanner (Pro). Indispensable pour tester XSS, SQLi, IDOR, CSRF.", why: "Standard du pentest web — si tu mentionnes HTB ou des labs web, ils vont te demander." },
      { q: "C'est quoi un SIEM ?", a: "Security Information and Event Management : collecte, corrèle et analyse les logs de tout le SI. Solutions : Splunk, Microsoft Sentinel, IBM QRadar, Elastic SIEM. Génère des alertes, facilite l'investigation.", why: "Cœur du SOC — recruteurs attendent que tu saches ce que c'est et comment ça fonctionne." },
      { q: "C'est quoi un IDS/IPS ?", a: "IDS (Intrusion Detection System) : détecte les menaces et alerte. IPS (Intrusion Prevention System) : détecte ET bloque. NIDS (réseau) vs HIDS (hôte). Ex : Snort, Suricata, Zeek.", why: "Composants de défense réseau — souvent mentionnés avec le SIEM." },
      { q: "À quoi sert Metasploit ?", a: "Framework de pentest : exploits, payloads, auxiliaires. msfconsole → search → use → set RHOSTS → exploit. Meterpreter = payload avancé (shell interactif, pivoting). Usage légal uniquement en contexte autorisé.", why: "Framework de référence en pentest — connaître les bases montre ta pratique." },
    ],
    quiz: [
      { q: "Wireshark est utilisé pour…", opts: ["Scanner les ports", "Capturer et analyser le trafic réseau", "Tester les applications web", "Générer des rapports de vulnérabilités"], ans: 1, exp: "Wireshark = packet analyzer. Il capture le trafic réseau et permet d'analyser chaque paquet. Utile pour détecter des anomalies, credentials en clair, ou du trafic malveillant." },
      { q: "La commande nmap -sV sert à…", opts: ["Scanner rapidement sans détection", "Détecter les versions des services sur les ports ouverts", "Scanner uniquement UDP", "Effectuer un ping sweep"], ans: 1, exp: "-sV = version detection. Nmap essaie de déterminer quelle version de service tourne sur chaque port ouvert (ex: OpenSSH 8.9, Apache 2.4.52)." },
      { q: "Burp Suite Intruder est utilisé pour…", opts: ["Analyser les packets réseau", "Fuzzer des paramètres HTTP avec des wordlists", "Scanner les ports", "Générer des certificats"], ans: 1, exp: "Intruder = fuzzing automatisé de paramètres HTTP. Utilisé pour tester les injections, brute force, IDOR, en variant automatiquement des valeurs selon des patterns." },
      { q: "Un SIEM fait principalement…", opts: ["Bloquer le trafic malveillant", "Collecter et corréler les logs pour détecter les menaces", "Scanner les vulnérabilités", "Chiffrer les données sensibles"], ans: 1, exp: "SIEM = collecte massive de logs + corrélation + alertes. Le SOC analyst travaille principalement dans le SIEM pour investiguer les incidents et les alertes." },
      { q: "Snort est un exemple de…", opts: ["SIEM", "IDS/IPS", "Scanner de vulnérabilités", "Proxy HTTP"], ans: 1, exp: "Snort est un NIDS/NIPS (Network Intrusion Detection/Prevention System) open source. Il analyse le trafic réseau et applique des règles pour détecter les attaques." },
      { q: "Meterpreter dans Metasploit est…", opts: ["Un type de scan", "Un payload avancé donnant un shell interactif", "Un module de reporting", "Un scanner web"], ans: 1, exp: "Meterpreter est un payload avancé qui tourne en mémoire (pas de fichier sur disque). Il offre un shell interactif riche : upload/download, pivoting, keylogging, screenshot." },
    ],
  },
  {
    id: "carriere",
    label: "Posture Entretien",
    icon: MessageSquare,
    color: "#e879f9",
    flashcards: [
      { q: "Comment présenter sa transition archéologie → cybersécurité ?", a: "Fil rouge : les deux disciplines partagent la rigueur d'investigation, l'attention aux traces/artefacts, et la reconstruction de narratifs à partir d'indices. Photogrammetrie = données 3D structurées = traitement de données structurées. Ne pas s'excuser de la reconversion, la vendre.", why: "Ton profil est atypique — il faut le transformer en force, pas en faiblesse." },
      { q: "Comment répondre à 'Parlez-moi de vous' ?", a: "Structure : 1. Qui je suis maintenant (étudiant en cybersécurité à Holberton, formation RNCP 6), 2. D'où je viens (archéologue, terrain, analyse d'artefacts), 3. Ce qui m'a amené ici (curiosité pour les systèmes, enquête, traces numériques), 4. Ce que je cherche (alternance CTI/SOC).", why: "Ouverture de presque tous les entretiens — avoir une version fluide de 2 minutes." },
      { q: "Comment parler de ses projets perso en entretien ?", a: "Toujours relier au poste visé. Sagalhaider.com → architecture de données + code. Somali Architecture → projet mené, documentation technique. Blog → veille, vulgarisation. CTF → pratique offensive/défensive.", why: "Tes projets différencient ton profil — les recruteurs adorent les candidats qui font des choses en dehors du cursus." },
      { q: "Comment répondre à 'Quelle est votre plus grande faiblesse ?'", a: "Choisir une vraie faiblesse non-rédhibitoire, montrer que tu en es conscient, et ce que tu fais pour la corriger. Ex: 'Je peux aller trop vite sur la documentation — j'ai adopté l'habitude de rédiger un résumé après chaque lab.'", why: "Ils testent ta maturité et ta capacité à apprendre, pas la perfection." },
      { q: "Questions à poser en fin d'entretien ?", a: "1. 'Comment se passe l'onboarding pour les alternants ?' 2. 'Quelles seraient mes premières missions ?' 3. 'Quelle est la maturité cyber de l'entreprise ?' 4. 'Comment l'équipe reste en veille ?' Montre intérêt et sérieux.", why: "Ne pas poser de questions = signal négatif. 2-3 questions bien choisies = professionnalisme." },
      { q: "Comment se positionner sur CTI vs SOC ?", a: "CTI (Cyber Threat Intelligence) : analyse des menaces, TTP des acteurs, OSINT, rapports de renseignement. SOC : détection/réponse en temps réel, SIEM, triage d'alertes. Les deux se complètent. CTI nourrit le SOC en contexte.", why: "Si tu cibles spécifiquement CTI, sois claire sur pourquoi : curiosité investigatrice, goût pour l'analyse, contexte géopolitique." },
    ],
    quiz: [
      { q: "En entretien, parler de sa reconversion doit…", opts: ["Être évité au maximum", "Être présenté comme un atout différenciant", "Être justifié par une critique de l'archéologie", "Être mentionné seulement si demandé"], ans: 1, exp: "Une reconversion bien racontée = profil mémorable. Insiste sur les compétences transférables : rigueur d'analyse, investigation, documentation, terrain difficile." },
      { q: "La meilleure structure pour 'Parlez-moi de vous' en 2 minutes ?", opts: ["Réciter tout son CV chronologiquement", "Passé → Présent → Futur, adapté au poste visé", "Parler uniquement de ses passions", "Commencer par ses diplômes"], ans: 1, exp: "Passé (d'où tu viens) → Présent (ce que tu fais maintenant) → Futur (ce que tu cherches). Toujours orienter vers le poste visé. 2 minutes max." },
      { q: "CTI se distingue du SOC principalement par…", opts: ["L'utilisation d'outils différents", "Son focus sur l'analyse des menaces et acteurs plutôt que la réponse en temps réel", "L'absence de logs à analyser", "Le fait de travailler seul"], ans: 1, exp: "CTI = intelligence sur les menaces (qui attaque, comment, pourquoi). SOC = détection et réponse aux incidents en temps réel. CTI contextualise le travail du SOC." },
      { q: "Poser des questions en fin d'entretien…", opts: ["Prend trop de temps", "Est un signal fort de motivation et de professionnalisme", "Est perçu comme arrogant", "N'est utile que pour les seniors"], ans: 1, exp: "Ne pas poser de questions = signal négatif (tu n'es pas curieux ou pas intéressé). 2-3 questions bien choisies montrent que tu as réfléchi au poste et à l'entreprise." },
      { q: "Holberton Cybersécurité correspond à quel niveau RNCP ?", opts: ["Niveau 5 (Bac+2)", "Niveau 6 (Bac+3/4)", "Niveau 7 (Bac+5)", "Niveau 4 (Bac)"], ans: 1, exp: "La formation Holberton Cybersécurité est certifiée RNCP niveau 6, équivalent Bac+3/4. Important à mentionner en entretien pour situer le niveau de la formation." },
      { q: "Un projet comme sagalhaider.com démontre en entretien…", opts: ["Que tu es indépendant et n'as pas besoin d'équipe", "Ta capacité à coder, documenter et mener un projet personnel", "Que la cybersécurité n'est pas ta priorité", "Uniquement tes compétences en design"], ans: 1, exp: "Les projets perso = preuve de passion et d'initiative. Ils montrent que tu codes en dehors des cours, que tu peux définir et mener un projet, et que tu as des intérêts différenciants." },
    ],
  },
];

/* ─── CODING LAB ────────────────────────────────────────────────────────── */
const CHALLENGES = [
  {
    id: "pwd",
    title: "Vérificateur de mot de passe",
    desc: "Écris une fonction Python qui évalue la force d'un mot de passe (Faible / Moyen / Fort).",
    criteria: ["Min 8 caractères", "Contient des majuscules ET minuscules", "Contient des chiffres", "Contient des caractères spéciaux (!@#$...)"],
    hints: [
      "Utilise len() pour la longueur, any() avec une compréhension pour chaque catégorie",
      "any(c.isupper() for c in pwd) — adapte ce pattern pour chaque critère",
      "Compte le nombre de critères remplis et retourne Faible/Moyen/Fort selon le score",
    ],
    solution: `import re

def check_password_strength(password):
    score = 0
    if len(password) >= 8:
        score += 1
    if any(c.isupper() for c in password):
        score += 1
    if any(c.islower() for c in password):
        score += 1
    if any(c.isdigit() for c in password):
        score += 1
    if any(c in "!@#$%^&*()_+-=[]{}|;':,./<>?" for c in password):
        score += 1

    if score <= 2:
        return "Faible"
    elif score <= 3:
        return "Moyen"
    else:
        return "Fort"

# Test
for pwd in ["abc", "Password1", "P@ssw0rd!Secure"]:
    print(f"{pwd}: {check_password_strength(pwd)}")`,
  },
  {
    id: "sqli",
    title: "Détecteur d'injection SQL",
    desc: "Écris une fonction Python qui détecte des patterns d'injection SQL dans une chaîne d'entrée.",
    criteria: ["Détecter ' OR '1'='1", "Détecter UNION SELECT", "Détecter -- (commentaire SQL)", "Être case-insensitive"],
    hints: [
      "Convertis l'entrée en minuscules pour la comparaison : input.lower()",
      "Utilise une liste de patterns suspects et vérifie si l'un d'eux est dans l'input",
      "Patterns à chercher : \"' or\", \"union select\", \"--\", \"drop table\", \"insert into\"",
    ],
    solution: `import re

def detect_sql_injection(user_input):
    patterns = [
        r"'\\s*or\\s*'?\\d",
        r"union\\s+select",
        r"--",
        r"drop\\s+table",
        r"insert\\s+into",
        r"delete\\s+from",
        r";\\s*--",
        r"1=1",
    ]
    
    input_lower = user_input.lower()
    detected = []
    
    for pattern in patterns:
        if re.search(pattern, input_lower):
            detected.append(pattern)
    
    if detected:
        return f"⚠️ Injection SQL détectée ! Patterns: {detected}"
    return "✅ Input semble sûr"

# Tests
inputs = [
    "admin' OR '1'='1",
    "utilisateur normal",
    "'; DROP TABLE users; --",
    "UNION SELECT * FROM passwords",
]
for inp in inputs:
    print(f"Input: {inp!r}")
    print(detect_sql_injection(inp))
    print()`,
  },
  {
    id: "hash",
    title: "Hachage sécurisé de mots de passe",
    desc: "Implémente le hachage et la vérification d'un mot de passe avec salt en Python.",
    criteria: ["Générer un salt aléatoire unique", "Hacher le mot de passe + salt avec SHA-256", "Stocker hash et salt séparément", "Vérifier un mot de passe contre le hash stocké"],
    hints: [
      "import hashlib, os — os.urandom(32) génère 32 bytes aléatoires pour le salt",
      "hashlib.sha256(salt + password.encode()).hexdigest() — concatène salt et password",
      "Pour vérifier, rehache le même password avec le salt stocké et compare",
    ],
    solution: `import hashlib
import os

def hash_password(password):
    """Hache un mot de passe avec un salt aléatoire."""
    salt = os.urandom(32)  # 32 bytes aléatoires
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000  # 100k itérations
    )
    return salt, key

def verify_password(stored_salt, stored_hash, provided_password):
    """Vérifie un mot de passe contre le hash stocké."""
    key = hashlib.pbkdf2_hmac(
        'sha256',
        provided_password.encode('utf-8'),
        stored_salt,
        100000
    )
    return key == stored_hash

# Simulation
password = "MonMotDePasse123!"
salt, hashed = hash_password(password)

print(f"Salt (hex): {salt.hex()[:20]}...")
print(f"Hash (hex): {hashed.hex()[:20]}...")

print("\\n--- Vérification ---")
print(f"Bon mdp: {verify_password(salt, hashed, password)}")
print(f"Mauvais mdp: {verify_password(salt, hashed, 'mauvais')}")`,
  },
  {
    id: "caesar",
    title: "Chiffre de César + Analyse fréquentielle",
    desc: "Implémente le chiffrement/déchiffrement de César et une attaque par analyse de fréquences.",
    criteria: ["Chiffrer un message avec un décalage", "Déchiffrer avec le bon décalage", "Attaque par force brute (26 possibilités)", "Identifier le bon décalage par fréquence de la lettre 'e'"],
    hints: [
      "ord() convertit un caractère en nombre, chr() l'inverse. A=65, a=97",
      "(ord(c) - 65 + shift) % 26 + 65 pour les majuscules",
      "Pour l'analyse fréquentielle, compte les lettres dans chaque décalage et cherche celui où la lettre la plus fréquente correspond à 'e' (la plus fréquente en français/anglais)",
    ],
    solution: `def caesar_encrypt(text, shift):
    result = []
    for c in text:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            result.append(chr((ord(c) - base + shift) % 26 + base))
        else:
            result.append(c)
    return ''.join(result)

def caesar_decrypt(text, shift):
    return caesar_encrypt(text, -shift)

def frequency_attack(ciphertext):
    """Attaque par analyse fréquentielle."""
    from collections import Counter
    
    letters = [c.lower() for c in ciphertext if c.isalpha()]
    freq = Counter(letters)
    most_common = freq.most_common(1)[0][0]
    
    # 'e' est la lettre la plus fréquente en français/anglais
    shift = (ord(most_common) - ord('e')) % 26
    return shift, caesar_decrypt(ciphertext, shift)

# Démonstration
original = "La cybersecurite est passionnante"
shift = 13  # ROT13

encrypted = caesar_encrypt(original, shift)
decrypted = caesar_decrypt(encrypted, shift)

print(f"Original:  {original}")
print(f"Chiffré:   {encrypted}")
print(f"Déchiffré: {decrypted}")

print("\\n--- Attaque fréquentielle ---")
guess_shift, guess_text = frequency_attack(encrypted)
print(f"Décalage deviné: {guess_shift}")
print(f"Texte deviné: {guess_text}")`,
  },
  {
    id: "port",
    title: "Scanner de ports simple",
    desc: "Écris un scanner de ports TCP basique en Python qui identifie les ports ouverts.",
    criteria: ["Scanner une plage de ports sur un hôte", "Timeout court pour éviter les blocages", "Afficher les ports ouverts avec le service connu", "Gérer les erreurs de connexion"],
    hints: [
      "import socket — socket.connect_ex((host, port)) retourne 0 si le port est ouvert",
      "Utilise socket.settimeout(0.5) pour ne pas attendre trop longtemps",
      "socket.getservbyport(port) retourne le nom du service (http, ssh, ftp...)",
    ],
    solution: `import socket

def scan_port(host, port, timeout=0.5):
    """Teste si un port TCP est ouvert."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception:
        return False

def get_service(port):
    """Retourne le nom du service pour un port."""
    try:
        return socket.getservbyport(port)
    except Exception:
        return "inconnu"

def scan_ports(host, start=1, end=1024):
    """Scanne une plage de ports."""
    print(f"Scan de {host} (ports {start}-{end})...")
    open_ports = []
    
    for port in range(start, end + 1):
        if scan_port(host, port):
            service = get_service(port)
            open_ports.append((port, service))
            print(f"  ✅ Port {port}/tcp ouvert — {service}")
    
    if not open_ports:
        print("  Aucun port ouvert détecté.")
    return open_ports

# IMPORTANT : Ne scanner que des hôtes autorisés !
# Exemple avec localhost
results = scan_ports("127.0.0.1", start=1, end=100)
print(f"\\nTotal : {len(results)} port(s) ouvert(s)")`,
  },
];

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const s = {
  app: { minHeight: "100vh", backgroundColor: C.bg, color: C.text, fontFamily: font, padding: "0 0 80px 0" },
  header: { padding: "28px 24px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 },
  headerIcon: { color: C.amber },
  title: { fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" },
  subtitle: { fontSize: 12, color: C.muted, marginTop: 2 },
  nav: { padding: "16px 24px 0", overflowX: "auto", display: "flex", gap: 8, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 },
  navTab: (active, color) => ({
    padding: "8px 14px", borderRadius: "8px 8px 0 0", border: `1px solid ${active ? color : C.border}`,
    borderBottom: active ? `2px solid ${color}` : `1px solid ${C.border}`,
    background: active ? `${color}18` : "transparent", color: active ? color : C.muted,
    cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
    display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
  }),
  content: { padding: "24px 24px 0" },
  moduleGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 },
  moduleCard: (color) => ({
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 14px",
    cursor: "pointer", transition: "all 0.15s", display: "flex", flexDirection: "column", gap: 8,
    ":hover": { borderColor: color },
  }),
  moduleLabel: { fontSize: 13, fontWeight: 600, color: C.text },
  badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, background: `${color}22`, color }),
  flashcard: {
    width: "100%", minHeight: 200, perspective: "1000px", cursor: "pointer", marginBottom: 16,
  },
  cardInner: (flipped) => ({
    width: "100%", minHeight: 200, position: "relative",
    transformStyle: "preserve-3d", transition: "transform 0.45s",
    transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
  }),
  cardFace: (back) => ({
    position: back ? "absolute" : "relative", top: 0, left: 0, width: "100%", minHeight: 200,
    backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
    transform: back ? "rotateY(180deg)" : "rotateY(0)",
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "center",
  }),
  cardQ: { fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.5, marginBottom: 8 },
  cardA: { fontSize: 14, color: C.text, lineHeight: 1.65, marginBottom: 12 },
  cardWhy: { fontSize: 12, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4 },
  tap: { fontSize: 11, color: C.muted, textAlign: "center", marginTop: 8 },
  btn: (color, outlined) => ({
    padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
    border: `1px solid ${color}`, background: outlined ? "transparent" : color,
    color: outlined ? color : C.bg, transition: "all 0.15s",
  }),
  row: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  quizOpt: (state) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10, cursor: state === "none" ? "pointer" : "default",
    border: `1px solid ${state === "correct" ? C.green : state === "wrong" ? C.red : state === "highlight" ? C.amber : C.border}`,
    background: state === "correct" ? `${C.green}18` : state === "wrong" ? `${C.red}18` : state === "highlight" ? `${C.amber}10` : C.surface,
    color: C.text, textAlign: "left", fontSize: 13, marginBottom: 8, transition: "all 0.15s",
  }),
  explanation: (ok) => ({
    padding: "12px 14px", borderRadius: 10, marginTop: 4,
    background: ok ? `${C.green}15` : `${C.red}15`, border: `1px solid ${ok ? C.green : C.red}`,
    fontSize: 13, color: C.text, lineHeight: 1.6,
  }),
  progressBar: (pct, color) => ({
    height: 4, borderRadius: 4, background: C.border, marginBottom: 16,
    position: "relative", overflow: "hidden",
  }),
  progressFill: (pct, color) => ({
    position: "absolute", top: 0, left: 0, height: "100%",
    width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.3s",
  }),
  codeBlock: {
    background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 10,
    padding: "16px", fontFamily: mono, fontSize: 12, color: "#79c0ff",
    whiteSpace: "pre", overflowX: "auto", lineHeight: 1.7, marginTop: 12,
  },
  hint: { padding: "10px 14px", background: `${C.amber}10`, border: `1px solid ${C.amber}30`, borderRadius: 8, fontSize: 13, color: C.text, marginBottom: 8 },
  mockQ: { fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 20, lineHeight: 1.5 },
  timer: (pct) => ({
    height: 6, borderRadius: 3, background: C.border, marginBottom: 20,
    position: "relative", overflow: "hidden",
  }),
  timerFill: (pct) => ({
    position: "absolute", top: 0, left: 0, height: "100%",
    width: `${pct}%`, borderRadius: 3, transition: "width 1s linear",
    background: pct > 50 ? C.green : pct > 25 ? C.amber : C.red,
  }),
};

/* ─── COMPONENTS ────────────────────────────────────────────────────────── */

function FlashcardView({ module, onBack }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = module.flashcards[idx];

  return (
    <div>
      <div style={s.row}>
        <button style={s.btn(C.muted, true)} onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />Retour</button>
        <span style={{ color: C.muted, fontSize: 13 }}>{idx + 1} / {module.flashcards.length}</span>
      </div>
      <div style={s.progressBar()}>
        <div style={s.progressFill((idx / module.flashcards.length) * 100, module.color)} />
      </div>

      <div style={s.flashcard} onClick={() => setFlipped(f => !f)}>
        <div style={s.cardInner(flipped)}>
          {/* Front */}
          <div style={s.cardFace(false)}>
            <div style={{ fontSize: 11, color: module.color, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Question</div>
            <div style={s.cardQ}>{card.q}</div>
            <div style={s.tap}>Tap pour révéler la réponse</div>
          </div>
          {/* Back */}
          <div style={s.cardFace(true)}>
            <div style={{ fontSize: 11, color: module.color, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Réponse</div>
            <div style={s.cardA}>{card.a}</div>
            <div style={s.cardWhy}><span style={{ color: module.color, fontWeight: 600 }}>Pourquoi en entretien : </span>{card.why}</div>
          </div>
        </div>
      </div>

      <div style={{ ...s.row, justifyContent: "space-between", marginTop: 8 }}>
        <button style={s.btn(C.muted, true)} onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={idx === 0}>
          <ChevronLeft size={14} style={{ verticalAlign: "middle" }} /> Préc
        </button>
        <button style={s.btn(module.color, false)} onClick={() => { setIdx(i => Math.min(module.flashcards.length - 1, i + 1)); setFlipped(false); }} disabled={idx === module.flashcards.length - 1}>
          Suiv <ChevronRight size={14} style={{ verticalAlign: "middle" }} />
        </button>
      </div>
    </div>
  );
}

function QuizView({ module, onBack }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = module.quiz[idx];

  function pick(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.ans) setScore(s => s + 1);
  }

  function next() {
    if (idx < module.quiz.length - 1) { setIdx(i => i + 1); setSelected(null); }
    else setDone(true);
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <Trophy size={48} style={{ color: C.amber, marginBottom: 16 }} />
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{score}/{module.quiz.length}</div>
      <div style={{ color: C.muted, marginBottom: 24 }}>
        {score === module.quiz.length ? "Parfait ! Module maîtrisé 🎯" : score >= module.quiz.length * 0.7 ? "Bonne maîtrise, continue ainsi !" : "Encore un peu de révision nécessaire."}
      </div>
      <div style={s.row}>
        <button style={s.btn(module.color, false)} onClick={() => { setIdx(0); setSelected(null); setScore(0); setDone(false); }}>Recommencer</button>
        <button style={s.btn(C.muted, true)} onClick={onBack}>Retour</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={s.row}>
        <button style={s.btn(C.muted, true)} onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />Retour</button>
        <span style={{ color: C.muted, fontSize: 13 }}>{idx + 1} / {module.quiz.length} — Score : {score}</span>
      </div>
      <div style={s.progressBar()}>
        <div style={s.progressFill((idx / module.quiz.length) * 100, module.color)} />
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 18px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: module.color, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Question {idx + 1}</div>
        <div style={s.mockQ}>{q.q}</div>
        {q.opts.map((opt, i) => {
          let state = "none";
          if (selected !== null) {
            if (i === q.ans) state = "correct";
            else if (i === selected) state = "wrong";
          }
          return (
            <button key={i} style={s.quizOpt(state)} onClick={() => pick(i)}>
              {selected !== null && i === q.ans && <Check size={14} style={{ color: C.green, marginRight: 6, verticalAlign: "middle" }} />}
              {selected !== null && i === selected && i !== q.ans && <X size={14} style={{ color: C.red, marginRight: 6, verticalAlign: "middle" }} />}
              {opt}
            </button>
          );
        })}
        {selected !== null && (
          <div style={s.explanation(selected === q.ans)}>
            <strong>{selected === q.ans ? "✅ Correct !" : "❌ Incorrect."}</strong> {q.exp}
          </div>
        )}
      </div>
      {selected !== null && (
        <button style={s.btn(module.color, false)} onClick={next}>
          {idx < module.quiz.length - 1 ? "Question suivante →" : "Voir les résultats"}
        </button>
      )}
    </div>
  );
}

function CodingLab({ onBack }) {
  const [idx, setIdx] = useState(null);
  const [hintIdx, setHintIdx] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  if (idx === null) return (
    <div>
      <button style={{ ...s.btn(C.muted, true), marginBottom: 20 }} onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />Retour</button>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Coding Lab <span style={{ color: C.amber }}>Python</span></div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>5 défis pour pratiquer les algorithmes de sécurité</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CHALLENGES.map((c, i) => (
          <button key={c.id} onClick={() => { setIdx(i); setHintIdx(0); setShowSolution(false); }}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", textAlign: "left", cursor: "pointer", color: C.text }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}><Code2 size={14} style={{ color: C.amber, marginRight: 6, verticalAlign: "middle" }} />{c.title}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const ch = CHALLENGES[idx];
  return (
    <div>
      <button style={{ ...s.btn(C.muted, true), marginBottom: 16 }} onClick={() => setIdx(null)}><ArrowLeft size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />Tous les défis</button>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{ch.title}</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{ch.desc}</div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Critères</div>
        {ch.criteria.map((cr, i) => <div key={i} style={{ fontSize: 13, color: C.text, marginBottom: 6 }}><Check size={12} style={{ color: C.teal, marginRight: 6, verticalAlign: "middle" }} />{cr}</div>)}
      </div>

      {!showSolution && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
            <Lightbulb size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />Indices ({hintIdx}/{ch.hints.length} révélés)
          </div>
          {ch.hints.slice(0, hintIdx).map((h, i) => <div key={i} style={s.hint}><strong>Indice {i + 1} :</strong> {h}</div>)}
          {hintIdx < ch.hints.length && (
            <button style={s.btn(C.amber, true)} onClick={() => setHintIdx(n => n + 1)}>Révéler l'indice {hintIdx + 1}</button>
          )}
        </div>
      )}

      <button style={{ ...s.btn(showSolution ? C.muted : C.violet, showSolution), marginBottom: 0 }} onClick={() => setShowSolution(v => !v)}>
        {showSolution ? "Masquer la solution" : "Voir la solution"}
      </button>
      {showSolution && <div style={s.codeBlock}>{ch.solution}</div>}
    </div>
  );
}

function MockInterview({ onBack }) {
  const allQ = useMemo(() => MODULES.flatMap(m => m.quiz.map(q => ({ ...q, moduleColor: m.color }))), []);
  const questions = useMemo(() => {
    const shuffled = [...allQ].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  }, [allQ]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(20);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (done || selected !== null) return;
    setTime(20);
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setSelected(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, done, selected]);

  function pick(i) {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(i);
    if (i === questions[idx].ans) setScore(s => s + 1);
  }

  function next() {
    if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); }
    else setDone(true);
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <Flame size={48} style={{ color: C.amber, marginBottom: 16 }} />
      <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{score}/{questions.length}</div>
      <div style={{ color: score >= 12 ? C.green : score >= 8 ? C.amber : C.red, fontWeight: 600, marginBottom: 20 }}>
        {score >= 12 ? "Excellent ! Tu es prêt(e) pour l'entretien 🎯" : score >= 8 ? "Bon niveau, encore un peu de révision !" : "Continue à t'entraîner, tu progresses !"}
      </div>
      <div style={s.row}>
        <button style={s.btn(C.amber, false)} onClick={() => { setIdx(0); setSelected(null); setScore(0); setDone(false); }}>Nouveau mock</button>
        <button style={s.btn(C.muted, true)} onClick={onBack}>Retour</button>
      </div>
    </div>
  );

  const q = questions[idx];
  const pct = (time / 20) * 100;

  return (
    <div>
      <div style={s.row}>
        <button style={s.btn(C.muted, true)} onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />Arrêter</button>
        <span style={{ color: C.muted, fontSize: 13 }}>{idx + 1}/{questions.length}</span>
        <span style={{ color: time < 6 ? C.red : C.amber, fontWeight: 700, marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <Timer size={14} />{time}s
        </span>
      </div>
      <div style={s.timer()}>
        <div style={s.timerFill(pct)} />
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 18px", marginBottom: 16 }}>
        <div style={s.mockQ}>{q.q}</div>
        {q.opts.map((opt, i) => {
          let state = "none";
          if (selected !== null) {
            if (i === q.ans) state = "correct";
            else if (i === selected && i !== q.ans) state = "wrong";
          }
          return (
            <button key={i} style={s.quizOpt(state)} onClick={() => pick(i)}>
              {selected !== null && i === q.ans && <Check size={14} style={{ color: C.green, marginRight: 6, verticalAlign: "middle" }} />}
              {selected !== null && i === selected && i !== q.ans && <X size={14} style={{ color: C.red, marginRight: 6, verticalAlign: "middle" }} />}
              {opt}
            </button>
          );
        })}
        {selected !== null && (
          <div style={s.explanation(selected === q.ans)}>
            {selected === -1 ? "⏱️ Temps écoulé ! " : selected === q.ans ? "✅ Correct ! " : "❌ Incorrect. "}{q.exp}
          </div>
        )}
      </div>
      {selected !== null && (
        <button style={s.btn(C.amber, false)} onClick={next}>
          {idx < questions.length - 1 ? "Question suivante →" : "Voir mon score"}
        </button>
      )}
    </div>
  );
}

/* ─── HOME ──────────────────────────────────────────────────────────────── */
function Home({ onSelect }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6, letterSpacing: "-0.5px" }}>
          Prépare ton entretien <span style={{ color: C.amber }}>cyber</span>
        </div>
        <div style={{ fontSize: 13, color: C.muted }}>8 modules · Flashcards · Quiz · Coding Lab · Mock Interview</div>
      </div>

      <div style={s.moduleGrid}>
        {MODULES.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.id} style={s.moduleCard(m.color)} onClick={() => onSelect(m)}>
              <Icon size={20} style={{ color: m.color }} />
              <div style={s.moduleLabel}>{m.label}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <span style={s.badge(m.color)}>{m.flashcards.length} fiches</span>
                <span style={s.badge(m.color)}>{m.quiz.length} quiz</span>
              </div>
            </div>
          );
        })}
        <div style={s.moduleCard(C.amber)} onClick={() => onSelect("coding")}>
          <Code2 size={20} style={{ color: C.amber }} />
          <div style={s.moduleLabel}>Coding Lab</div>
          <span style={s.badge(C.amber)}>5 défis Python</span>
        </div>
        <div style={s.moduleCard(C.red)} onClick={() => onSelect("mock")}>
          <Flame size={20} style={{ color: C.red }} />
          <div style={s.moduleLabel}>Mock Interview</div>
          <span style={s.badge(C.red)}>15 questions · 20s</span>
        </div>
      </div>
    </div>
  );
}

/* ─── MODULE DETAIL ──────────────────────────────────────────────────────── */
function ModuleDetail({ module, onBack }) {
  const [mode, setMode] = useState(null);

  if (mode === "flash") return <FlashcardView module={module} onBack={() => setMode(null)} />;
  if (mode === "quiz") return <QuizView module={module} onBack={() => setMode(null)} />;

  const Icon = module.icon;
  return (
    <div>
      <button style={{ ...s.btn(C.muted, true), marginBottom: 20 }} onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />Retour</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <Icon size={24} style={{ color: module.color }} />
        <div style={{ fontSize: 20, fontWeight: 800 }}>{module.label}</div>
      </div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>{module.flashcards.length} flashcards · {module.quiz.length} questions de quiz</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button style={{ ...s.btn(module.color, false), padding: "16px 18px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }} onClick={() => setMode("flash")}>
          <Lock size={18} /><div style={{ textAlign: "left" }}><div style={{ fontWeight: 700 }}>Flashcards</div><div style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>Mémorisation active — tap pour révéler</div></div>
        </button>
        <button style={{ ...s.btn(module.color, true), padding: "16px 18px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }} onClick={() => setMode("quiz")}>
          <Check size={18} /><div style={{ textAlign: "left" }}><div style={{ fontWeight: 700 }}>Quiz</div><div style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>QCM avec explications détaillées</div></div>
        </button>
      </div>
    </div>
  );
}

/* ─── STORAGE HELPERS ───────────────────────────────────────────────────── */
async function saveProgress(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); } catch (_) {}
}
async function loadProgress(key, fallback) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch (_) { return fallback; }
}

/* ─── APP ROOT ──────────────────────────────────────────────────────────── */
const NAV = [
  { id: "home", label: "Accueil", icon: Shield, color: C.amber },
  { id: "mock", label: "Mock", icon: Flame, color: C.red },
  { id: "coding", label: "Coding", icon: Code2, color: C.amber },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [selected, setSelected] = useState(null);
  // progress: { [moduleId]: { flashDone: number, quizScore: number, quizTotal: number } }
  const [progress, setProgress] = useState({});
  const [codingDone, setCodingDone] = useState({});
  const [mockBest, setMockBest] = useState(null);

  // Load persisted progress on mount
  useEffect(() => {
    (async () => {
      const p = await loadProgress("progress", {});
      const c = await loadProgress("codingDone", {});
      const m = await loadProgress("mockBest", null);
      setProgress(p); setCodingDone(c); setMockBest(m);
    })();
  }, []);

  function handleSelect(item) {
    if (item === "mock") { setTab("mock"); setSelected(null); return; }
    if (item === "coding") { setTab("coding"); setSelected(null); return; }
    setSelected(item); setTab("module");
  }

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
      <div style={s.header}>
        <Shield size={22} style={s.headerIcon} />
        <div>
          <div style={s.title}>CyberPrep</div>
          <div style={s.subtitle}>Préparation entretien · Holberton · CTI/SOC</div>
        </div>
      </div>

      <div style={s.nav}>
        {NAV.map(n => {
          const Icon = n.icon;
          const active = tab === n.id || (n.id === "home" && tab === "module");
          return (
            <button key={n.id} style={s.navTab(active, n.color)} onClick={() => { setTab(n.id); setSelected(null); }}>
              <Icon size={13} />{n.label}
            </button>
          );
        })}
      </div>

      <div style={s.content}>
        {tab === "home" && !selected && <Home onSelect={handleSelect} />}
        {tab === "module" && selected && <ModuleDetail module={selected} onBack={() => { setTab("home"); setSelected(null); }} />}
        {tab === "coding" && <CodingLab onBack={() => setTab("home")} />}
        {tab === "mock" && <MockInterview onBack={() => setTab("home")} />}
      </div>
    </div>
  );
}
