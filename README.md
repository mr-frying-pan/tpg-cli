# Introduction
This repository has been forked from [[https://github.com/wo/tpg]] and provides the command line version of
[[https://www.umsu.de/trees]].

If you find [[https://www.umsu.de/trees]] useful, but would like to get its results in a more computer-friendly way,
this repository is what you need.

I tried to keep changes to a minimum, so as not to break what original program does, only added more convenient 
command line interface and output formats.

The only dependency is NodeJs.

# Running

You can run this locally using the following command:
```bash
$ node tpg.js <formula> <accessibility>
```
where `<formula>` is the same formula you'd put in the original generator and `<accessibility>` is a string of the
following characters:
 - `u` – universal (S5)
 - `r` – reflexive
 - `m` – symmetric
 - `t` – transitive
 - `e` – euclidean
 - `s` – serial

For a more detailed explanation of formula syntax and meanings of accessibility constraints see the original proof
generator.

Additional help might be available when passing `-h` or `--help` option.

## Output format

Proofs and counterexamples are printed to stdout in XML format. They are not formatted to be nicely readable, but it
should be possible to parse them using some XML parser.

Proof structure look like this:
```xml
<proof>
    {NODE}+
    {SPLIT}?
</proof>

SPLIT:
<split>
    <col>
        {NODE}+
        {SPLIT}?
    </col>
    <col>
        {NODE}+
        {SPLIT}?
    </col>
</split>

NODE:
<node>
    <num>INT</num>
    <formula>STRING</formula>
    <world>INT</world>
    <from>{ {INT | STRING}{,}? }*</from>
    <closed>BOOL</closed>
</node>
```

Counterexample structure looks like this:
```xml
<counter>
    <worlds>WORLDS</worlds>
    <domain>INTS</domain>
    <constants>
        {CONSTANT}*
    </constants>
    <funcs>
        {FUNC}*
    </funcs>
    <preds>
        {PRED}*
    </preds>
</counter>

CONSTANT:
<constant>
    <name>STRING</STRING>
    <val>INT</val>
</constant>

FUNC:
<func>
    <name>STRING</name>
    <definition>DEFS</definition>
</func>

PRED:
<pred>
    <name>STRING</name>
    <definition>DEFS</definition>
</pred>
```

Here `{X}+` stands for repeating `X` one or more times, `{X}*` repeats `X` zero or more times. `{X}?` means that `X`
is optional there, sometimes it may be there, sometimes not. `{ X | Y }` means that there may be either `X` or `Y`.

`INT` stands for any integer, zero or more, `STRING` for some character string (depends on the context, for example
`<formula></formula>` does not contain arbitrary string, it contains a formula string), `BOOL` encodes a boolean 
value, either `true` or `false`. Structure of `DEFS` is not yet exactly clear, for now it should be a comma 
separated list of pairs (maybe not necessarily?). This will be updated in the future.

[//]: # (TODO: review output format)

## Debugging information

Not yet implemented :(

## Tests

Not yet implemented :(

# Issues

If you encounter any problems, please check if you get the same problems using the original prover with the same
inputs. If yes, then problem is there, if no, then please open an issue here, I'll try to fix.

# Copyright

Copyright © 2001-2021 Wolfgang Schwarz (wo@umsu.de) – original proof generator
Copyright © 2021 Andrius Maliuginas – CLI interface

You may use, distribute and modify this code under the terms of the GPLv3 license; see LICENSE.
