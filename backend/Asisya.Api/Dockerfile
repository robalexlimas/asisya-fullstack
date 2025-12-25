FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

ENV NUGET_PACKAGES=/root/.nuget/packages

COPY backend/Asisya.Api/Asisya.Api.csproj backend/Asisya.Api/
COPY backend/Asisya.Application/Asisya.Application.csproj backend/Asisya.Application/
COPY backend/Asisya.Domain/Asisya.Domain.csproj backend/Asisya.Domain/
COPY backend/Asisya.Infrastructure/Asisya.Infrastructure.csproj backend/Asisya.Infrastructure/

RUN dotnet restore backend/Asisya.Api/Asisya.Api.csproj

COPY backend/ backend/

WORKDIR /src/backend/Asisya.Api

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Asisya.Api.dll"]