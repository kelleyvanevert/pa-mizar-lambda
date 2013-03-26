#!/bin/bash
docco text/lambda.miz

mizf text/lambda.miz > mizf-output
grep Parser   mizf-output | tail -c 26 >  mizf-output-summary
grep Analyzer mizf-output | tail -c 27 >> mizf-output-summary
grep Checker  mizf-output | tail -c 20 >> mizf-output-summary
notify-send "lambda.miz" "`cat mizf-output-summary`"
cat mizf-output-summary

docco text/lambda.miz
