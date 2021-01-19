(()=>{var t={283:(t,e,o)=>{"use strict";o.d(e,{Z:()=>n});var s=o(645),i=o.n(s)()((function(t){return t[1]}));i.push([t.id,"#focus{height:100%;display:flex;flex-wrap:wrap;align-content:start;row-gap:var(--img-focus-gap,0);column-gap:var(--img-focus-gap,0)}#focus::slotted(*){flex-grow:1;text-align:center}@media (max-width:50em){#focus::slotted(*){width:100%}}#focus.noflex::slotted(*){flex-grow:unset;transition:flex-grow .5s ease .5s}#zoom{display:none}",""]);const n=i},14:(t,e,o)=>{"use strict";o.d(e,{Z:()=>n});var s=o(645),i=o.n(s)()((function(t){return t[1]}));i.push([t.id,"img{cursor:pointer;vertical-align:middle}img.transition{transition:height .5s ease-in-out}@media (min-width:50em){img{height:var(--img-focus-lines-height,200px)}}@media (max-width:50em){img{width:100%}}#overlay{position:absolute}",""]);const n=i},55:(t,e,o)=>{"use strict";o.d(e,{Z:()=>n});var s=o(645),i=o.n(s)()((function(t){return t[1]}));i.push([t.id,"div#zoom{position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;user-select:none;z-index:10000}span#close{position:absolute;top:1vw;right:1vw;cursor:pointer;color:var(--img-focus-icons-color,#fff);font-size:2em}span#prev{left:2vw}span#next,span#prev{position:absolute;cursor:pointer;color:var(--img-focus-icons-color,#fff);font-size:5em}span#next{right:2vw}::slotted(img){max-height:90vh;max-width:90vw}",""]);const n=i},645:t=>{"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var o=t(e);return e[2]?"@media ".concat(e[2]," {").concat(o,"}"):o})).join("")},e.i=function(t,o,s){"string"==typeof t&&(t=[[null,t,""]]);var i={};if(s)for(var n=0;n<this.length;n++){var h=this[n][0];null!=h&&(i[h]=!0)}for(var r=0;r<t.length;r++){var l=[].concat(t[r]);s&&i[l[0]]||(o&&(l[2]?l[2]="".concat(o," and ").concat(l[2]):l[2]=o),e.push(l))}},e}},562:t=>{t.exports='<slot id="focus"></slot> <img-zoom id="zoom"></img-zoom> '},650:t=>{t.exports='<div id="overlay"> <slot id="slot"></slot> </div> '},12:t=>{t.exports='<div id="zoom"> <slot id="slot"></slot> <span id="close">✕</span> <span id="prev">〈</span> <span id="next">〉</span> </div> '}},e={};function o(s){if(e[s])return e[s].exports;var i=e[s]={id:s,exports:{}};return t[s](i,i.exports,o),i.exports}o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var s in e)o.o(e,s)&&!o.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";class t{constructor(t){this.focus=t,this.timeout=null}layout(){this.timeoutId||this.resetStyles(),clearTimeout(this.timeoutId),this.timeoutId=setTimeout((()=>{this.timeoutId=null,this.layoutInternal()}),200)}layoutInternal(){const t=this.computeNewLineHeight(),e=this.focus.getFocusElementBounding().width;this.updateHeight(t),e-this.focus.getFocusElementBounding().width>0||this.updateDom(t)}resetStyles(){this.focus.getFocusElement().classList.remove("noflex"),this.focus.getStore().photos.forEach((t=>{t.imgPhoto.clearHeight()}))}computeNewLineHeight(){const t=[],e=[],o=[],s=[],i=[];let n=0,h=-1;return this.focus.getStore().photos.forEach(((i,n)=>{(h>=i.getImgBounding().left||0===n)&&(t.push(i.getImgBounding().height),o.push(0),s.push(0),e.push([])),e[e.length-1].push(i),o[o.length-1]+=i.getImgBounding().width,s[s.length-1]+=this.getCorrectedWidth(i),h=i.getImgBounding().left})),t.forEach(((t,e)=>{i.push(t*s[e]/o[e])})),e.length>1&&(n=e[1][0].getImgBounding().top-e[0][0].getImgBounding().bottom),{gap:n,lineHeight:t[0],linesPhotos:e,newLineHeight:i}}updateHeight({newLineHeight:t,lineHeight:e,gap:o}){const s=t.slice(0,-1).reduce(((t,e)=>t+e+o),e);this.focus.getFocusElement().style.height=`${s}px`}updateDom({linesPhotos:t,newLineHeight:e}){this.focus.getFocusElement().classList.add("noflex"),t.forEach(((t,o,s)=>{o!==s.length-1&&t.forEach((t=>{t.imgPhoto.setHeight(e[o]-.01+"px")}))}))}getCorrectedWidth(t){let e=t.getBounding().right;return e>this.focus.getFocusElementBounding().right&&(e=this.focus.getFocusElementBounding().right),e-t.getBounding().left}}class e{constructor(t){this.imgPhotoInner=t}get imgPhoto(){return this.imgPhotoInner}getImgBounding(){return this.imgPhotoInner.getImg().getBoundingClientRect()}getBounding(){return this.imgPhotoInner.getBoundingClientRect()}}class s{constructor(){this.imgPhotoMap=new Map,this.photosInner=[],this.current=null}add(t){this.photosInner.push(t),this.imgPhotoMap.set(t.imgPhoto,t)}insert(t,e){this.photosInner.splice(this.photosInner.indexOf(e)+1,0,t),this.imgPhotoMap.set(t.imgPhoto,t)}select(t){this.current=t}prev(){const t=this.photosInner.indexOf(this.current);return 0===t?null:(this.current=this.photosInner[t-1],this.current)}next(){const t=this.photosInner.indexOf(this.current);return t===this.photosInner.length-1?null:(this.current=this.photosInner[t+1],this.current)}get(t){return this.imgPhotoMap.get(t)}get photos(){return this.photosInner}}var i=o(283),n=o(562),h=o.n(n);class r extends HTMLElement{constructor(){super(),this.el=this.attachShadow({mode:"open"}),this.store=new s}connectedCallback(){const t=document.createElement("style"),e=document.createElement("template");t.textContent=i.Z,e.innerHTML=h(),this.el.appendChild(t),this.el.appendChild(e),this.el.appendChild(e.content.cloneNode(!0)),this.setup()}setup(){this.focusElement=this.el.querySelector("#focus"),this.zoomElement=this.el.querySelector("#zoom"),this.layout=new t(this),this.addPhotos(),this.addPhotoEventListener(),this.addResizeHandler()}addPhotos(){const t=this.shadowRoot.querySelector("#focus");t.addEventListener("slotchange",(()=>{const e=t.assignedElements();let o=null;e.forEach((t=>{"IMG-PHOTO"!==t.tagName||this.store.get(t)||this.addPhoto(t,o),o=t}))}))}addPhoto(t,o){const s=new e(t);t.shadowRoot.addEventListener("img-photo-click",(()=>this.selectPhoto(s))),t.shadowRoot.addEventListener("img-photo-load",(()=>this.layout.layout())),this.insertPhoto(s,o)}insertPhoto(t,e){if(null===e)this.store.add(t);else{const o=this.store.get(e);this.store.insert(t,o)}}addResizeHandler(){let t=-1;new ResizeObserver((()=>{const e=this.focusElement.getBoundingClientRect().width;e!==t&&(this.layout.layout(),t=e)})).observe(this.focusElement)}addPhotoEventListener(){this.zoomElement.shadowRoot.addEventListener("img-zoom-close",(()=>this.hidePhoto())),this.zoomElement.shadowRoot.addEventListener("img-zoom-prev",(()=>this.prevPhoto())),this.zoomElement.shadowRoot.addEventListener("img-zoom-next",(()=>this.nextPhoto()))}selectPhoto(t){this.store.select(t),this.displayPhoto(t)}prevPhoto(){const t=this.store.prev();t&&this.displayPhoto(t)}nextPhoto(){const t=this.store.next();t&&this.displayPhoto(t)}displayPhoto(t){let e=this.zoomElement.querySelector("#currentphoto");e||(e=document.createElement("img"),e.id="currentphoto",this.zoomElement.appendChild(e)),e.srcset=t.imgPhoto.srcset,e.size="100vw",this.zoomElement.style.display="block"}hidePhoto(){this.zoomElement.style.display="none",this.zoomElement.removeChild(this.zoomElement.querySelector("#currentphoto"))}getStore(){return this.store}getFocusElement(){return this.focusElement}getFocusElementBounding(){return this.focusElement.getBoundingClientRect()}}var l=o(14),c=o(650),d=o.n(c);class a extends HTMLElement{constructor(){super(),this.el=this.attachShadow({mode:"open"})}static get observedAttributes(){return["srcset"]}connectedCallback(){const t=document.createElement("style"),e=document.createElement("template");t.textContent=l.Z,e.innerHTML=d(),this.el.appendChild(t),this.el.appendChild(e),this.el.appendChild(e.content.cloneNode(!0)),this.addPhoto()}attributeChangedCallback(){this.initSources()}addPhoto(){this.img=document.createElement("img"),this.initSources(),this.img.addEventListener("load",(()=>this.el.dispatchEvent(new Event("img-photo-load")))),this.img.addEventListener("click",(()=>this.el.dispatchEvent(new Event("img-photo-click")))),this.el.appendChild(this.img)}initSources(){this.img&&(this.hasAttribute("srcset")?(this.img.setAttribute("srcset",this.getAttribute("srcset")),this.img.setAttribute("sizes","(min-width: 320px) 640px")):(this.img.removeAttribute("srcset"),this.img.removeAttribute("sizes")))}clearHeight(){this.img.style.height="",this.img.classList.remove("transition")}setHeight(t){this.img.style.height=t,this.img.classList.add("transition")}get srcset(){return this.getAttribute("srcset")}set srcset(t){this.setAttribute("srcset",t)}getImg(){return this.img}}var u=o(55),g=o(12),m=o.n(g);class p extends HTMLElement{constructor(){super(),this.el=this.attachShadow({mode:"open"})}connectedCallback(){const t=document.createElement("style"),e=document.createElement("template");t.textContent=u.Z,e.innerHTML=m(),this.el.appendChild(t),this.el.appendChild(e),this.el.appendChild(e.content.cloneNode(!0)),this.addHandlers()}addHandlers(){const t=["close","prev","next"];for(const e of t)this.shadowRoot.querySelector(`#${e}`).addEventListener("click",(()=>{const t=new Event(`img-zoom-${e}`);this.el.dispatchEvent(t)}))}}window.customElements.define("img-focus",r),window.customElements.define("img-photo",a),window.customElements.define("img-zoom",p)})()})();