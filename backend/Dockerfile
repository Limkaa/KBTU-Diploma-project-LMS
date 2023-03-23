FROM python:3.9.10

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend
COPY . /app/backend

RUN pip install -r requirements.txt

CMD [ "python", "src/manage.py", "runserver", "0.0.0.0:8080" ]