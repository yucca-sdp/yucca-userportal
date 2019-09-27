# Project Title
**Yucca Smart Data Platform** è una piattaforma cloud aperta e precompetitiva della Regione Piemonte, realizzata dal CSI Piemonte con tecnologie open source.
# Getting Started
La componente **userportal** si occupa di fornire il Front-End Web per la fruizione del prodotto [Yucca Userportal](https://github.com/yucca-sdp/yucca-userportal/).
# Prerequisites
Si rimanda ai file [README.md](../README.md) del prodotto per i dettagli specifici.
# Configurations
Nel codice sorgente sono stati inseriti dei segnaposto per identificare le variabili della configurazione appplicativa, ad esempio `@@variabile@@`: questa notazione consente di riconoscerle facilmente all'inderno del progetto.

La tabella seguente contiene l'elenco delle variabili della configurazione applicativa, la loro posizione all'interno del progetto e una breve descrizione o un valore di esempio.

| Percorso | Variabile | Descrizione o esempio | 
| ---: | --- | --- | 
| [src/main/resources/dev/authorization-example.properties](src/main/resources/dev/authorization-example.properties#L1) | authorization.secret |  | 
| [src/main/resources/dev/authorization-example.properties](src/main/resources/dev/authorization-example.properties#L2) | rbac.webservice.secret |  | 
| [src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L2) | ENVIRONMENT |  | 
| [src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L5) | WEB_SOCKET_BASE_URL | `ws://stream.example.com/ws/` | 
| [src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L6) | WEB_SOCKET_USER |  | 
| [src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L7) | WEB_SOCKET_SECRET |  | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L2) | ENVIRONMENT |  | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L5) | API_SERVICES_URL |  | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L6) | API_MANAGEMENT_URL |  | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L7) | API_DISCOVERY_URL |  | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L8) | API_ODATA_URL |  | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L11) | RBAC_PERMISSIONS_WEBSERVICE_URL | `https://sso.example.com/services/RemoteAuthorizationManagerService` | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L12) | RBAC_ROLES_WEBSERVICE_URL | `https://sso.example.com/services/UserAdmin` | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L14) | RBAC_WEBSERVICE_USER |  | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L17) | HTTP_PROXY_HOST |  | 
| [src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L18) | HTTP_PROXY_PORT |  | 
| [src/main/resources/dev/web.xml](src/main/resources/dev/web.xml#L20) | IdpUrl | `https://sso.example.com/samlsso` | 
| [src/main/resources/dev/web.xml](src/main/resources/dev/web.xml#L24) | ConsumerUrl | `http://backoffice.example.com:90/backoffice/api/authorize` | 
| [src/main/resources/dev/web.xml](src/main/resources/dev/web.xml#L28) | AttributeConsumingServiceIndex | 123456789 | 
| [src/main/resources/dev/web.xml](src/main/resources/dev/web.xml#L32) | IdpLoginPageStylePath | `https://backoffice.example.com/ris/auth/css/auth.css` | 
| [src/main/webapp/WEB-INF/web.xml](src/main/webapp/WEB-INF/web.xml#L20) | IdpUrl | `https://sso.example.com/samlsso` | 
| [src/main/webapp/WEB-INF/web.xml](src/main/webapp/WEB-INF/web.xml#L24) | ConsumerUrl | `http://backoffice.example.com:90/backoffice/api/authorize` | 
| [src/main/webapp/WEB-INF/web.xml](src/main/webapp/WEB-INF/web.xml#L28) | AttributeConsumingServiceIndex | 123456789 | 
| [src/main/webapp/WEB-INF/web.xml](src/main/webapp/WEB-INF/web.xml#L32) | IdpLoginPageStylePath | `https://backoffice.example.com/ris/auth/css/auth.css` | 

# Installing
Si rimanda ai file [README.md](../README.md) del prodotto per i dettagli specifici.
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

Consulta il file [LICENSE.txt](../LICENSE.txt) per i dettagli sulla licenza.

Questa componente utilizza librerie la cui licenza prevede un'integrazione: sono state inserite le informazioni necessarie nel file THIRD_PARTY_NOTE.
