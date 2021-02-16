(()=>{var t={283:(t,e,i)=>{"use strict";i.d(e,{Z:()=>n});var s=i(645),o=i.n(s)()((function(t){return t[1]}));o.push([t.id,"#focus{height:100%;display:flex;flex-wrap:wrap;align-content:start;row-gap:var(--img-focus-gap,0);column-gap:var(--img-focus-gap,0)}#focus::slotted(*){flex-grow:1;text-align:center}@media (max-width:50em){#focus::slotted(*){width:100%}}#focus.noflex::slotted(*){flex-grow:unset}#zoom{display:none}#zoom-figure{display:grid;grid-template-rows:2em calc(100% - 4em) 2em}#zoom-image{grid-row-start:2;width:100%;height:100%;object-fit:contain}#zoom-figcaption{grid-row-start:3;align-self:center;text-align:center;font-family:sans-serif;color:var(--img-focus-caption-color,#fff)}",""]);const n=o},14:(t,e,i)=>{"use strict";i.d(e,{Z:()=>n});var s=i(645),o=i.n(s)()((function(t){return t[1]}));o.push([t.id,"img{cursor:pointer;vertical-align:middle;width:auto;height:auto}@media (min-width:50em){img{height:var(--img-focus-lines-height,200px)}}@media (max-width:50em){img{width:100%}}#overlay{position:absolute}",""]);const n=o},55:(t,e,i)=>{"use strict";i.d(e,{Z:()=>n});var s=i(645),o=i.n(s)()((function(t){return t[1]}));o.push([t.id,"div#zoom{position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;user-select:none;z-index:10000}button{position:absolute;color:var(--img-focus-icons-color,#fff);padding:1.5rem;cursor:pointer;border:0;background-color:transparent}button:disabled{opacity:.3;cursor:default}#close{font-size:2.5rem;top:0;right:0}#prev{left:0}#next,#prev{font-size:5rem}#next{right:0}::slotted(*){height:100vh;width:90vw}",""]);const n=o},645:t=>{"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var i=t(e);return e[2]?"@media ".concat(e[2]," {").concat(i,"}"):i})).join("")},e.i=function(t,i,s){"string"==typeof t&&(t=[[null,t,""]]);var o={};if(s)for(var n=0;n<this.length;n++){var h=this[n][0];null!=h&&(o[h]=!0)}for(var r=0;r<t.length;r++){var l=[].concat(t[r]);s&&o[l[0]]||(i&&(l[2]?l[2]="".concat(i," and ").concat(l[2]):l[2]=i),e.push(l))}},e}},562:t=>{t.exports='<slot id="focus"></slot> <img-zoom id="zoom"><figure id="zoom-figure"> <img id="zoom-image" src="#" alt="" role="none"/> <figcaption id="zoom-figcaption"></figcaption></figure></img-zoom> '},650:t=>{t.exports='<div id="overlay"> <slot id="slot"></slot> </div> '},12:t=>{t.exports='<div id="zoom" role="none"> <slot id="slot"></slot> <button id="close" aria-label="Close photo">✕</button> <button id="next" aria-label="Next photo">〉</button> <button id="prev" aria-label="Previous photo">〈</button> </div> '}},e={};function i(s){if(e[s])return e[s].exports;var o=e[s]={id:s,exports:{}};return t[s](o,o.exports,i),o.exports}i.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return i.d(e,{a:e}),e},i.d=(t,e)=>{for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";class t{constructor(t){this.focus=t,this.timeout=null}layout(){this.timeoutId||this.resetStyles(),clearTimeout(this.timeoutId),this.timeoutId=setTimeout((()=>{this.timeoutId=null,this.layoutInternal()}),200)}layoutInternal(){const t=this.computeNewLineHeight(),e=this.focus.getFocusElementBounding().width;this.updateHeight(t),e-this.focus.getFocusElementBounding().width>0||this.updateDom(t)}resetStyles(){this.focus.getFocusElement().classList.remove("noflex"),this.focus.getStore().photos.forEach((t=>{t.imgPhoto.clearSize()}))}computeNewLineHeight(){const t=[],e=[],i=[],s=[],o=[];let n=0,h=-1;return this.focus.getStore().photos.forEach(((o,n)=>{(h>=o.getImgBounding().left||0===n)&&(t.push(o.getImgBounding().height),i.push(0),s.push(0),e.push([])),e[e.length-1].push(o),i[i.length-1]+=o.getImageWidth(),s[s.length-1]+=this.getCorrectedWidth(o),h=o.getImgBounding().left})),t.forEach(((t,e)=>{o.push(t*s[e]/i[e])})),e.length>1&&(n=e[1][0].getImgBounding().top-e[0][0].getImgBounding().bottom),{gap:n,lineHeight:t[0],linesPhotos:e,newLineHeight:o}}updateHeight({newLineHeight:t,lineHeight:e,gap:i}){const s=this.focus.getFocusElementBounding().height,o=t.slice(0,-1).reduce(((t,e)=>t+e+i),e);(!s||o>s||s-o>50)&&(this.focus.getFocusElement().style.height=`${o}px`)}updateDom({linesPhotos:t,newLineHeight:e}){this.focus.getFocusElement().classList.add("noflex"),t.forEach(((t,i,s)=>{i!==s.length-1&&t.forEach((t=>{if(t.imgPhoto.width&&t.imgPhoto.height){const s=t.imgPhoto.width*e[i]/t.imgPhoto.height;t.imgPhoto.setWidth(s-.01+"px")}t.imgPhoto.setHeight(e[i]-.01+"px")}))}))}getCorrectedWidth(t){let e=t.getBounding().right;return e>this.focus.getFocusElementBounding().right&&(e=this.focus.getFocusElementBounding().right),e-t.getBounding().left}}class e{constructor(t){this.imgPhotoInner=t}get imgPhoto(){return this.imgPhotoInner}getImgBounding(){return this.imgPhotoInner.getImg().getBoundingClientRect()}getBounding(){return this.imgPhotoInner.getBoundingClientRect()}getImageWidth(){return this.imgPhoto.width&&this.imgPhoto.height?this.imgPhoto.width*this.getImgBounding().height/this.imgPhoto.height:this.getImgBounding().width}}class s{constructor(){this.imgPhotoMap=new Map,this.photosInner=[],this.current=null}add(t){this.photosInner.push(t),this.imgPhotoMap.set(t.imgPhoto,t)}insert(t,e){this.photosInner.splice(this.photosInner.indexOf(e)+1,0,t),this.imgPhotoMap.set(t.imgPhoto,t)}select(t){this.current=t}getCurrent(){return this.current}prev(){const t=this.getPrev(this.current);return null!==t&&(this.current=t),t}hasPrev(t){return null!==this.getPrev(t)}getPrev(t){const e=this.photosInner.indexOf(t);return 0===e?null:this.photosInner[e-1]}next(){const t=this.getNext(this.current);return null!==t&&(this.current=t),t}hasNext(t){return null!==this.getNext(t)}getNext(t){const e=this.photosInner.indexOf(t);return e===this.photosInner.length-1?null:this.photosInner[e+1]}get(t){return this.imgPhotoMap.get(t)}get photos(){return this.photosInner}}class o{static copyAttribute(t,e,i){t&&e&&(t.hasAttribute(i)?e.setAttribute(i,t.getAttribute(i)):e.removeAttribute(i))}static setAttribute(t,e,i){i?t.setAttribute(e,i):t.removeAttribute(e)}static setBooleanAttribute(t,e,i){i?t.setAttribute(e,""):t.removeAttribute(e)}}var n=i(283),h=i(562),r=i.n(h);class l extends HTMLElement{constructor(){super(),this.el=this.attachShadow({mode:"open"}),this.store=new s}connectedCallback(){const t=document.createElement("style"),e=document.createElement("template");t.textContent=n.Z,e.innerHTML=r(),this.el.appendChild(t),this.el.appendChild(e),this.el.appendChild(e.content.cloneNode(!0)),this.setup()}setup(){this.focusElement=this.el.querySelector("#focus"),this.zoomElement=this.el.querySelector("#zoom"),this.layout=new t(this),this.addPhotos(),this.addPhotoEventListener(),this.addResizeHandler()}addPhotos(){const t=this.shadowRoot.querySelector("#focus");t.addEventListener("slotchange",(()=>{const e=t.assignedElements();let i=null;e.forEach((t=>{"IMG-PHOTO"!==t.tagName||this.store.get(t)||this.addPhoto(t,i),i=t}))}))}addPhoto(t,i){const s=new e(t);this.insertPhoto(s,i),t.addEventListener("img-photo-select",(()=>this.openPhoto(s))),t.hasAttribute("width")&&t.hasAttribute("height")?this.layout.layout():t.addEventListener("img-photo-load",(()=>this.layout.layout()))}insertPhoto(t,e){if(null===e)this.store.add(t);else{const i=this.store.get(e);this.store.insert(t,i)}}addResizeHandler(){let t=-1;new ResizeObserver((()=>{const e=this.focusElement.getBoundingClientRect().width;e!==t&&(this.layout.layout(),t=e)})).observe(this.focusElement)}addPhotoEventListener(){this.zoomElement.addEventListener("img-zoom-close",(()=>this.closePhoto())),this.zoomElement.addEventListener("img-zoom-prev",(()=>this.prevPhoto())),this.zoomElement.addEventListener("img-zoom-next",(()=>this.nextPhoto()))}openPhoto(t){this.el.dispatchEvent(new Event("img-focus-photo-open",{bubbles:!0,composed:!0})),this.store.select(t),this.displayPhoto(t),this.zoomElement.style.display="block",this.zoomElement.focus({preventScroll:!0})}prevPhoto(){const t=this.store.prev();t&&this.displayPhoto(t)}nextPhoto(){const t=this.store.next();t&&this.displayPhoto(t)}displayPhoto(t){const e=this.zoomElement.querySelector("#zoom-figcaption"),i=this.zoomElement.querySelector("#zoom-image");o.setBooleanAttribute(this.zoomElement,"hasprevious",this.store.hasPrev(t)),o.setBooleanAttribute(this.zoomElement,"hasnext",this.store.hasNext(t)),o.copyAttribute(t.imgPhoto,i,"alt"),o.copyAttribute(t.imgPhoto,i,"srcset"),o.setAttribute(i,"sizes","100vw"),e.textContent=t.imgPhoto.alt}closePhoto(){this.el.dispatchEvent(new Event("img-focus-photo-close",{bubbles:!0,composed:!0}));const t=this.zoomElement.querySelector("#zoom-figcaption"),e=this.zoomElement.querySelector("#zoom-image");this.zoomElement.style.display="none",e.alt="",e.srcset="",e.sizes="",t.textContent="",this.store.getCurrent().imgPhoto.focus()}getStore(){return this.store}getFocusElement(){return this.focusElement}getFocusElementBounding(){return this.focusElement.getBoundingClientRect()}}var a=i(14),u=i(650),c=i.n(u);class d extends HTMLElement{constructor(){super(),this.el=this.attachShadow({mode:"open"})}static get observedAttributes(){return["srcset","sizes","width","height","alt"]}connectedCallback(){const t=document.createElement("style"),e=document.createElement("template");t.textContent=a.Z,e.innerHTML=c(),this.el.appendChild(t),this.el.appendChild(e),this.el.appendChild(e.content.cloneNode(!0)),this.tabIndex=0,o.setAttribute(this,"role","button"),o.setAttribute(this,"aria-label",this.alt),this.setup()}setup(){this.addEventListener("keydown",(t=>{"Enter"!==t.key&&" "!==t.key||(this.dispatchEvent(new Event("img-photo-select")),t.preventDefault())})),this.addEventListener("click",(()=>this.dispatchEvent(new Event("img-photo-select")))),this.img=document.createElement("img"),o.setAttribute(this.img,"role","none"),this.img.addEventListener("load",(()=>this.dispatchEvent(new Event("img-photo-load")))),this.initSources(),this.el.appendChild(this.img)}attributeChangedCallback(){this.initSources()}initSources(){this.img&&(o.copyAttribute(this,this.img,"srcset"),o.copyAttribute(this,this.img,"alt"),this.hasAttribute("sizes")?o.copyAttribute(this,this.img,"sizes"):o.setAttribute(this.img,"sizes","(min-width: 50em) 15vw, 100vw"),o.copyAttribute(this,this.img,"width"),o.copyAttribute(this,this.img,"height"))}clearSize(){this.img.style.width="",this.img.style.height=""}setWidth(t){this.img.style.width=t}setHeight(t){this.img.style.height=t}getImg(){return this.img}get srcset(){return this.getAttribute("srcset")}set srcset(t){this.setAttribute("srcset",t)}get sizes(){return this.getAttribute("sizes")}set sizes(t){this.setAttribute("sizes",t)}get width(){return this.getAttribute("width")}set width(t){this.setAttribute("width",t)}get height(){return this.getAttribute("height")}set height(t){this.setAttribute("height",t)}get alt(){return this.getAttribute("alt")}set alt(t){this.setAttribute("alt",t)}}var g=i(55),m=i(12),p=i.n(m);const f="close",v="next",b="prev";class E extends HTMLElement{constructor(){super(),this.el=this.attachShadow({mode:"open"})}static get observedAttributes(){return["hasprevious","hasnext"]}attributeChangedCallback(){this.updateState()}connectedCallback(){const t=document.createElement("style"),e=document.createElement("template");t.textContent=g.Z,e.innerHTML=p(),this.el.appendChild(t),this.el.appendChild(e),this.el.appendChild(e.content.cloneNode(!0)),this.tabIndex=-1,o.setAttribute(this,"role","dialog"),o.setAttribute(this,"aria-label","Display photo"),this.setup()}setup(){this.prevElement=this.el.querySelector(`#${b}`),this.nextElement=this.el.querySelector(`#${v}`),this.closeElement=this.el.querySelector(`#${f}`),this.actions=[this.closeElement,this.nextElement,this.prevElement],this.updateState(),this.addKeydownEventListener(),this.addEventListener("focus",(()=>{this.el.activeElement||this.closeElement.focus()})),this.el.querySelector("#zoom").addEventListener("click",(t=>{[f,b,v].includes(t.target.id)||this.sendEvent(f)}));for(const t of[f,b,v])this.shadowRoot.querySelector(`#${t}`).addEventListener("click",(e=>{this.sendEvent(t),e.preventDefault()}))}addKeydownEventListener(){this.addEventListener("keydown",(t=>{switch(t.key){case"ArrowUp":case"ArrowLeft":this.sendEvent(b);break;case"ArrowDown":case"ArrowRight":this.sendEvent(v);break;case"Escape":this.sendEvent(f);break;case"Tab":{let e=this.actions.filter((t=>!t.disabled));e.length>1&&(t.shiftKey&&(e=e.reverse()),e[(e.indexOf(this.el.activeElement)+1)%e.length].focus());break}default:return}t.preventDefault()}))}updateState(){this.prevElement&&o.setBooleanAttribute(this.prevElement,"disabled",!this.hasAttribute("hasprevious")),this.nextElement&&o.setBooleanAttribute(this.nextElement,"disabled",!this.hasAttribute("hasnext"))}sendEvent(t){this.dispatchEvent(new Event(`img-zoom-${t}`))}get hasprevious(){return this.getAttribute("hasprevious")}set hasprevious(t){this.setAttribute("hasprevious",t)}get hasnext(){return this.getAttribute("hasnext")}set hasnext(t){this.setAttribute("hasnext",t)}}window.customElements.define("img-zoom",E),window.customElements.define("img-photo",d),window.customElements.define("img-focus",l)})()})();