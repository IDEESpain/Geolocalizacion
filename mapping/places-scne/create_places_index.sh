curl -XDELETE 'http://[IP_ELASTICSEARCH]:9200/places-scne?pretty'

curl -XPUT "http://[IP_ELASTICSEARCH]:9200/places-scne/?pretty" -H 'Content-Type: application/json'
