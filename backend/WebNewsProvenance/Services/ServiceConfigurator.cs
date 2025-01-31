using Microsoft.Extensions.Options;
using WebNewsProvenance.Services.Queries;
using WebNewsProvenance.Services.Queries.Contracts;
using WebNewsProvenance.Services.Sparql;
using WebNewsProvenance.Services.Sparql.Contracts;

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
            services.AddScoped<IStatisticsQueries, StatisticsQueries>();
            services.AddScoped<IStatisticsService, StatisticsService>(provider =>
            {
                var options = provider.GetRequiredService<IOptions<AppSettings>>();
                var statisticsQueries = provider.GetRequiredService<IStatisticsQueries>();
                return new StatisticsService(options, statisticsQueries);
            });
        }
    }
}
