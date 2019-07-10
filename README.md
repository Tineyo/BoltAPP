BoltAPP
==========
* [Français](#français)  
* [English](#english)
  
## Français

### Présentation

BoltAPP est une application  s'ouvrant dans le navigateur permettant de piloter facilement le robot Sphero Bolt avec la Web Bluetooth API.
L'API pour contrôler le robot est grandement inspirée par: https://github.com/igbopie/spherov2.js 

### Utilisation

Clonez (ou téléchargez) le répertoire puis ouvrez le ficher `views/index.html` dans votre navigateur.   

### Fonctionnalités

* Faire rouler le robot.
* Contrôler le robot avec la voix (Français et anglais).
* Changer la couleur des LEDs.
* Système demandant au robot de nous suivre en utilisant la géolocalisation de l'appareil (en dévelopemment).

### Contrôle vocal

#### Déplacement

* **Direction** : avant, arrière, gauche, droite
* **Pour indiquer une vitesse**: ajouter `vitesse :valeur:` après avoir dit la direction 
* **Pour indiquer une durée**: ajouter `pendant :valeur en secondes:` après avoir dit la direction.
* **Pour indiquer une vitesse et une durée**: Préciser tout d'abord la vitesse puis la durée.
* **Orienter Sphero Bolt**: Dire `Pivoter droite` ou `Pivoter gauche`. 

#### Changement de couleur

Dite le nom de la couleur.  
**Couleurs disponibles**: rouge, vert, bleu, jaune, turquoise, violet, noir, blanc  

## English

### Presentation

BoltAPP is an application to control easily Sphero Bolt with Web Bluetooth API.
Sphero API is inspired by: https://github.com/igbopie/spherov2.js 

### Usage

Clone (or download) the repository and open the file `views/index.html` on your navigator. 

### Features

* Rolls the Sphero
* Control the Sphero with voice (French and English)  
* Change LEDs color
* System asking Sphero to follow us using device's geolocation (under development)

### Voice Control

#### Movements

* **Direction**: Say `go forward`,`go backward`,`go left`,`go right`.
* **To specify a speed**: say `speed :value:` after the direction.
* **To specify a duration**: say `during :value:` after the direction.
* **To specify a speed and a duration**: precise the speed and then precise the duration
* **To spin Sphero Bolt**: say `spin right` or `spin left`.

#### Change the color

Say the name of the color.  
**Colors available**: red, green, blue, yellow, turquoise, purple, black, white.