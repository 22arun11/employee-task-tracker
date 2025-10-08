# Use the official .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:9.0

# Set the working directory
WORKDIR /app

# Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the application code
COPY . .

# Expose port 80
EXPOSE 80

# Set environment variables for development
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:80
ENV DOTNET_USE_POLLING_FILE_WATCHER=true

# Start the application with hot reload
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:80"]