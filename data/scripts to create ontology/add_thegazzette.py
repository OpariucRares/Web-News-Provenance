from SPARQLWrapper import SPARQLWrapper, JSON

SPARQL_GAZETTE = "https://www.thegazette.co.uk/sparql"


def fetch_gazette_data():
    sparql = SPARQLWrapper(SPARQL_GAZETTE)
    query = """
    PREFIX gaz: <https://www.thegazette.co.uk/def/publication#>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?notice ?title ?publicationDate ?noticeCode ?act_label ?agent ?agentLabel
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
    LIMIT 200
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()


def process_gazette_data(gazette_results):
    triples = "\n# Adding Gazette Notices to Ontology\n"
    for i, result in enumerate(gazette_results["results"]["bindings"], start=1):
        article_id = f"nepr:GazetteArticle_{i}"
        notice_uri = f"<{result['notice']['value']}>"
        title = result.get("title", {}).get("value", "Untitled").replace('"', '\\"')
        pub_date = result.get("publicationDate", {}).get("value", "2023-01-01T00:00:00")
        notice_code = result.get("noticeCode", {}).get("value", "Uncategorized")
        act_label = result.get("act_label", {}).get("value", "Unknown Activity").replace('"', '\\"')
        agent_label = result.get("agentLabel", {}).get("value", "Unknown Agent").replace('"', '\\"')
        agent_uri = f"nepr:Agent_{i}"

        triple = f"""
{article_id} a nepr:Article ;
    schema:headline "{title}" ;
    dcterms:date "{pub_date}"^^xsd:dateTime ;
    dcterms:subject "{notice_code}" ;
    schema:contentUrl {notice_uri} ;
    schema:description "{act_label}" ;
    prov:wasAttributedTo {agent_uri} .

{agent_uri} a schema:Person ;
    schema:name "{agent_label}" .
"""
        triples += triple
    return triples


def append_to_ontology(triples):
    with open("ontology_articles.ttl", "a", encoding="utf-8") as f:
        f.write(triples)
    print("Noile articole din The Gazette au fost adăugate la ontologie.")


if __name__ == "__main__":
    gazette_results = fetch_gazette_data()
    new_triples = process_gazette_data(gazette_results)
    append_to_ontology(new_triples)
