# img-focus

> Responsive photo gallery

A lightweight set of web components to display un-croped pictures.

![img-focus](https://raw.githubusercontent.com/cedricmn/img-focus/main/img-focus.png)

## Getting started

### Installation

Install web components through your package manager:

```shell
npm install img-focus
```

Import `dist/img-focus.js` in your HTML file.
Add following tags with corresponding attributes:

- `img-focus` tag to setup your gallery.
- `img-photo` tag for each photo of your gallery, content can be appended, it will be displayed as a photo overlay.
  - `srcset` photo sources, it will be used to display thumbnail and fullscreen photo (mandatory, no default)
  - `sizes` photo sizes, it may be defined to reduce network load (optionnal, default: `(min-width: 50em) 15vw, 100vw`)
  - `width` and `height` intrinsic photo width and height, it will be used to avoid layout shift (optionnal, no default)
  - `alt` photo alternative text, it will be displayed as photo caption when openning a photo (optionnal, no default)

```html
<img-focus>
  <img-photo
    srcset="https://picsum.photos/seed/1/320/300 320w, https://picsum.photos/seed/1/640/600 640w, https://picsum.photos/seed/1/1280/1200 1280w"
    width="1280"
    height="1200"
    alt="Photo 1"
  >
    Photo 1
  </img-photo>
  <img-photo
    srcset="https://picsum.photos/seed/2/320/400 320w, https://picsum.photos/seed/2/640/800 640w, https://picsum.photos/seed/2/1280/1600 1280w"
    width="1280"
    height="1600"
    alt="Photo 2"
  >
    Photo 2
  </img-photo>
</img-focus>
```

### Configuration

CSS custom variables:

- `--img-focus-gap`: define gap between photos (default: `0`)
- `--img-focus-lines-height`: minimum lines height (default: `200px`)
- `--img-focus-icons-color`: navigation icons color (default: `#fff`)
- `--img-focus-caption-color`: caption text color (default: `#fff`)

DOM events:

- `img-focus-photo-open`: photo openned
- `img-focus-photo-close`: current openned photo closed

## Developing

Following scripts are avalaible:

- `npm run build`: build project
- `npm run start`: debug project
- `npm run test`: test project
