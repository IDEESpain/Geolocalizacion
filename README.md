# Servicio REST de Geocodificación de direcciones del Sistema Cartográfico Nacional de España (SCNE)

## Basado en Pelias

El Geocodificador del SCNE está basado en Pelias, que es un geocodificador de direcciones de código abierto:
- [Web oficial](https://pelias.io/)
- [GitHub](https://github.com/pelias)

La versión de Pelias sobre la que se basa este proyecto es la [v5.43.0](https://github.com/pelias/api/releases/tag/v5.43.0).

## Servicios principales

Los servicios que principalmente se usan en este proyecto son:
- [/v1/autocomplete](https://github.com/pelias/documentation/blob/master/autocomplete.md) - Permite realizar búsqueda de direcciones en tiempo real introduciendo texto.
- [/v1/reverse](https://github.com/pelias/documentation/blob/master/reverse.md) - Permite realizar geocodificación inversa y obtiene una dirección en base a sus coordenadas.

Más información acerca de los servicios de Pelias, [aquí](https://github.com/pelias/documentation/blob/master/services.md)

## Requisitos técnicos

- [Docker Compose](https://docs.docker.com/compose/) en su última versión
- [Acceso a DockerHub](https://hub.docker.com/)
- [Elasticsearch 7.X](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/es-release-notes.html)

### Elasticsearch

Es necesario:

1º) Instalar plugin _analysis-icu_

Desde %ELASTIC_HOME%/bin hacer:
```
./elasticsearch-plugin install --batch analysis-icu
```
y chequear desde:
```
http://[IP_ELASTIC]:9200/_cat/plugins?v&pretty
```
donde debería salir algo como:
```
name component version
... analysis-icu 7.X.X
```

2º) Crear templates

Se tienen dos ficheros de ejecución sh para ayudar a su creación:
- mapping/places-scne/template/create_places_template.sh
- mapping/pelias-scne/template/create_pelias_template.sh

**Notas:**
- En estos ficheros hay que configurar la URL de Elasticsearch antes de su ejecución.
- Ver el README correspondiente para más información

3º) Crear índices

Se tienen dos ficheros de ejecución sh para ayudar a crear los índices _places-scne_ y _pelias-scne_:
- mapping/places-scne/create_places_index.sh
- mapping/pelias-scne/create_pelias_index.sh

**Notas:**
- En estos ficheros hay que configurar la URL de Elasticsearch antes de su ejecución.
- Se crean los índices vacíos
- Ver el README correspondiente para más información

## Configuración

1º) pelias.json

Es necesario configurar el acceso a Elasticsearch. Esto es: _host_ y _port_:
```
…
"esclient": {
"apiVersion": "7.5",
"hosts": [
   {
      "host": "my.elasticsearch.es", <-- 
      "port": 9200 <--
   }
   ]
},
...
```
2º) places-api/routes/default.js

Es necesario configurar el acceso a Elasticsearch. Esto es completar _const els_node_:
```
…
const els_node = 'http://my.elasticsearch.es:9200';
…
```

## Despliegue

Desde la carpeta donde se encuentre el fichero docker-compose.yml:
- Arranque
```
docker compose up -d --build
```
- Parada
```
docker compose down
```
Son 3 los contenedores los que deben estar UP:
- pelias_libpostal-7-ign
- pelias_api-7-ign
- places_scn

## Acceso / Testing

Una vez desplegados los servicios vía Docker Compose, se tiene un visor embebido (basado en [API CNIG](https://plataforma.idee.es/cnig-api)) que se encuentra en la URL /v1/map para chequear el acceso y realizar testing funcional sobre los datos.
