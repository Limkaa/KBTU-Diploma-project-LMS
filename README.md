# KBTU Diploma work

This repository contains a thesis under the undergraduate program of the Faculty of Information Technology in the specialty "Information Systems" at the University of the Kazakh-British Technical University (KBTU).

### The project was made by:

-   Alim Khamraev (captain)
-   Aizar Bilyalov
-   Amina Farabi
-   Ayazhan Utemurat

### Project description

The project is a platform for teachers and students of educational institutions. It provides functionality for effective management and study of subjects. In addition to the website, a telegram bot will also be available in order to make interaction with the platform even easier, allowing you to view useful information and receive various notifications

### Technical stack for working on the project:

-   Backend: Django, Django Rest Framework, PostresSQL, Redis, Celery
-   Telegram bot: aiogram python library
-   Frontend: React, Redux
-   Containerization: Docker, docker-compose
-   Versioning system: git (github)

## Run Locally

Clone the project

```bash
  git clone https://github.com/Limkaa/KBTU-Diploma-project-LMS
```

Go to the project directory

```bash
  cd KBTU-Diploma-project-LMS
```

Before proceeding, make sure you have Docker installed. Next enter the command

```bash
  docker-compose build
```

Start the project

```bash
  docker-compose up
```

If you want to start only specific services, just name them like that (services names can be viewed in docker-compose.yml file)

```bash
  docker-compose up db django react
```
