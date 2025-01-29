import csv
import time

from SPARQLWrapper.SPARQLExceptions import QueryBadFormed
from langdetect import detect
from SPARQLWrapper import SPARQLWrapper, JSON

sparql = SPARQLWrapper("https://query.wikidata.org/sparql")

def fetch_author_name(author_uri):
    query = f"""
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?authorName WHERE {{
            <{author_uri}> rdfs:label ?authorName .
            FILTER (lang(?authorName) = 'en')
        }}
        """
    try:
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results["results"]["bindings"][0]["authorName"]["value"] if results["results"][
            "bindings"] else "Unknown Author"
    except Exception as e:
        print(f"Error querying author {author_uri}: {e}")
        return "Unknown Author"

def fetch_article_details(article_id):
    query =(f"""
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX schema: <http://schema.org/>
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?article ?title ?author ?date ?language ?pages ?subject ?source ?url ?image ?video ?description WHERE {{
        wd:{article_id} wdt:P31 wd:Q13442814 ;
                       rdfs:label ?title ;
                       wdt:P18 ?image ;
                       wdt:P50 ?author ;
        OPTIONAL {{ wd:{article_id} schema:description ?description }} 
        OPTIONAL {{ wd:{article_id} wdt:P921 ?subject }}
        OPTIONAL {{ wd:{article_id} wdt:P1104 ?pages }}
        OPTIONAL {{ wd:{article_id} wdt:P577 ?date }}
        OPTIONAL {{ wd:{article_id} wdt:P364 ?language }}
        OPTIONAL {{ wd:{article_id} wdt:P1433 ?source }}
        OPTIONAL {{ wd:{article_id} wdt:P856 ?url }}
        OPTIONAL {{ wd:{article_id} wdt:P1651 ?video }}
        FILTER(LANG(?title) = "en" || LANG(?title) = "es")
    }}
    """)
    try:
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        return sparql.query().convert()
    except QueryBadFormed as e:
        print(f"Error in SPARQL query for article {article_id}: {e}")
        return {"results": {"bindings": []}}
    except Exception as e:
        print(f"General error fetching article details {article_id}: {e}")
        return {"results": {"bindings": []}}

def detect_language(text):
    try:
        return detect(text)
    except:
        return "unknown"

with open('articles.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    articles = [row["article"].split("/")[-1] for row in reader]

ontology_prefix = """
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix schema: <http://schema.org/> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix nepr: <http://example.org/nepr/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix iptc: <http://iptc.org/std/> .
@prefix sswt: <http://vocabulary.semantic-web.at/semweb#> .

nepr:Article a rdfs:Class, schema:CreativeWork ;
    rdfs:label "Online Newspaper Article" ;
    rdfs:comment "Represents an online newspaper article with metadata and multimedia content." .

nepr:Multimedia a rdfs:Class ;
    rdfs:label "Multimedia Content" ;
    rdfs:comment "Represents images, videos, and other multimedia content associated with articles." .

nepr:Article dcterms:title schema:headline ;
           dcterms:creator schema:author ;
           dcterms:date schema:datePublished ;
           dcterms:language schema:inLanguage ;
           dcterms:subject skos:Concept ;
           schema:about sswt:Concept ;
           schema:contentUrl schema:url ;
           schema:image schema:image ;
           schema:video schema:video ;
           schema:description schema:description ;
           schema:publisher schema:publisher ;
           schema:license schema:license .
"""
processed_articles = set()
triples = []
for article_id in articles:
    time.sleep(1)
    article_details = fetch_article_details(article_id)
    for result in article_details["results"]["bindings"]:
        title = result.get("title", {}).get("value", "")
        language = result.get("language", {}).get("value", "") or detect_language(title)
        article_key = (article_id, title, language)

        if article_key in processed_articles:
            continue
        processed_articles.add(article_key)

        author = result.get("author", {}).get("value", "")
        author_name = fetch_author_name(author)
        date = result.get("date", {}).get("value", "")
        pages = result.get("pages", {}).get("value", "")
        subject = result.get("subject", {}).get("value", "")
        source = result.get("source", {}).get("value", "")
        url = result.get("url", {}).get("value", "")
        image = result.get("image", {}).get("value", "")
        video = result.get("video", {}).get("value", "")
        description = result.get("description", {}).get("value", "")

        article_uri = f"nepr:{article_id}"
        triples.append(f"""
{article_uri} a nepr:Article ;
                 schema:headline "{title}" ;
                 dcterms:creator <{author}> ;
                 dcterms:date "{date}"^^xsd:dateTime ;
                 dcterms:language "{language}" ;
                 schema:contentUrl <{url}> ;
                 schema:image <{image}> ;
                 schema:video <{video}> ;
                 dcterms:subject <{subject}> ;
                 schema:description "{description}" ;
                 prov:wasGeneratedBy nepr:SourceActivity ;
                 prov:wasAttributedTo nepr:Author .

nepr:SourceActivity a prov:Activity ;
                  prov:used <{source}> ;
                  prov:generated {article_uri} .

nepr:Author a schema:Person ;
          schema:sameAs <{author}> ;
          schema:name "{author_name}" .
""")
        print(f"Processed: {article_id} - {title} ({language})")

with open('ontology_output.ttl', 'w', encoding='utf-8') as out_file:
    out_file.write(ontology_prefix)
    out_file.writelines(triples)

print("The ontology has been successfully generated in 'ontology_output.ttl'.")