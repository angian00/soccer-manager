#!/bin/sh

http -v POST http://localhost:3000/api/league/create < createLeague.json

