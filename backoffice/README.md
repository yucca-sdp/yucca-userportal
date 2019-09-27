# Project Title
**Yucca Smart Data Platform** è una piattaforma cloud aperta e precompetitiva della Regione Piemonte, realizzata dal CSI Piemonte con tecnologie open source.
# Getting Started
La componente **backoffice** si occupa di fornire il Front-End Web per l'amministrazione del prodotto [Yucca Userportal](..).
# Prerequisites
Si rimanda ai file [README.md](../README.md) del prodotto per i dettagli specifici.
# Configurations
Nel codice sorgente sono stati inseriti dei segnaposto per identificare le variabili della configurazione appplicativa, ad esempio `@@variabile@@`: questa notazione consente di riconoscerle facilmente all'inderno del progetto.

La tabella seguente contiene l'elenco delle variabili della configurazione applicativa, la loro posizione all'interno del progetto e una breve descrizione o un valore di esempio.
|Percorso|Variabile|Descrizione o esempio|
|-:|-|-|
|[src/main/resources/dev/authorization-example.properties](src/main/resources/dev/authorization-example.properties#L1)|authorization.secret||
|[src/main/resources/dev/authorization-example.properties](src/main/resources/dev/authorization-example.properties#L2)|rbac.webservice.secret||
|[src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L2)|ENVIRONMENT||
|[src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L5)|WEB_SOCKET_BASE_URL|`ws://stream.example.com/ws/`|
|[src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L6)|WEB_SOCKET_USER||
|[src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L7)|WEB_SOCKET_SECRET||
|[src/main/resources/dev/client.properties](src/main/resources/dev/client.properties#L9)|BUILD_FABRIC_DIRECT_URL||
|[src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L2)|ENVIRONMENT||
|[src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L5)|API_SERVICES_URL||
|[src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L6)|API_MANAGEMENT_URL||
|[src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L9)|RBAC_ROLES_WEBSERVICE_URL|`https://sso.example.com/services/RemoteAuthorizationManagerService`|
|[src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L10)|RBAC_PERMISSIONS_WEBSERVICE_URL|`https://sso.example.com/services/UserAdmin`|
|[src/main/resources/dev/server.properties](src/main/resources/dev/server.properties#L11)|RBAC_WEBSERVICE_USER||
|[src/main/resources/dev/web.xml](src/main/resources/dev/web.xml#L20)|IdpUrl|`https://sso.example.com/samlsso`|
|[src/main/resources/dev/web.xml](src/main/resources/dev/web.xml#L24)|ConsumerUrl|`http://userportal.example.com/userportal/api/authorize`|
|[src/main/resources/dev/web.xml](src/main/resources/dev/web.xml#L27)|AttributeConsumingServiceIndex|`123456789`|
|[src/main/resources/dev/web.xml](src/main/resources/dev/web.xml#L32)|IdpLoginPageStylePath|`https://userportal.example.com/ris/auth/css/auth.css`|
|[src/main/webapp/js/helpers.js](src/main/webapp/js/helpers.js#L269)|host|Nome host di dove è installato il prodotto.|
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
