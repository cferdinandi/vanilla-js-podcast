---
title: {{ .TranslationBaseName | replaceRE "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-" "" | humanize }}
date: {{ delimit (findRE "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]" .TranslationBaseName 1) "" }}T10:30:00{{ dateFormat "-07:00" .Date }}
draft: false
description: In today’s episode, I talk about
episode:
file:
duration: 00:00:00
length:
---

## Links