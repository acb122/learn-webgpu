(()=>{"use strict";var e={961:function(e,t,r){var o=this&&this.__awaiter||function(e,t,r,o){return new(r||(r=Promise))((function(n,i){function a(e){try{s(o.next(e))}catch(e){i(e)}}function u(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,u)}s((o=o.apply(e,t||[])).next())}))},n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=n(r(660)),a=n(r(525));let u=600;const s=new Float32Array([1,1,0,346/u,.2725,1,.85,0,346/u,.1925,.9,.85,0,.54,.1925,.9,1,0,.54,.2725]);console.log(s);const c=new Uint32Array([0,1,3,1,2,3]);window.addEventListener("load",(()=>o(void 0,void 0,void 0,(function*(){!function(){o(this,void 0,void 0,(function*(){const e=document.getElementById("canvas");e.height=600,e.width=800,e.style.height="${height}px",e.style.width="${width}px";const t=e.getContext("webgpu"),r=window.devicePixelRatio||1;e.width=e.clientWidth*r,e.height=e.clientHeight*r;const n=navigator.gpu,u=yield n.requestAdapter(),d=yield u.requestDevice(),f=navigator.gpu.getPreferredCanvasFormat();t.configure({device:d,format:f,alphaMode:"premultiplied"});const l=d.createBuffer({label:"Verticesbuffer",size:s.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});d.queue.writeBuffer(l,0,s);const g=d.createBuffer({label:"indiciesbuffer",size:s.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});d.queue.writeBuffer(g,0,c);const p=d.createRenderPipeline({layout:"auto",vertex:{module:d.createShaderModule({code:i.default}),entryPoint:"main",buffers:[{attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x2"}],arrayStride:20,stepMode:"vertex"}]},fragment:{module:d.createShaderModule({code:a.default}),entryPoint:"main",targets:[{format:f}]},primitive:{topology:"triangle-list"}}),h=yield fetch("/assets/fonts/b612.png"),m=yield createImageBitmap(yield h.blob());console.log(h,m);const x=d.createTexture({size:[m.width,m.height,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});console.log(x),d.queue.copyExternalImageToTexture({source:m},{texture:x},[m.width,m.height]);const y=d.createSampler({addressModeU:"repeat",addressModeV:"repeat",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"});d.createBindGroup({layout:p.getBindGroupLayout(0),entries:[{binding:0,resource:y},{binding:1,resource:x.createView()}]}),t.getCurrentTexture().createView();const v=d.createCommandEncoder();yield function(e,t,r){return o(this,void 0,void 0,(function*(){const n={colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]},u=r.createRenderPipeline({layout:"auto",vertex:{module:r.createShaderModule({code:i.default}),entryPoint:"main",buffers:[{attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x2"}],arrayStride:20,stepMode:"vertex"}]},fragment:{module:r.createShaderModule({code:a.default}),entryPoint:"main",targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list"}});let s='"Hello my name is Xander! @123"';const c=yield function(e,t,r){return o(this,void 0,void 0,(function*(){let t=.25,r=512,o=512;const n=yield fetch("/assets/fonts/b612.json");let i=yield n.json(),a=[...e].map((e=>i.chars.find((t=>+t.id==e.charCodeAt()))||"0")),u=0;return new Float32Array(a.map(((n,i)=>{let a=e=>e/800*2-1,s=e=>e/600*2-1;console.log(e[i],n.height,n.yoffset,n);let c=u+0,d=n.width*t,f=200,l=n.height*t,g=n.yoffset*t,p=(1+n.xoffset)*t;return u+=(n.xadvance+1)*t,[a(c+p+d),s(f-g),0,(n.x+n.width)/r,n.y/o,a(c+p+d),s(f-l-g),0,,(n.x+n.width)/r,(n.y+n.height)/o,a(c+p),s(f-l-g),0,n.x/r,(n.y+n.height)/o,a(c+p),s(f-g),0,n.x/r,n.y/o]})).flat())}))}(s);console.log(c);const d=r.createBuffer({label:"Verticesbuffer",size:c.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(d,0,c);const f=new Uint32Array([...s].map(((e,t)=>[0+4*t,1+4*t,3+4*t,1+4*t,2+4*t,3+4*t])).flat()),l=r.createBuffer({label:"indiciesbuffer",size:f.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(l,0,f);const g=yield fetch("/assets/fonts/b612.png"),p=yield createImageBitmap(yield g.blob()),h=r.createTexture({size:[p.width,p.height,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});console.log(h),r.queue.copyExternalImageToTexture({source:p},{texture:h},[p.width,p.height]);const m=r.createSampler({addressModeU:"repeat",addressModeV:"repeat",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"});r.queue.writeBuffer(l,0,f);const x=r.createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:m},{binding:1,resource:h.createView()}]}),y=e.beginRenderPass(n);y.setPipeline(u),y.setVertexBuffer(0,d),y.setIndexBuffer(l,"uint32"),y.setBindGroup(0,x),y.drawIndexed(186),y.end()}))}(v,t,d),d.queue.submit([v.finish()]),document.body.appendChild(e)}))}()}))))},525:e=>{e.exports="struct VertexOutput {\n    @builtin(position) position: vec4f,\n    @location(0) vertexColor: vec3f,\n    @location(1) textCoord: vec2f\n};\n\n@group(0) @binding(0) var mySampler: sampler;\n@group(0) @binding(1) var myTexture: texture_2d<f32>;\n\n@fragment\nfn main(input: VertexOutput) -> @location(0) vec4<f32> {\n  return textureSample(myTexture, mySampler, input.textCoord);\n}"},660:e=>{e.exports="struct VertexOutput {\n    @builtin(position) position: vec4f,\n    @location(0) vertexColor: vec3f,\n    @location(1) textCoord: vec2f\n};\n\n@vertex\nfn main(\n  @location(0) pos: vec3f,\n  @location(1) textCoord: vec2f,\n) -> VertexOutput {\n  var output: VertexOutput;\n  output.position=vec4f(pos, 1.0);\n  output.vertexColor=vec3f(1.);\n  output.textCoord=vec2f(textCoord.x, (textCoord.y));\n  return output;\n}"}},t={};!function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,r),i.exports}(961)})();