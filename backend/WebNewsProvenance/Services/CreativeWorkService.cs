using WebNewsProvenance.Models;

namespace WebNewsProvenance.Services
{
    public class CreativeWorkService : ICreativeWorkService
    {
        public List<CreativeWork> MapToCreativeWorks(SparqlResponse sparqlResult)
        {
            var creativeWorks = new List<CreativeWork>();

            foreach (var result in sparqlResult.Results.Bindings)
            {
                var creativeWork = new CreativeWork
                {
                    Headline = result.Headline?.Value,
                    Author = new Person { Name = result.AuthorName?.Value },
                    DatePublished = DateTime.Parse(result.DatePublished?.Value),
                    Language = result.Language?.Value,
                    WordCount = int.Parse(result.WordCount?.Value),
                    About = result.About?.Value,
                    AssociatedMedia = new List<MediaObject>
                    {
                        new MediaObject
                        {
                            ContentUrl = result.MediaUrl?.Value,
                            Caption = result.MediaCaption?.Value,
                            EncodingFormat = result.MediaFormat?.Value
                        }
                    },
                    Publisher = new Organization
                    {
                        Name = result.PublisherName?.Value,
                        Url = result.PublisherUrl?.Value
                    }
                };

                creativeWorks.Add(creativeWork);
            }

            return creativeWorks;
        }
    }
}
