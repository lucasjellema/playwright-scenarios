# Create an OCI Function that leverages Playwright

Playwright requires the installation of suitable binary files. That means that just any Docker container with a simple npm install on a package.json that contains a Playwright reference is not enough. A special Docker image needs to be crafted. Fortunately, this image is already available: the Zenika Alpine Headless Chrome image . However, in order to create an OCI Function (Fn function) from this special container image, we need to do something slightly more advanced than we normally need to do when creating an Fn function. We create our own custom container image - based on the Zenika image - add the Node application sources for the function as well as the func.yaml and the Fn [*hotwrap*](https://github.com/fnproject/hotwrap) utility.  

This *hotwrap* provides the bridge at runtime between the OCI Functions Fn server framework and the custom code in the container image for the function. Hotwrap takes the input from the function request and makes it available to our custom code via the standard input. Anything the custom application writes to the standard output is takes by hotwrap and returned as the function's response. Additionally, hotwrap makes HTTP headers sent in the function request available as environment variables inside the container.

## Create a Translate Function using Playwright and Google Translate

in OCI Console cloud shell

(https://console.us-ashburn-1.oraclecloud.com/functions/apps/ocid1.fnapp.oc1.iad.aaaaaaaaagfgkyy7gu55hlgq535qeigsqh2dbyxipk4ij7qdrjtf757ymjca?cloudshell=true)


Create a new directory that will contain the function:

mkdir pw-function


copy these files to this directory:

* Dockerfile
* func.yaml
* app.js
* translate.js

Note: Execute the following commands from within the directory

Optionally build the container for the function
`fn -v build`

Build and deploy the function to the application (and the container as well to the registry);
`fn deploy --app lab1` 

List the functions:
`fn list functions lab1`

Invoke the function:
`echo -n '{"sourceLanguage":"en", "targetLanguage":"fr", "text":"Hello World"}' | fn invoke lab1 playwright --content-type application/json`

And again:
`echo -n '{"sourceLanguage":"en", "targetLanguage":"nl", "text":"Hello Beautiful New World In The Morning"}' | fn invoke lab1 playwright --content-type application/json`


Note: the container can also be built in a normal way:
`docker build . -t my-playwright`

However, the hotwrap utility makes it virtually impossible to run the container in a normal way. To check the correct composition and functioning of the container, temporary remove hotwrap from Dockerfile and rebuild the container.
Then run it:
`docker run -it my-playwright  /bin/sh`


## Resources

https://github.com/fnproject/hotwrap
https://fnproject.io/tutorials/docker/CustomLinuxContainer/

Alpine Chrome project on GitHub for *Chrome running in headless mode in a tiny Alpine image*:
https://github.com/Zenika/alpine-chrome/tree/master/with-playwright

Alpine Chrome on Docker Hub - with images for running Playwright applications
https://hub.docker.com/r/zenika/alpine-chrome

Article on Medium "Crafting the perfect container to play with a Headless Chrome" https://medium.zenika.com/crafting-the-perfect-container-to-play-with-a-headless-chrome-d920ec2f3c9b

Microsoft's Offical Playwright Container on GitHub - https://github.com/microsoft/playwright/tree/master/docs/docker (this was a source of inspiration for the Zenika image)