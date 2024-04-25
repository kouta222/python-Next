FROM python:3.6-slim-buster

WORKDIR /app

COPY requirements.txt ./

RUN apt-get update && \
    apt-get install -y gcc libpq-dev
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 4000

CMD ["flask","run","--host=0.0.0.0","--port=4000"]