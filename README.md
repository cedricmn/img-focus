# img-focus
> Responsive photo gallery

A lightweight set of web components to display un-croped pictures.

![img-focus](https://raw.githubusercontent.com/cedricmn/img-focus/main/img-focus.png)

## Getting started

Install web components through your package manager:
```shell
npm install img-focus
```

You can also download [dist/img-focus.js](https://github.com/cedricmn/img-focus/blob/main/dist/img-focus.js) file.

Import [dist/img-focus.js](https://github.com/cedricmn/img-focus/blob/main/dist/img-focus.js) in your HTML file and add following tags:

* `img-focus` tag to setup your gallery.
* `img-photo` tag for each photo of your gallery and set the `srcset` attribute to list sources for each pictures. Browser will take care of using the right source at the right time. Content can be appended, it will be displayed as a photo overlay.

```html
<img-focus>
    <img-photo srcset="https://picsum.photos/seed/1/320/300 320w, https://picsum.photos/seed/1/640/600 640w, https://picsum.photos/seed/1/1080/900 1080w">
        My photo
    </img-photo>
    <img-photo srcset="https://picsum.photos/seed/2/320/400 320w, https://picsum.photos/seed/2/640/800 640w, https://picsum.photos/seed/2/1080/1200 1080w">
        My photo
    </img-photo>
</img-focus>
```

CSS custom variables may be used to configure the gallery:

* `--img-focus-gap`: define gap between photos (default: 0)
* `--img-focus-icons-color`: navigation icons color (default: #fff)
* `--img-focus-lines-height`: minimum lines height (default: 200px)

## Developing

Following scripts are avalaible:

* `npm run build`: build project
* `npm run start`: debug project
* `npm run test`: test project
