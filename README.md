Light GIF javascript search-engine
======

This small project aims to be a standalone and ridiculously easy to install web page, which can be used
to perform a quick search on the [Giphy](http://giphy.com/) API to find awesome GIFs.

![Screenshot](https://github.com/Swop/GliphySearch/raw/master/doc/GiphySearchScreen.png)

Installation
------------

Nothing is needed to install this web app.

Simply download/clone the project and open the main page (`index.html`).
No need to fetch some dependencies or setup a server of any kind.

Usage
-------------

Enter some terms in the input box, and press enter.
The result set will display immediately, and the next page results will be lazy-loaded if you jump to the bottom of the page.

For each result, you can :

- Hover on the still image to load a light version of the GIF and see the pixels moving around
- Download the full-size GIF directly by clicking on the down arrow (works only on browser supporting the "download" attribute on links.)
- If you click on the "link" button, the full-size GIF URL will be selected for you, enables you to copy-paste it somewhere else. 

Contributing
------------

Feel free to make any improvement of any kind ;-)

Limitations
----------------------

For now, the Gliphy API key used in this code is the public one.
This API key is for development purpose only. If you plan to use this project in production (a.k.a. a lot of requests), please ask Gliphy to generate a dedicated API key just for you.
