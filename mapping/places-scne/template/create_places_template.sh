curl -XDELETE "http://[IP_ELASTICSEARCH]:9200/_template/places_template?pretty"
curl -XPUT "http://[IP_ELASTICSEARCH]:9200/_template/places_template?pretty" -H 'Content-Type: application/json' -d @places_template.txt
