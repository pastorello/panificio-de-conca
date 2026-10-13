# VisitBlock

Il blocco «Vieni a trovarci» (`visit.title`) che chiude ogni pagina tranne Note legali e 404: H2, lo stato `OpenNow`, l'indirizzo in una frase («Lungomare Caboto [[CIVICO]], Gaeta, nel quartiere medievale, di fronte alla base. Parcheggio sul lungomare.») e due bottoni secondari, «Orari completi» verso Contatti e «Indicazioni» verso le mappe. È la risposta alla regola dei tre secondi per chi è arrivato in fondo: dove, quando, come.

## Layout

- Mobile: elementi impilati con gap `space-4`, padding verticale `space-7`, bordo superiore 1 px `line`, sfondo `paper` (il footer sotto è `paper-deep`, così i due blocchi restano distinti).
- Desktop (`dc-visit--desktop`): H2 a tutta larghezza, poi tre colonne — orari, indirizzo, bottoni — dentro il contenitore da 1120 px.

## Regole

Nessun bottone primario qui: su mobile la CtaBar fissa ha già «Chiama e prenota»; su desktop il primario sta nella riga CTA in alto. Nessuna mappa incorporata.

## Cosa fornisce chi lo usa

Le stringhe della lingua, l'indirizzo da `business.json`, l'URL di Contatti nella lingua corrente e il link alle mappe.
