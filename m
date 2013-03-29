#!/bin/bash

# mizar building
#mizf text/lambda.miz > mizf-output
#grep Parser   mizf-output | tail -c 26 >  mizf-output-summary
#grep Analyzer mizf-output | tail -c 27 >> mizf-output-summary
#grep Checker  mizf-output | tail -c 20 >> mizf-output-summary
#notify-send "lambda.miz" "`cat mizf-output-summary`"
#cat mizf-output-summary

mizf text/lambda.miz
notify-send 'Done!'

# docs building
docco text/lambda.miz --output text --layout proof-assistants
docco dict/lambda.voc --output dict --layout proof-assistants

