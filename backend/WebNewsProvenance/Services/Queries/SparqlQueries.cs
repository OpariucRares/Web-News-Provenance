﻿using WebNewsProvenance.Models;
using WebNewsProvenance.Services.Queries.Contracts;
using static System.Net.WebRequestMethods;

namespace WebNewsProvenance.Services.Queries
{
    public class SparqlQueries : ISparqlQueries
    {
        public string GetAllNamespacesQuery { get; } = @"
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX schema: <http://schema.org/>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX nepr: <http://52.178.129.69:7008/api/Sparql/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX iptc: <http://iptc.org/std/>
        PREFIX sswt: <http://vocabulary.semantic-web.at/semweb#>    
        ";

        public string GetAllArticlesCardPagination(int limit, int offset)
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT ?article ?headline ?image ?description
            WHERE {{
            ?article a nepr:Article ;
                     schema:headline ?headline ;
                     schema:description ?description ;
                     schema:image ?image .
            }}
            LIMIT {limit} OFFSET {offset}";
        }
        public string GetAllArticlesCardFilterPagination(int limit, int offset, Filter filter)
        {
            var filters = new List<string>();
            var properties = new List<string>();

            if (!string.IsNullOrEmpty(filter.Language))
            {
                properties.Add("dcterms:language ?language");
                filters.Add($"FILTER(LCASE(?language) = LCASE(\"{filter.Language}\"))");
            }

            if (filter.StartDate.HasValue)
            {
                filters.Add($"FILTER(?date >= \"{filter.StartDate.Value:yyyy-MM-ddTHH:mm:ssZ}\"^^xsd:dateTime)");
            }
            if (filter.EndDate.HasValue)
            {
                filters.Add($"FILTER(?date <= \"{filter.EndDate.Value:yyyy-MM-ddTHH:mm:ssZ}\"^^xsd:dateTime)");
            }
            if (filter.StartDate.HasValue || filter.EndDate.HasValue)
            {
                properties.Add("dcterms:date ?date");
            }

            if (filter.HasImages.HasValue && filter.HasImages.Value)
            {
                properties.Add("schema:image ?image");
                filters.Add("FILTER(BOUND(?image))");
            }

            if (!string.IsNullOrEmpty(filter.Subject))
            {
                properties.Add("dcterms:subject ?subject");
                filters.Add($"FILTER(CONTAINS(LCASE(STR(?subject)), LCASE(\"{filter.Subject}\")))");
            }

            if (!string.IsNullOrEmpty(filter.AuthorName))
            {
                properties.Add("dcterms:creator ?creator . ?author a schema:Person ; schema:sameAs ?creator ; schema:name ?authorName");
                filters.Add($"FILTER(CONTAINS(LCASE(?authorName), LCASE(\"{filter.AuthorName}\")))");
            }

            for (int i = 0; i < properties.Count; i++)
            {
                if (i == properties.Count - 1)
                {
                    properties[i] = properties[i] + " .";
                }
                else
                {
                    properties[i] = properties[i] + " ;";
                }
            }
            var filterString = string.Join(" . ", filters);
            var propertiesString = string.Join(" ", properties);

            return $@"
            PREFIX dcterms: <http://purl.org/dc/terms/>
            PREFIX schema: <http://schema.org/>
            PREFIX prov: <http://www.w3.org/ns/prov#>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX nepr: <http://52.178.129.69:7008/api/Sparql/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX iptc: <http://iptc.org/std/>
            PREFIX sswt: <http://vocabulary.semantic-web.at/semweb#>

            SELECT ?article ?headline ?image ?description
            WHERE {{
                ?article a nepr:Article ;
                         schema:headline ?headline ;
                         schema:description ?description ;
                         schema:image ?image ;
                        {propertiesString}
                        {filterString}
            }}
            LIMIT {limit} OFFSET {offset}";
        }

        public string GetAllArticlesBySearchPagination(int limit, int offset, string search)
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT ?article ?headline ?image ?description
            WHERE {{
            ?article a nepr:Article ;
                     schema:headline ?headline ;
                     schema:description ?description ;
                     schema:image ?image .
            FILTER(CONTAINS(LCASE(?headline), LCASE(""{search}"")) || CONTAINS(LCASE(?description), LCASE(""{search}"")))
            }}
            LIMIT {limit} OFFSET {offset}";
        }

        public string GetAnArticleById(string id)
        {
            string baseUri = "http://52.178.129.69:7008/api/Sparql/";

            return $@"
            {GetAllNamespacesQuery}
            SELECT ?article ?headline ?creator ?date ?language ?contentUrl ?image ?description ?author ?authorName ?url ?video ?subject
            WHERE {{
            BIND(<{baseUri}{id}> AS ?article)
            ?article a nepr:Article ;
                   schema:headline ?headline ;
                   dcterms:creator ?creator ;
                   dcterms:date ?date ;
                   dcterms:language ?language ;
                   dcterms:subject ?subject ;
                   schema:contentUrl ?contentUrl ;
                   schema:image ?image ;
                   schema:description ?description ;
                   prov:wasAttributedTo ?author ;
                   schema:url ?url;
                   schema:video ?video .  
            ?author a schema:Person ;
                schema:sameAs ?creator ;
                schema:name ?authorName .
            }}";
        }
        public string GetRecommendedArticlesCardPagination(string category, int limit)
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT ?article ?headline ?image ?description
            WHERE {{
            ?article a nepr:Article ;
                     schema:headline ?headline ;
                     schema:description ?description ;
                     schema:image ?image ;
                     dcterms:subject iptc:{category} .
            }}
            LIMIT {limit}
            ";
        }
    }
}
