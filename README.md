# PG Sanitize

We used this libary for prevention our production SQL statement.
Just need to purify SQL Query befor send it to execution method.

## How to used

```Type Script
 import { sanitizeSQL } from 'pg-sanitize'
 let SQL = 'SELECT * from username; DROP TABLE username'
 SQL = sanitizeSQL(SQL);
 
 // This helper is not remove DROP TABLE but Query will be exception beacuse syntax is not correct.
```
