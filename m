#!/bin/bash

functors='s/^ *func (?:\([^\)]*\))?([^\(]+).*$/O$1/'
selectors='s/^ *([a-zA-Z]+) ->.*$/U$1/'
structures='s/^ *struct ([a-zA-Z-]+).*$/G$1/'
attributes='s/^ *attr [a-zA-Z] is (?:(?:[a-zA-Z],)*[a-zA-Z](?=-))?([a-zA-Z-]+) .*$/V$1/'
modes='s/^ *mode ([a-zA-Z-]+).*$/M$1/'
predicates='s/^ *pred (?:[a-zA-Z] )*([^ ]{2,}) .*$/R$1/'

# record the following to the vocabulary file...
{
  echo "::: # Lambda calculus"
  echo "::: (This file was automatically created.)"
  for x in "functors" "selectors" "structures" "attributes" "modes" "predicates"; do
    echo ""
    # Print section title, capitalized
    echo "::: ## `echo $x | sed -e 's/^./\U&\E/g'`"
    # Print the perl command used below
    echo "::: \`perl -ne \"${!x} && print\" text/lambda.miz | sort -u\`"
    perl -ne "${!x} && print" text/lambda.miz | sort -u
  done
} > dict/lambda.voc

mizf text/lambda.miz

# docs building
#cd /opt/node/lib/node_modules/docco
#cake build
#cd /home/kelley/studie/proof_assistants/ex
docco text/lambda.miz --output text --layout proof-assistants
docco dict/lambda.voc --output dict --layout proof-assistants

#dokko -v */lambda.{miz,voc}