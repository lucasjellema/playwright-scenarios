FROM zenika/alpine-chrome:with-playwright
ADD app.js /usr/src/app/src 
ADD translate.js /usr/src/app/src 
# Install hotwrap binary in the container
COPY --from=fnproject/hotwrap:latest  /hotwrap /hotwrap
CMD "node /usr/src/app/src/app.js"
# hotwrap is the executable in the container; 
# it invokes the CMD and passes any input (sent in the Fn request) on the standard input 
# any output written to standard output while executing the CMD is returned by hotwrap in the Fn response
ENTRYPOINT ["/hotwrap"]