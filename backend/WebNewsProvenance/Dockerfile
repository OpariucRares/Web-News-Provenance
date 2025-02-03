FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 7008

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["WebNewsProvenance.csproj", "."]
RUN dotnet restore "WebNewsProvenance.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "WebNewsProvenance.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebNewsProvenance.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebNewsProvenance.dll", "--urls=https://0.0.0.0:7008"]
