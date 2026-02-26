---
title: "Cómo desplegar Traefik con Docker Compose"
slug: desplegar-traefik-docker-compose
excerpt: "Guía paso a paso para configurar Traefik como reverse proxy con SSL automático usando Docker Compose"
tags: [docker, traefik, server]
difficulty: intermediate
language: ES
cover_image: 
author: David López
---

## Introducción

Traefik es un reverse proxy y load balancer moderno diseñado para microservicios. En esta guía veremos cómo configurarlo con Docker Compose.

## Requisitos previos

- Docker y Docker Compose instalados
- Un dominio apuntando a tu servidor
- Puertos 80 y 443 abiertos

## Configuración

### 1. Crear el archivo `docker-compose.yml`

```yaml
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
```

### 2. Configurar SSL con Let's Encrypt

Añade las siguientes líneas al comando de Traefik:

```yaml
      - "--certificatesresolvers.letsencrypt.acme.email=tu@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
```

## Conclusión

Con esta configuración básica ya tienes Traefik funcionando como reverse proxy con SSL automático. En próximos artículos veremos cómo añadir servicios y middleware.
