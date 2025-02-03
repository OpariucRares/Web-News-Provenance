import json
import csv
import time
from SPARQLWrapper import SPARQLWrapper, JSON

WIKIDATA_SPARQL = "https://query.wikidata.org/sparql"
sparql = SPARQLWrapper(WIKIDATA_SPARQL)

# Liste cu tipuri de articole pentru interogare
article_types = {
    "Q5707594": "news",
    "Q30070590": "magazine",
    "Q17928402": "blogs",
    "Q13433827": "encyclopedia",
    "Q13442814": "scientific"
}

query_template = """
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?article ?title ?author ?date ?language ?pages ?subject ?source ?url ?image ?video ?description ?fullWorkURL ?creationDate ?lastModifiedDate ?revisionDate ?editor WHERE {{
  ?article wdt:P31 wd:{article_type} ;
           rdfs:label ?title ;
           wdt:P18 ?image;
           wdt:P50 ?author ;
           wdt:P953 ?fullWorkURL.
  OPTIONAL {{ ?article schema:description ?description }}
  OPTIONAL {{ ?article wdt:P921 ?subject }}
  OPTIONAL {{ ?article wdt:P1104 ?pages }}
  OPTIONAL {{ ?article wdt:P577 ?date }}
  OPTIONAL {{ ?article wdt:P364 ?language }}
  OPTIONAL {{ ?article wdt:P1433 ?source }}
  OPTIONAL {{ ?article wdt:P856 ?url }}
  OPTIONAL {{ ?article wdt:P1651 ?video }}
  OPTIONAL {{ ?article schema:dateCreated ?creationDate }}
  OPTIONAL {{ ?article schema:dateModified ?lastModifiedDate }}
  OPTIONAL {{ ?article prov:qualifiedRevision/prov:atTime ?revisionDate }}
  OPTIONAL {{ ?article prov:qualifiedRevision/prov:agent ?editor }}
  FILTER(LANG(?title) = "en" || LANG(?title) = "es")
}}
LIMIT 100000
"""


def fetch_article_data(article_type):
    query = query_template.format(article_type=article_type)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()


# Creează un fișier CSV și adaugă titlul coloanelor
with open("articles.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow([
        "article", "title", "author", "date", "language", "pages",
        "subject", "source", "url", "image", "video", "description",
        "fullWorkURL", "creationDate", "lastModifiedDate", "revisionDate", "editor"
    ])

seen_articles = {}

# Extrage datele pentru fiecare tip de articol pe rând
for article_type in article_types:
    results = fetch_article_data(article_type)

    with open("articles.csv", "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        for result in results["results"]["bindings"]:
            article_id = result["article"]["value"]
            if article_id not in seen_articles:
                seen_articles[article_id] = {
                    "title": result.get("title", {}).get("value", ""),
                    "author": result.get("author", {}).get("value", ""),
                    "date": result.get("date", {}).get("value", ""),
                    "language": result.get("language", {}).get("value", ""),
                    "pages": result.get("pages", {}).get("value", ""),
                    "subject": result.get("subject", {}).get("value", ""),
                    "source": result.get("source", {}).get("value", ""),
                    "url": result.get("url", {}).get("value", ""),
                    "image": result.get("image", {}).get("value", ""),
                    "video": result.get("video", {}).get("value", ""),
                    "description": result.get("description", {}).get("value", ""),
                    "fullWorkURL": result.get("fullWorkURL", {}).get("value", ""),
                    "creationDate": result.get("creationDate", {}).get("value", ""),
                    "lastModifiedDate": result.get("lastModifiedDate", {}).get("value", ""),
                    "revisionDate": result.get("revisionDate", {}).get("value", ""),
                    "editor": result.get("editor", {}).get("value", "")
                }

    for article_id, article_data in seen_articles.items():
        row = [
            article_id, article_data["title"], article_data["author"], article_data["date"],
            article_data["language"], article_data["pages"], article_data["subject"],
            article_data["source"], article_data["url"], article_data["image"],
            article_data["video"], article_data["description"], article_data["fullWorkURL"],
            article_data["creationDate"], article_data["lastModifiedDate"],
            article_data["revisionDate"], article_data["editor"]
        ]
        with open("articles.csv", "a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(row)

    print(f"Articles of type {article_types[article_type]} processed.")

    # Sleep time between queries
    time.sleep(5)

articles = []
with open("articles.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    articles = [row["article"].split("/")[-1] for row in reader]

print(articles)
