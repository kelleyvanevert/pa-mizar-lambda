all:
	./m
doc:
	docco --output ./ --template ./res/_template.js.html --pass ./res/process-doc.js text/lambda.miz
