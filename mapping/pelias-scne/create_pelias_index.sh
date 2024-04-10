curl -XDELETE 'http://[IP_ELASTICSEARCH]:9200/pelias-scne?pretty'

curl -XPUT "http://[IP_ELASTICSEARCH]:9200/pelias-scne/?pretty" -H 'Content-Type: application/json'