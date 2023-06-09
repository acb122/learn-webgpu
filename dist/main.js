(()=>{"use strict";var e={961:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{f(r.next(e))}catch(e){i(e)}}function u(e){try{f(r.throw(e))}catch(e){i(e)}}function f(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}f((r=r.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=o(n(660)),a=o(n(525)),u=new Float32Array([.5,-.5,0,1,0,0,-.5,-.5,0,0,1,0,0,.5,0,0,0,1]),f=new Uint32Array([0,1,3,1,2,3]);window.addEventListener("load",(()=>{!function(){r(this,void 0,void 0,(function*(){const e=document.getElementById("canvas"),t=e.getContext("webgpu"),n=window.devicePixelRatio||1;e.width=e.clientWidth*n,e.height=e.clientHeight*n;const r=navigator.gpu,o=yield r.requestAdapter(),c=yield o.requestDevice(),s=navigator.gpu.getPreferredCanvasFormat();t.configure({device:c,format:s,alphaMode:"opaque"});const l=c.createBuffer({label:"Verticesbuffer",size:u.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(l,0,u);const d=c.createBuffer({label:"indiciesbuffer",size:u.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(d,0,f);const p=c.createRenderPipeline({layout:"auto",vertex:{module:c.createShaderModule({code:i.default}),entryPoint:"main",buffers:[{attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"}],arrayStride:24,stepMode:"vertex"}]},fragment:{module:c.createShaderModule({code:a.default}),entryPoint:"main",targets:[{format:s}]},primitive:{topology:"triangle-list"}}),v=c.createCommandEncoder(),x={colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]},g=v.beginRenderPass(x);g.setPipeline(p),g.setVertexBuffer(0,l),g.setIndexBuffer(d,"uint32"),g.draw(3,1,0,0),g.end(),c.queue.submit([v.finish()])}))}()}))},525:e=>{e.exports="struct VertexOutput {\n    @builtin(position) position: vec4f,\n    @location(0) vertexColor: vec3f,\n};\n\n@fragment\nfn main(input: VertexOutput) -> @location(0) vec4<f32> {\n  return vec4f(input.vertexColor,1.0);\n}"},660:e=>{e.exports="struct VertexOutput {\n    @builtin(position) position: vec4f,\n    @location(0) vertexColor: vec3f,\n};\n\n@vertex\nfn main(\n  @location(0) pos: vec3f,\n  @location(1) color: vec3f,\n) -> VertexOutput {\n  var output: VertexOutput;\n  output.position=vec4f(pos, 1.0);\n  output.vertexColor=color;\n  return output;\n}"}},t={};!function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}(961)})();