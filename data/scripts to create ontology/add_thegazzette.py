import json
import csv
from SPARQLWrapper import SPARQLWrapper, JSON

SPARQL_GAZETTE = "https://www.thegazette.co.uk/sparql"
SPARQL_WIKIDATA = "https://query.wikidata.org/sparql"

ONTOLOGY_FILE = "ontology_articles.ttl"

def fetch_gazette_data():
    sparql = SPARQLWrapper(SPARQL_GAZETTE)
    query = """
    PREFIX gaz: <https://www.thegazette.co.uk/def/publication#>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?notice ?title ?publicationDate ?act ?act_label ?agent ?agentLabel ?noticeCode
    WHERE {
      ?notice a gaz:Notice ;
              rdfs:label ?title ;
              gaz:hasPublicationDate ?publicationDate ;
              gaz:hasNoticeCode ?noticeCode ;
              prov:wasGeneratedBy ?act .

      ?act a prov:Activity ;
           rdfs:label ?act_label .

      OPTIONAL { ?act prov:wasAssociatedWith ?agent . ?agent rdfs:label ?agentLabel }
    }
    LIMIT 100
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()

with open(ONTOLOGY_FILE, "r", encoding="utf-8") as f:
    ontology_data = f.read()

gazette_results = fetch_gazette_data()

new_triples = "\n# Adding Gazette Notices and News Articles\n"

for i, result in enumerate(gazette_results["results"]["bindings"], start=5001):
    article_id = f"nepr:Q{i}"
    notice_uri = f"<{result['notice']['value']}>"
    title = result.get("title", {}).get("value", "Untitled")
    pub_date = result.get("publicationDate", {}).get("value", "Unknown Date")
    notice_code = result.get("noticeCode", {}).get("value", "Uncategorized")
    act_label = result.get("act_label", {}).get("value", "Unknown Activity")
    agent_uri = f"nepr:Agent{i}"
    agent_label = result.get("agentLabel", {}).get("value", "Unknown Agent")

    new_triples += f"""
{article_id} a nepr:Article ;
    schema:headline "{title}" ;
    dcterms:date "{pub_date}"^^xsd:dateTime ;
    schema:contentUrl {notice_uri} ;
    dcterms:subject "{notice_code}" ;
    schema:description "{act_label}" ;
    prov:wasAttributedTo {agent_uri} .

{agent_uri} a schema:Person ;
    schema:name "{agent_label}" .
"""

if new_triples not in ontology_data:
    with open(ONTOLOGY_FILE, "a", encoding="utf-8") as f:
        f.write(new_triples)
    print("✅ New Gazette notices and Wikidata articles appended to ontology.")
else:
    print("⚠️ No new data to append; data is already up to date.")
