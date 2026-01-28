FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/AIProductionAPI.Web/AIProductionAPI.Web.csproj", "AIProductionAPI.Web/"]
COPY ["src/AIProductionAPI.Application/AIProductionAPI.Application.csproj", "AIProductionAPI.Application/"]
COPY ["src/AIProductionAPI.Domain/AIProductionAPI.Domain.csproj", "AIProductionAPI.Domain/"]
COPY ["src/AIProductionAPI.Infrastructure/AIProductionAPI.Infrastructure.csproj", "AIProductionAPI.Infrastructure/"]
RUN dotnet restore "AIProductionAPI.Web/AIProductionAPI.Web.csproj"

COPY src/ .
WORKDIR "/src/AIProductionAPI.Web"
RUN dotnet build "AIProductionAPI.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AIProductionAPI.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AIProductionAPI.Web.dll"]
