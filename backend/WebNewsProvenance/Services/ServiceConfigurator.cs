using Microsoft.Extensions.Options;
using WebNewsProvenance.Services.Queries;
using WebNewsProvenance.Services.Sparql;

namespace WebNewsProvenance.Services
{
    public static class ServiceConfigurator
    {
        public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
        {
            //TODO: check these services if they are defined correctly
            services.Configure<AppSettings>(configuration);
            services.AddControllers();
            services.AddHttpClient();
            services.AddScoped<ISparqlQueries, SparqlQueries>();
            services.AddScoped<ISparqlService, SparqlService>(provider =>
            {
                var options = provider.GetRequiredService<IOptions<AppSettings>>();
                var sparqlQueries = provider.GetRequiredService<ISparqlQueries>();
                return new SparqlService(options, sparqlQueries);
            });
        }
    }
}
