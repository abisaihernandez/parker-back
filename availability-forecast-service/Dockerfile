FROM python:3.14
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy application code
COPY . .

# Expose Flask default port
EXPOSE 5000

# Run the Flask app
CMD ["uv", "run", "flask", "run"]
