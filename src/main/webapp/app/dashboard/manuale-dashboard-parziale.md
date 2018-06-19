# Dashboard Sessione
Interfaccia di monitoraggio delle giocate all'interno di una sessione


Informazioni di sessione
------------------------------------------------------------
L'intestazione riporta alcune informazioni di riepilogo della sessione:

|  Label | Descrizione |
|---|---|
| Team |  Il team che gioca in questa sessione | 
| Gioco| Il gioco scelto in questa sessione |  
|  Da - A | Date di inizio e termine sessione |
|  Gicoate Effettuate | Il numero totale di giocate al momento della visualizzazione  |
|  Risultato Migliore | Il punteggio o il livello più alto raggiunto tra tutte le giocate all’interno della sessione che si sta visualizzando. |




Lista Giocate
------------------------------------------------------------

La lista giocate riporta tutte le giocate già iniziate al momento in cui viene visualizzata la dashboard, ordinate da quelle iniziate più recentemente (in alto) a quelle iniziate prima (in fondo).

Ogni riga presenta:

1. nome del giocatore
2. livello o punteggio raggiunto (a chiusura della giocata)
3. stato della giocata (grafico)
4. dettaglio stato della giocata (descrizione)
5. pulsanti di gestione della giocata

### Punteggio / livello raggiunto
Il punteggio viene aggiornato quando la giocata non è più in corso. Fin quando la giocata non sarà conclusa, non verrà riportato nessun valore.

### Stato della giocata e dettaglio
L'avanzamento della giocata e il processo di elaborazione della stessa viene tracciato tramite una timeline che riporta gli stati:

- In corso
- Giocata conclusa
- Classifica aggiornata

	#### In corso
	La giocata risulta in corso nel momento in cui il giocatore avrà avviato il gioco (ad esempio premendo play dalla schermata iniziale). Il colore per indicare una giocata attualmente in corso è sempre il **verde**. Il dettaglio invece riporterà la scritta _"Sta giocando"_
	
	Occasionalmente la giocata potrebbe presentare dei problemi dovuti a diversi possibili fattori.
	In tal caso l'indicatore diventerà *rosso*. Il dettaglio invece riporterà _"Giocata appesa"_ o _""Giocata anomala_.
	
	**Giocata appesa**: quando il match è terminato (il tempo di gioco rispetto al tempo di inizio match è passato) ma il segnale di chiusura del match, dal client, non è arrivato. Di conseguenza l'invio dei dati a Playoff e le logiche di elaborazione del match non risultano eseguite e quindi è necessario forzarle.
	
	**Giocata anomala**: a differenza del caso precedente, il segnale di chiusura del match dal client è arrivato ma qualcosa non ha consentito la corretta elaborazione del match. Ad esempio nel caso in cui il player non risulti censito su Playoff, il match risulterà elaborato ma il punteggio non inviato a Playoff.
	
	#### Giocata conclusa
	La giocata è conclusa al termine del tempo a disposizione per effettuare la stessa.
	In questo stato i colori dell'indicatore sono il **giallo** nel momento in cui i dati vengono inviati al server, con dettaglio _"Invio dati in corso"_ o **rosso** nel momento in cui l'invo non dovesse riuscire, con dettaglio _"Invio dati fallito"_.

	**Invio dati in corso**: in questo caso l'elaborazione del match è stata (quindi il client ha inviato il segnale di fine match) ma l'invio dei dati a Playoff non risulta essere completata.
	
	**Invio dati fallito**: quando dalla dashboard è stato eseguito un reinvio dei dati che risulta essere fallito.
	
	#### Classifica aggiornata
	La classifica viene aggiornata quando i dati della giocata sono stati correttamente inviati al server senza nessun problema. Il colore per indicare che la classifica è stata correttamente aggiornata è il **verde**. Il dettaglio invece riporterà la scritta _"Elaborazione conclusa"_.

### Pulsanti di gestione della giocata






