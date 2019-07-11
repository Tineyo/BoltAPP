BoltAPP
==========
* [Français](#français)  
* [English](#english)
  
## Français

### Présentation

BoltAPP est une application permettant de piloter facilement le robot Sphero Bolt dans le navigateur avec la Web Bluetooth API.
L'API pour contrôler le robot est grandement inspirée par: https://github.com/igbopie/spherov2.js 

### Utilisation

Vous pouvez tester l'application ici: https://tineyo.github.io/BoltAPP/

### Fonctionnalités

* Faire rouler le robot.
* Contrôler le robot avec la voix (Français et anglais).
* Changer la couleur des LEDs.
* Système demandant au robot de nous suivre en utilisant la géolocalisation de l'appareil (experimental).

### Contrôle vocal

#### Déplacement

* **Direction** : avant, arrière, gauche, droite
* **Pour indiquer une vitesse**: ajouter `vitesse :valeur:` après avoir dit la direction 
* **Pour indiquer une durée**: ajouter `pendant :valeur en secondes:` après avoir dit la direction.
* **Orienter Sphero Bolt**: Dire `Pivoter droite` ou `Pivoter gauche`. 

#### Changement de couleur

Dite le nom de la couleur.  
**Couleurs disponibles**: rouge, vert, bleu, jaune, turquoise, violet, noir, blanc  


**Liste de toutes les commandes** [ici](https://github.com/Tineyo/BoltAPP/blob/f3b1684d06c0bf7ee568b85856bc98352ce70f6d/scripts/speech.js#L205)
## English

### Presentation

BoltAPP is an application to control easily Sphero Bolt with Web Bluetooth API.
Sphero API is inspired by: https://github.com/igbopie/spherov2.js 

### Usage

You can test the app here: https://tineyo.github.io/BoltAPP/ 

### Features

* Rolls the Sphero
* Control the Sphero with voice (French and English)  
* Change LEDs color
* System asking Sphero to follow you using device's geolocation (experimental)

### Voice Control

#### Movements

* **Direction**: Say `go forward`,`go backward`,`go left`,`go right`.
* **To specify a speed**: say `speed :value:` after the direction.
* **To specify a duration**: say `during :value:` after the direction.
* **To spin Sphero Bolt**: say `spin right` or `spin left`.

#### Change the color

Say the name of the color.  
**Colors available**: red, green, blue, yellow, turquoise, purple, black, white.


**List of all commands** [here](https://github.com/Tineyo/BoltAPP/blob/f3b1684d06c0bf7ee568b85856bc98352ce70f6d/scripts/speech.js#L241)
