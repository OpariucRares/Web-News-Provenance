import csv
import time
from googletrans import Translator
import spacy
from langdetect import detect
from SPARQLWrapper import SPARQLWrapper, JSON

sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
nlp = spacy.load("en_core_web_sm")
translator = Translator()

def fetch_author_name(author_uri):
    query = f"""
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?authorName WHERE {{
            <{author_uri}> rdfs:label ?authorName .
            FILTER (lang(?authorName) = 'en' || lang(?authorName) = '')
        }}
        """
    try:
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results["results"]["bindings"][0]["authorName"]["value"] if results["results"]["bindings"] else "Unknown Author"
    except Exception as e:
        print(f"Error querying author {author_uri}: {e}")
        return "Unknown Author"

def detect_language(text):
    try:
        return detect(text)
    except:
        return "unknown"


def translate_title(title):
    try:
        translated = translator.translate(title, dest='en')
        return translated.text
    except Exception as e:
        print(f"Error translating title: {e}")
        return title


def categorize_article(title):
    translated_title = translate_title(title)
    doc = nlp(translated_title)
    for ent in doc.ents:
        if ent.label_ == "MONEY" or ent.text.lower() in ["economy", "finance", "market", "business"]:
            return "Economy"
        elif ent.label_ == "ORG" or ent.text.lower() in ["technology", "tech", "innovation", "science"]:
            return "Technology"
        elif ent.label_ == "EVENT" or ent.text.lower() in ["sports", "game", "tournament", "league"]:
            return "Sports"
        elif ent.label_ == "GPE" or ent.text.lower() in ["politics", "election", "government", "policy"]:
            return "Politics"
        elif ent.label_ == "PERSON" or ent.text.lower() in ["health", "medicine", "wellness", "fitness"]:
            return "Health"
        elif ent.label_ == "WORK_OF_ART" or ent.text.lower() in ["entertainment", "celebrity", "movie", "music"]:
            return "Entertainment"
        elif ent.label_ == "FAC" or ent.text.lower() in ["education", "learning", "school", "university"]:
            return "Education"
        elif ent.label_ == "LOC" or ent.text.lower() in ["environment", "climate", "nature", "sustainability"]:
            return "Environment"
        elif ent.label_ == "NORP" or ent.text.lower() in ["culture", "art", "history", "heritage"]:
            return "Culture"
        elif ent.label_ == "GPE" or ent.text.lower() in ["travel", "tourism", "destination", "adventure"]:
            return "Travel"
    return "Other"


ontology_prefix = """
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix schema: <http://schema.org/> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix nepr: <https://opariucrares.github.io/Web-News-Provenance/article/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix iptc: <http://iptc.org/std/> .
@prefix sswt: <http://vocabulary.semantic-web.at/semweb#> .

nepr:Article a rdfs:Class, schema:CreativeWork ;
    rdfs:label "Online Newspaper Article" ;
    rdfs:comment "Represents an online newspaper article with metadata and multimedia content." ;
    dcterms:title schema:headline ;
    dcterms:creator schema:author ;
    dcterms:date schema:datePublished ;
    dcterms:language schema:inLanguage ;
    dcterms:subject skos:Concept ;
    schema:about sswt:Concept ;
    schema:url schema:url ;
    schema:contentUrl schema:fullWorkURL ;
    schema:image schema:image ;
    schema:video schema:video ;
    schema:description schema:description ;
    schema:publisher schema:publisher ;
    schema:license schema:license ;
    nepr:pages schema:numberOfPages ;
    nepr:source prov:used ;
    nepr:fullWorkURL schema:fullWorkURL .
"""

processed_articles = set()
triples = []
index = 1
with open('articles.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    articles = list(reader)
    total_articles = len(articles)
    for row in articles:
        time.sleep(1)
        article_id = row["article"].split("/")[-1]
        title = row["title"].replace('"', '\\"')
        author_uri = row["author"]
        author_name = fetch_author_name(author_uri)
        date = row["date"] if row["date"] else "2000-01-01T00:00:00"
        language = row["language"] or detect_language(title)
        pages = row["pages"]
        subject = row["subject"]
        source = row["source"]
        url = row["url"] or f"http://www.wikidata.org/entity/{article_id}"
        image = row["image"]
        video = row["video"]
        description = row["description"] or ""
        fullWorkURL = row["fullWorkURL"]
        category = categorize_article(title)
        creation_date = row["creationDate"] if row["creationDate"] else "2000-01-01T00:00:00"
        last_modified_date = row["lastModifiedDate"] if row["lastModifiedDate"] else "2000-01-01T00:00:00"
        revision_date = row["revisionDate"] if row["revisionDate"] else "2000-01-01T00:00:00"
        editor = row["editor"]
        article_key = (article_id, title, language)
        if article_key in processed_articles:
            continue
        processed_articles.add(article_key)

        # Define URIs
        article_uri = f"nepr:{article_id}_{language}"

        triples.append(f"""
{article_uri} a nepr:Article ;
                             schema:headline "{title}" ;
                             dcterms:creator <{author_uri}> ;
                             dcterms:date "{date}"^^xsd:dateTime ;
                             dcterms:language "{language}" ;
                             dcterms:subject iptc:{category} ;
                             schema:contentUrl <{fullWorkURL}> ;
                             schema:url <{url}> ;
                             schema:image <{image}> ;
                             schema:video <{video}> ;
                             schema:description "{description}" ;
                             nepr:pages "{pages}" ;
                             nepr:source <{source}> ;
                             nepr:fullWorkURL <{fullWorkURL}> ;
                             prov:wasGeneratedBy nepr:SourceActivity ;
                             prov:wasAttributedTo <{author_uri}> ;
                             schema:dateCreated "{creation_date}"^^xsd:dateTime ;
                             schema:dateModified "{last_modified_date}"^^xsd:dateTime ;
                             prov:qualifiedRevision [
                                prov:atTime "{revision_date}"^^xsd:dateTime ;
                                prov:agent <{editor}>
                             ] .

            nepr:SourceActivity a prov:Activity ;
                              prov:used <{source}> ;
                              prov:generated {article_uri} .

            <{author_uri}> a schema:Person ;
                      schema:sameAs <{author_uri}> ;
                      schema:name "{author_name}" .
            """)
        print(f"Processed: {index} / {total_articles} -> {article_id} - {title} ({language})")
        index += 1

    with open('ontology_articles.ttl', 'w', encoding='utf-8') as out_file:
        out_file.write(ontology_prefix)
        out_file.writelines(triples)

    print("The ontology has been successfully generated in 'ontology_articles.ttl'.")