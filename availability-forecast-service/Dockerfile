# 1. Imagen base
FROM python:3.14

# 2. Copia 'uv'
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 3. Directorio de trabajo
WORKDIR /app

# 4. Copia SÓLO el archivo de requisitos
COPY requirements.txt .

# 5. Instala los paquetes en el "SISTEMA" del contenedor
#    (La bandera --system es la clave)
RUN uv pip install -r requirements.txt --no-cache --system

# 6. Copia el RESTO de tu código (main.py, etc.)
COPY . .

# 7. Expone el puerto
EXPOSE 5000

# 8. Corre 'flask' directamente (SIN 'uv run')
CMD ["flask", "run", "--host=0.0.0.0"]