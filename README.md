# Chassis Yeoman Generator
> Generate a new [Chassis](http://chassis.io) project.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-chassis-wp using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-chassis-wp
```

Then generate your new project and follow the prompts.

```bash
yo chassis-wp
```

You can also bypass installing the packages globally and start the generator in a single command by using npm 5's [npx](https://www.npmjs.com/package/npx) command
```bash
npx -p yo -p generator-chassis-wp -c yo chassis-wp
```

## What happens during installation?

When running the generator, you will be prompted for

 * Project name. Used for folder name where the project gets scaffolded.
 * PHP Version. 
 * If multisite should be enabled.
 * Which [extensions](http://docs.chassis.io/en/latest/extend/) to automatically enable. 

 All options, except for project name, will be saved as the default for the next generation you do.

## Options

| Flag             | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `--skip-vagrant` |  Will skip bringing newly created project up via Vagrant.      |
| `--defaults`     |  Will skip all options except name and use the saved defaults. |
