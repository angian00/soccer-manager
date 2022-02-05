#!/bin/sh

leagueId=9

http -v GET http://localhost:3000/api/league/${leagueId}

