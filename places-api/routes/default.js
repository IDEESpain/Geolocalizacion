const { Client } = require('@elastic/elasticsearch');
const http = require('http');
const https = require('https');

// Docker accede por la misma red
const els_node = 'http://my.elasticsearch.es:9200';

const els_client = new Client({
    node: els_node,
    agent: false
});

const els_index = 'places-scne';

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

// set up routes that are outside any particular API version
function addRoutes(app) {
    function about(req, res, next) {
        res.status(200).json({ message: 'API Places del Gobierno de La Rioja (Spain)' });
    }

    async function search(req, res, next) {
        // Log
        hit(req);

        console.log(FgGreen + 'info:' + FgWhite, '[places-api]', req.protocol + '://' + req.get('host') + req.originalUrl);

        const data = [];

        if (!req.query.text) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(data));
            return;
        }
        // Parámetros de búsqueda. Eliminamos los slash de la query porque ELS falla si buscamos con texto con slash
        const text = req.query.text.replace('/', ' ');

        const { body } = await els_client.search({
            index: [els_index],
            body: {
                "query": {
                    "query_string": {
                        "query": text,
                        "fields": ["name"]
                    }
                }
            }
        })

        if (body.hits.hits.length == 0) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(data));
            return;
        }

        body.hits.hits.forEach(function (value) {
            let item = {}
            item.id = value._source.id;
            item.name = value._source.name;
            item.abbr = value._source.abbr;
            item.placetype = value._source.placetype;
            item.population = value._source.population;
            item.lineage = [];
            item.lineage.push(value._source.lineage);
            item.geom = value._source.geom;
            item.languageDefaulted = false;
            data.push(item);
        });

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data));

        // Log
        // hit(req);
    }

    function query(req, res, next) {
        console.log(FgGreen + 'info:' + FgWhite, '[places-api]', req.protocol + '://' + req.get('host') + req.originalUrl);
        res.status(200).json({ message: 'Query - API Places del Gobierno de La Rioja (Spain)' });
    }

    async function findbyid(req, res, next) {
        // Log
        // hit(req);

        console.log(FgGreen + 'info:' + FgWhite, '[places-api]', req.protocol + '://' + req.get('host') + req.originalUrl);

        const data = {};

        if (!req.query.ids) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(data));
            return;
        }

        const ids = req.query.ids
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length !== 0);

        const { body } = await els_client.search({
            index: [els_index],
            body: {
                "query": {
                    "ids": {
                        "values": ids
                    }
                }
            }
        })

        if (body.hits.hits.length == 0) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(data));
            return;
        }

        body.hits.hits.forEach(function (value) {
            const source = value._source;
            let item = {};
            item["id"] = source.id;
            item["name"] = source.name;
            item["abbr"] = source.abbr;
            item["placetype"] = source.placetype;
            switch (source.placetype) {
                case "country":
                    item["rank"] = {
                        "min": 19,
                        "max": 20
                    };
                    break;
                case "macroregion":
                    item["rank"] = {
                        "min": 15,
                        "max": 16
                    };
                    break;
                case "region":
                    item["rank"] = {
                        "min": 14,
                        "max": 15
                    };
                    break;
                case "localadmin":
                    item["rank"] = {
                        "min": 11,
                        "max": 12
                    };
                    break;
                case "locality":
                    item["rank"] = {
                        "min": 9,
                        "max": 10
                    };
                    break;
                default:
                    item["rank"] = {
                        "min": 19,
                        "max": 20
                    };
            }
            item["population"] = source.population;
            item["lineage"] = [{}];
            if (source.lineage.hasOwnProperty('country')) {
                item["lineage"][0].country_id = source.lineage.country.id;
            }
            if (source.lineage.hasOwnProperty('macroregion')) {
                item["lineage"][0].macroregion_id = source.lineage.macroregion.id;
            }
            if (source.lineage.hasOwnProperty('region')) {
                item["lineage"][0].region_id = source.lineage.region.id;
            }
            if (source.lineage.hasOwnProperty('localadmin')) {
                item["lineage"][0].localadmin_id = source.lineage.localadmin.id;
            }
            if (source.lineage.hasOwnProperty('locality')) {
                item["lineage"][0].locality_id = source.lineage.locality.id;
            }
            item["geom"] = source.geom;
            item["names"] = {
                "eng": [item["name"]],
                "spa": [item["name"]]
            }
            data[value._source["id"]] = item;
        });

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data));
    }

    function tokenize(req, res, next) {
        console.log(FgGreen + 'info:' + FgWhite, '[places-api]', req.protocol + '://' + req.get('host') + req.originalUrl);
        res.status(200).json({ message: 'Tokenize - API Places del Gobierno de La Rioja (Spain)' });
    }

    // Favicon
    app.get('/favicon.ico', (req, res) => res.sendStatus(204));
    // Routes
    app.get('/', about);
    app.get('/parser/search', search);
    app.get('/parser/query', query);
    app.get('/parser/findbyid', findbyid);
    app.get('/parser/tokenize', tokenize);
}

// Función hit a la que llaman desde las diferentes rutas cuando quieren escribir en el Log
const hit = async function (request) {
    const date = new Date();

    const data = JSON.stringify({
        timestamp: date.toISOString(),
        hostname: request.hostname,
        baseUrl: request.baseUrl,
        path: request.path,
        params: request.params,
        query: request.query,
        route: request.route,
        originalUrl: request.originalUrl,
        method: request.method,
        protocol: request.protocol,
        secure: request.secure,
        subdomains: request.subdomains,
        fresh: request.fresh,
        xhr: request.xhr,
        userAgent: request.headers['user-agent'],
        referrer: request.headers['referer'],
        remoteAddress: request.headers['x-forwarded-for'] || request.connection.remoteAddress
    });

    const buff = Buffer.from(data, 'utf-8');
    const base64data = buff.toString('base64');

    const options = {
        hostname: 'iderioja-geoapi',
        port: 3070,
        path: '/v1/log/hit',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': base64data.length
        }
    }

    const req = http.request(options);
    req.on('error', error => {
        console.error(error)
    })

    req.write(base64data);
    req.end();
};

module.exports.addRoutes = addRoutes;
