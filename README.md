# Project Title
**Yucca Smart Data Platform** è una piattaforma cloud aperta e precompetitiva della Regione Piemonte, realizzata dal CSI Piemonte con tecnologie open source.
# Getting Started
Il prodotto **Yucca Userportal** è composto dalle seguenti componenti:
- [backoffice](TODO) (Front-End Web di amministrazione)
- [userportal](TODO) (Front-End Web di fruizione)
# Prerequisites
I prerequisiti per l'installazione del prodotto sono i seguenti:
## Software
- [OpenJDK 8](https://openjdk.java.net/install/) o equivalenti
- [Apache Maven 3](https://maven.apache.org/download.cgi)
- [Oracle JBoss 6.4 GA](https://developers.redhat.com/products/eap/download)

Si rimanda ai file README&#46;md delle singole componenti per i dettagli specifici.
# Configurations
Nei file README.md delle singole componenti verranno elencate le variabili per la loro configurazione.
# Installing
## Istruzioni per la compilazione
- Da riga di comando eseguire `mvn -Dmaven.test.skip=true -P dev clean package`
- La compilazione genera le seguenti unità di installazione:
    - `backoffice/target/backoffice2.war`
    - `backoffice/userportal/userportal.war`
	- `backoffice/userportal/resources-web-2.01.0-002-resources-web.zip`
## Istruzioni per l'installazione
- Effettuare il deploy dei file `backoffice2.war` e `userportal.war` secondo procedura standard JBoss.
- Il file `resources-web-2.01.0-002-resources-web.zip` contiene le risorse statiche utilizzate dal prodotto. È possibile installarle nello stesso application server utilizzato precedentemente oppure su un server web dedicato, confiugrando opportunamente i puntamenti all'interno dei file di configurazione delle componenti.
# Versioning
Per la gestione del codice sorgente viene utilizzata la metodologia [Semantic Versioning](https://semver.org/).
# Authors
Gli autori della piattaforma Yucca sono:
- [Alessandro Franceschetti](mailto:alessandro.franceschetti@csi.it)
- [Claudio Parodi](mailto:claudio.parodi@csi.it)
# Copyrights
(C) Copyright 2019 Regione Piemonte
# License
Questo software è distribuito con licenza [EUPL-1.2-or-later](https://joinup.ec.europa.eu/collection/eupl/eupl-text-11-12)

Consulta il file [LICENSE.txt](LICENSE.txt) per i dettagli sulla licenza.

Per le componenti che utilizzano librerie la cui licenza prevede un'integrazione, sono state inserite le informazioni necessarie nel file THIRD_PARTY_NOTE.
