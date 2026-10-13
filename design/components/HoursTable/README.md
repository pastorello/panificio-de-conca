# HoursTable

La tabella degli orari della settimana in Contatti: un `<table>` vero con sette righe, il giorno in `<th scope="row">` e le fasce in una cella, in formato 24 h con il punto mediano tra mattina e pomeriggio («7:30–13:15 · 16:30–20:00»). La riga del giorno corrente ha sfondo `paper-deep` e la parola «oggi» accanto al giorno: così lo stato si capisce anche senza colore e senza JavaScript (la riga «oggi» è calcolata sul posto nel fuso `Europe/Rome`; senza JS nessuna riga è evidenziata).

## Aspetto

Testo 18 px con cifre tabulari, celle con padding `space-3`, righe separate da 1 px `line`, nessun bordo esterno, angoli vivi. Il giorno in grassetto 600, «Chiuso» in `ink` come le altre celle.

## Orari speciali

Quando `special_hours` è attivo, un `Callout` con il chip «Orari delle feste» sta sopra la tabella e riporta date e fasce; gli orari speciali hanno la precedenza e lo stesso blocco alimenta lo stato OpenNow.

## Cosa fornisce chi lo usa

Gli orari settimanali e speciali da `business.json`, i nomi dei giorni nella lingua della pagina, la stringa `hours.special`. Nessun orario di sfornata: il negozio non ne dichiara.
