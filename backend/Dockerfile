FROM python:3.8

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend/django

COPY requirements.txt /app/backend/django
RUN pip install -r requirements.txt

COPY . /app/backend/django

CMD [ "python", "src/manage.py", "runserver", "0.0.0.0:8000" ]