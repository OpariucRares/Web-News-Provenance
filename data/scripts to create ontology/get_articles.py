import json
import csv
from SPARQLWrapper import SPARQLWrapper, JSON

WIKIDATA_SPARQL = "https://query.wikidata.org/sparql"

sparql = SPARQLWrapper(WIKIDATA_SPARQL)

query = """
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?article ?title ?author ?date ?language ?pages ?subject ?source ?url ?image ?video ?description WHERE {
  ?article wdt:P31 wd:Q13442814 ;
           rdfs:label ?title ;
           wdt:P18 ?image ;
           wdt:P50 ?author .
  OPTIONAL { ?article schema:description ?description }
  OPTIONAL { ?article wdt:P921 ?subject }
  OPTIONAL { ?article wdt:P1104 ?pages }
  OPTIONAL { ?article wdt:P577 ?date }
  OPTIONAL { ?article wdt:P364 ?language }
  OPTIONAL { ?article wdt:P1433 ?source }
  OPTIONAL { ?article wdt:P856 ?url }
  OPTIONAL { ?article wdt:P1651 ?video }
  FILTER(LANG(?title) = "en" || LANG(?title) = "es")
}
LIMIT 10000
"""

def fetch_article_data():
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()

results = fetch_article_data()

seen_articles = {}
with open("articles.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["article", "title", "author", "date", "language", "pages", "subject", "source", "url", "image", "video", "description"])
    for result in results["results"]["bindings"]:
        article_id = result["article"]["value"]
        title = result.get("title", {}).get("value", "")
        if article_id not in seen_articles:
            seen_articles[article_id] = set()
        if title not in seen_articles[article_id]:
            seen_articles[article_id].add(title)
            row = [result.get(var, {}).get("value", "") for var in ["article", "title", "author", "date", "language", "pages", "subject", "source", "url", "image", "video", "description"]]
            writer.writerow(row)

def fetch_article_details(article_id):
    sparql.setQuery(f"""
    SELECT ?property ?value WHERE {{
        wd:{article_id} ?property ?value .
    }}
    """)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()

articles = []
with open("articles.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    articles = [row["article"].split("/")[-1] for row in reader]

details = {}
for article_id in articles:
    details[article_id] = fetch_article_details(article_id)

with open("article_details.json", "w", encoding="utf-8") as file:
    json.dump(details, file, indent=4)
