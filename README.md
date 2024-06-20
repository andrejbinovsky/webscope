# what can be improved

- pre-commit hooks
- python ruff linter
- endless fetching + pagination (BE DRF + tanstack query)
- about the test (with more time I would)
    - use drf tests
    - validate the auth tokens
    - test the frontend with playwright or similar tool

# how to run the project

```bash
# create .env.backend & env.frontend files in root from templates
$ docker-compose up
# create user in docker
# implicit credentials: email:admin@admin.com / pass:admin
$ docker-compose exec api python src/manage.py create_user
# enjoy the app on http://localhost:3000 
```

# how to run the tests

```bash
$ docker-compose exec api python src/manage.py test core.tests
```

# time spent

- approx. 10.5 hours
- should be less, but I decided to make frontend auth with some styling + dockerization 
