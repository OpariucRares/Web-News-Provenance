using WebNewsProvenance.Models;

namespace WebNewsProvenance.Services
{
    public interface ICreativeWorkService
    {
        List<CreativeWork> MapToCreativeWorks(SparqlResponse sparqlResult);
    }
}
