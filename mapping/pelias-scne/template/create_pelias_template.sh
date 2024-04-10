curl -XDELETE "http://[IP_ELASTICSEARCH]:9200/_template/pelias_template?pretty"
curl -XPUT "http://[IP_ELASTICSEARCH]:9200/_template/pelias_template?pretty" -H 'Content-Type: application/json' -d @pelias_template.txt
