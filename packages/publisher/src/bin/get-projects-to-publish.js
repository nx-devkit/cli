#!/usr/bin/env node
require("ts-node").register({ cwd: __dirname, });
require('../lib/publisher').printProjectsToPublish();

