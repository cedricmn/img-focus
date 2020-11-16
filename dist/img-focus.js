(()=>{var t={910:(t,e,o)=>{(t.exports=o(252)(!1)).push([t.id,"#focus{height:100%;display:flex;flex-wrap:wrap;align-content:start;row-gap:var(--img-focus-gap,0);column-gap:var(--img-focus-gap,0)}#focus>div{flex-grow:1}#focus.noflex>div{flex-grow:unset}#focus>div>img{cursor:pointer;vertical-align:middle}@media (min-width:50em){#focus>div>img{height:200px}}@media (max-width:50em){#focus>div{width:100%}}#zoom{display:none}",""])},421:(t,e,o)=>{(t.exports=o(252)(!1)).push([t.id,"div#zoom{position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;user-select:none}span#close{position:absolute;top:1vw;right:1vw;cursor:pointer;color:var(--img-focus-icons-color,#fff);font-size:2em}span#prev{left:2vw}span#next,span#prev{position:absolute;cursor:pointer;color:var(--img-focus-icons-color,#fff);font-size:5em}span#next{right:2vw}::slotted(img){max-height:90vh;max-width:90vw}",""])},252:t=>{t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var o=function(t,e){var o=t[1]||"",s=t[3];if(!s)return o;if(e&&"function"==typeof btoa){var n=(r=s,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),i=s.sources.map((function(t){return"/*# sourceURL="+s.sourceRoot+t+" */"}));return[o].concat(i).concat([n]).join("\n")}var r;return[o].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+o+"}":o})).join("")},e.i=function(t,o){"string"==typeof t&&(t=[[null,t,""]]);for(var s={},n=0;n<this.length;n++){var i=this[n][0];"number"==typeof i&&(s[i]=!0)}for(n=0;n<t.length;n++){var r=t[n];"number"==typeof r[0]&&s[r[0]]||(o&&!r[2]?r[2]=o:o&&(r[2]="("+r[2]+") and ("+o+")"),e.push(r))}},e}},562:t=>{t.exports='<slot id="slot"></slot> <div id="focus"></div> <img-zoom id="zoom"></img-zoom> '},12:t=>{t.exports='<div id="zoom"> <slot id="slot"></slot> <span id="close">✕</span> <span id="prev">〈</span> <span id="next">〉</span> </div>'}},e={};function o(s){if(e[s])return e[s].exports;var n=e[s]={id:s,exports:{}};return t[s](n,n.exports,o),n.exports}o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var s in e)o.o(e,s)&&!o.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";class t{constructor(t){this.focus=t}layout(){this.resetStyles();const t=this.focus.getFocusElementBounding().width;this.onePassLayout(),t-this.focus.getFocusElementBounding().width>0&&(this.focus.getFocusElement().style.width=this.focus.getFocusElementBounding().width+"px",this.resetStyles(),this.onePassLayout(),this.focus.getFocusElement().style.width="")}resetStyles(){this.focus.getFocusElement().classList.remove("noflex"),this.focus.getStore().photos.forEach(t=>{t.img.style.height=""})}onePassLayout(){const t=this.computeNewLineHeight();this.updateDom(t.linesPhotos,t.newLineHeight)}computeNewLineHeight(){const t=[],e=[],o=[],s=[],n=[];let i=-1;return this.focus.getStore().photos.forEach((n,r)=>{(i>=n.getImgBounding().left||0===r)&&(t.push(n.getImgBounding().height),o.push(0),s.push(0),e.push([])),e[e.length-1].push(n),o[o.length-1]+=n.getImgBounding().width,s[s.length-1]+=this.getCorrectedWidth(n),i=n.getImgBounding().left}),t.forEach((t,e)=>{n.push(t*s[e]/o[e])}),{linesPhotos:e,newLineHeight:n}}updateDom(t,e){this.focus.getFocusElement().classList.add("noflex"),t.forEach((t,o,s)=>{o!==s.length-1&&t.forEach(t=>{t.img.style.height=e[o]-.01+"px"})})}getCorrectedWidth(t){let{right:e}=t.getDivBounding();return e>this.focus.getFocusElementBounding().width&&(e=this.focus.getFocusElementBounding().width),e-t.getDivBounding().left}}class e{constructor(t,e,o){this.imgPhotoInner=t,this.divInner=e,this.imgInner=o}get imgPhoto(){return this.imgPhotoInner}get div(){return this.divInner}get img(){return this.imgInner}getImgBounding(){return this.imgInner.getBoundingClientRect()}getDivBounding(){return this.divInner.getBoundingClientRect()}}class s{constructor(){this.imgPhotoMap=new Map,this.photosInner=[],this.current=null}add(t){this.photosInner.push(t),this.imgPhotoMap.set(t.imgPhoto,t)}insert(t,e){this.photosInner.splice(this.photosInner.indexOf(e)+1,0,t),this.imgPhotoMap.set(t.imgPhoto,t)}select(t){this.current=t}prev(){const t=this.photosInner.indexOf(this.current);return 0===t?null:(this.current=this.photosInner[t-1],this.current)}next(){const t=this.photosInner.indexOf(this.current);return t===this.photosInner.length-1?null:(this.current=this.photosInner[t+1],this.current)}get(t){return this.imgPhotoMap.get(t)}get photos(){return this.photosInner}}var n=o(910),i=o.n(n),r=o(562),h=o.n(r);class c extends HTMLElement{constructor(){super(),this.el=this.attachShadow({mode:"open"}),this.store=new s}connectedCallback(){const t=document.createElement("style"),e=document.createElement("template");t.textContent=i(),e.innerHTML=h(),this.el.appendChild(t),this.el.appendChild(e),this.el.appendChild(e.content.cloneNode(!0)),this.setup()}setup(){this.focusElement=this.el.querySelector("#focus"),this.zoomElement=this.el.querySelector("#zoom"),this.layout=new t(this),this.addPhotos(),this.addPhotoEventListener(),this.addResizeHandler()}addPhotos(){const t=this.shadowRoot.querySelector("#slot");t.addEventListener("slotchange",()=>{const e=t.assignedElements();let o=null;e.forEach(t=>{"IMG-PHOTO"!==t.tagName||this.store.get(t)||this.insertPhoto(t,o),o=t})})}insertPhoto(t,o){const s=document.createElement("div"),n=document.createElement("img"),i=new e(t,s,n);n.srcset=t.srcset,n.sizes="(min-width: 320px) 640px",n.addEventListener("click",()=>this.selectPhoto(i)),n.addEventListener("load",()=>this.layout.layout()),s.appendChild(n),this.insertPhotoAfter(i,o)}insertPhotoAfter(t,e){if(null===e)this.focusElement.appendChild(t.div),this.store.add(t);else{const o=this.store.get(e);o.div.parentNode.insertBefore(t.div,o.div.nextSibling),this.store.insert(t,o)}}addResizeHandler(){let t=-1;new ResizeObserver(()=>{const e=this.focusElement.getBoundingClientRect().width;e!==t&&(this.layout.layout(),t=e)}).observe(this.focusElement)}addPhotoEventListener(){this.zoomElement.shadowRoot.addEventListener("imgphotoclose",()=>this.hidePhoto()),this.zoomElement.shadowRoot.addEventListener("imgphotoprev",()=>this.prevPhoto()),this.zoomElement.shadowRoot.addEventListener("imgphotonext",()=>this.nextPhoto())}selectPhoto(t){this.store.select(t),this.displayPhoto(t)}prevPhoto(){const t=this.store.prev();t&&this.displayPhoto(t)}nextPhoto(){const t=this.store.next();t&&this.displayPhoto(t)}displayPhoto(t){let e=this.zoomElement.querySelector("#currentphoto");e||(e=document.createElement("img"),e.id="currentphoto",this.zoomElement.appendChild(e)),e.srcset=t.imgPhoto.srcset,e.size="100vw",this.zoomElement.style.display="block"}hidePhoto(){this.zoomElement.style.display="none",this.zoomElement.removeChild(this.zoomElement.querySelector("#currentphoto"))}getStore(){return this.store}getFocusElement(){return this.focusElement}getFocusElementBounding(){return this.focusElement.getBoundingClientRect()}}var l=o(421),d=o.n(l);class u extends HTMLElement{get srcset(){return this.getAttribute("srcset")}set srcset(t){this.setAttribute("srcset",t)}}var a=o(12),p=o.n(a);class m extends HTMLElement{constructor(){super(),this.el=this.attachShadow({mode:"open"})}connectedCallback(){const t=document.createElement("style"),e=document.createElement("template");t.textContent=d(),e.innerHTML=p(),this.el.appendChild(t),this.el.appendChild(e),this.el.appendChild(e.content.cloneNode(!0)),this.addHandlers()}addHandlers(){const t=["close","prev","next"];for(const e of t)this.shadowRoot.querySelector("#"+e).addEventListener("click",()=>{const t=new Event("imgphoto"+e);this.el.dispatchEvent(t)})}}window.customElements.define("img-focus",c),window.customElements.define("img-photo",u),window.customElements.define("img-zoom",m)})()})();