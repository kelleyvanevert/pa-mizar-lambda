# A Mizar formalization of lambda terms, beta reduction and conversion

This is a small formalization project for Freek's [course](cs.ru.nl/~freek/courses/pa-2013/) on proof assistants. For the exercise description, refer to [exercise-mizar.pdf](exercise-mizar.pdf?raw=true).

* Mizar version: 7.12.01
* MML version 4.166.1132

### `TL;DR` Contents of the formalization

* __Lambda terms__ are encoded as their abstract syntax trees, with named (natural number) variables, as a mode `LambdaTerm` = `LambdaTerm-like DecoratedTree of NAT`.
* A lot of helper results, definitions and functions for (1) constructing new terms from old ones using tools for `DecoratedTree`s; (2) proving that these are still `LambdaTerm`s; and (3) extracting information from terms (AST inspection stuff).
* __Beta reduction__ and __~ conversion__ formalized as binary predicates `->beta`, `->beta*`, and `=beta` on `LambdaTerm`s.
