<p align="center">
  <a href="https://www.vegaitglobal.com/" target="blank"><img src="https://www.vegaitglobal.com/media/kemh5m2d/vegait_logo_white.png?quality=60" width="200" alt="Vega Logo" /></a>
</p>

<h1 align='center'>MaxOptra Loader-App Backend Server</h1>
<p align='center'>gRPC demo backend server for mobile app</p>


<h2>Contents:</h2>

1. [Introduction](#introduction)

2. [Usage](#usage)

3. [Configuration](#configuration)


<h2 id='introduction'>Introduction</h2>

This is a demo backend server utilizing the gRPC protocol developed in NestJS for the purpose of testing a mobile application.
This server's endpoints are described with protofiles located [here](https://github.com/jovandrobnjak/maxoptra-proto-files).

<h2 id='usage'>Usage</h2>

```bash
$ git clone git@github.com:jovandrobnjak/maxoptra-loader-app-backend.git
$ docker compose up --build
```

<h2 id='configuration'>Configuration</h2>

Needed environment configuration is:
```python
POSTGRES_PASSWORD=[UPDATE-VALUE]
POSTGRES_DATABASE=[UPDATE-VALUE]
POSTGRES_USER=[UPDATE-VALUE]
POSTGRES_PORT=[UPDATE-VALUE]
POSTGRES_HOST=[UPDATE-VALUE]
GITHUB_TOKEN=[UPDATE-VALUE]
```
GITHUB_TOKEN is needed to pull the protofiles from the repository pre-build.
