# Single-image deploy: builds the Vite frontend, then the ASP.NET Core backend,
# and serves the frontend's static build directly from the backend (same origin,
# no CORS to configure in production, only one service to deploy/host).

FROM node:22-alpine AS frontend-build
WORKDIR /src/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src
COPY backend/ManagerCompass.Api/ ./ManagerCompass.Api/
COPY --from=frontend-build /src/frontend/dist ./ManagerCompass.Api/wwwroot
RUN dotnet publish ManagerCompass.Api/ManagerCompass.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=backend-build /app/publish .
# Explicitly copied rather than relying on publish's content-copy rules, so both
# the processed JSON and the real source documents are guaranteed to be present.
COPY backend/ManagerCompass.Api/Assets ./Assets

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ManagerCompass.Api.dll"]
