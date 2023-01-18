## Hexlet tests and maintenance:
[![Actions Status](https://github.com/vlad1slove1/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/vlad1slove1/frontend-project-11/actions)
[![Node.js CI](https://github.com/vlad1slove1/frontend-project-11/actions/workflows/node.js.yml/badge.svg)](https://github.com/vlad1slove1/frontend-project-11/actions/workflows/node.js.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/214d2ddaf64b57c6df8a/maintainability)](https://codeclimate.com/github/vlad1slove1/frontend-project-11/maintainability)

## Description:

The following repository contains RSS aggregator. Using this aggregator, you can easilly read posts from unlimited amount of feeds at once. RSS aggregator reloading all sources automatically every 5s and pushing new posts to template.

## Stack:

- native JavaScript (ES6)
- pure DOM + HTML
- MVC development
- bootstrap + styles
- Axios
- yup validation
- i18next
- webpack
- vercel deployment

## Setup:

1) Fork this repo by SSH key:

```
git@github.com:vlad1slove1/frontend-project-11.git
```

2) Install depencies:

```sh
make install
```

3) Open webpack's develop page:

```sh
make develop
```

4) Build project:

```sh
make build
```

5) Check linter:

```sh
make lint
```

## Demo link:
[RSS-aggregator](https://frontend-project-11-navy.vercel.app/)
