#Bonifica

Nella cartella ci sono diverse query da eseguire affinchè le modifiche al db fatte in fase 2 siano riportate correttamente nei vari ambienti


##from v1 to v2
###Update best score e best level
è stato predisposto un endpoint
`/api/matches/outcome-drainage`
con permessi da amministratore,
questo cicla tutti i match e popola le colonne best\_level e best\_score con il miglio risultato 

###Stato di replay del match
Prima settiamo tutti i match come ex-riferimento, in seguito mettiamo a riferimento i match che ne rispecchiano le caratteristiche (https://www.wrike.com/open.htm?id=237213712)

fare riferimento a `set_default_replay_state`

###Modifica entità match e game template
Verificare i giochi **Engineerio** e **Electrio**
le cartelle di gioco sono state rinominate da 

- engineerio-mod a engineerio
- electrio_restart a electrio

sono poi stati eliminati i giochi doppi quali:  

- Electrio con restart
- Engineerio mob

- modificare collonna last_attempt_valid per Circle the dot e Light Color  a false

queries:

PER POTER ELIMINARE IL GIOCO

- update session set game_id = 4701 where game_id = 24101

- update match set game_id = 4701 where game_id = 24101
 
- update match_template set game_id = 4701 where game_id = 24101

- update session set game_id = 1002 where game_id = 4301
- update match set game_id = 1002 where game_id = 4301
- update match_template set game_id = 1002 where game_id = 4301

PER POTER ELIMINARE IL TEMPLATE

- update match set template_id = 1052 where template_id = 4401
- update match set template_id = 4751 where template_id = 24151

per eliminare poi le entità è consigliato procedere attraverso il pannello amministratore di **gatorade**

quindi le entità da eliminare sono:

GAME:

- engineerio mob
- electrio con restart

TEMPLATE:

- template engineerio mobile	
- Template for Electrio_restart	


###Update send\_to\_po
per aggiornare lanciare la query nel file `update send_to_po true` 
verificare prima lo stato dei match usando 
`select send_to_po false or null`