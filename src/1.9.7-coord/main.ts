import triangleVertWGSL from './shaders/triangle.vert.wgsl';
import redFragWGSL from './shaders/triangle.frag.wgsl';
// import { mat4, vec4 } from 'gl-matrix'
// import { translate, multiply } from 'gl-matrix/mat4'
// import { transcode } from 'buffer';
// import * as THREE from 'three';
import * as glm from 'glm-js'
import { vec3 } from 'gl-matrix';
import { lookup } from 'dns';

const vertices = new Float32Array([
  0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, // top right
  0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom right
  -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, // bottom let
  -0.5, 0.5, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0
])

const indices = new Uint32Array([
  0, 1, 3,
  1, 2, 3
])

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('webgpu') as GPUCanvasContext;

  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  const entry: GPU = navigator.gpu;
  const adapter = await entry.requestAdapter();
  const device = await adapter.requestDevice();
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat,
    // format:    'bgra8unorm',
    alphaMode: 'opaque'
    // alphaMode: 'premultiplied',
  });

  // const uniformArray = new Float32Array([.0,1,.0,1]);
  // const uniformBuffer = device.createBuffer({
  //     label: "Grid Uniforms",
  //     size: uniformArray.byteLength,
  //     usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  // });
  // device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

  const verticesbuffer = device.createBuffer({
    label: "Verticesbuffer",
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(verticesbuffer, 0, vertices);

  const indiciesbuffer = device.createBuffer({
    label: "indiciesbuffer",
    size: vertices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(indiciesbuffer, 0, indices);

  const positionBufferDesc: GPUVertexBufferLayout = {
    attributes: [{
      shaderLocation: 0, // [[location(0)]]
      offset: 0,
      format: 'float32x3'
    },
    {
      shaderLocation: 1, // [[location(0)]]
      offset: 12,
      format: 'float32x3'
    },
    {
      shaderLocation: 2, // [[location(0)]]
      offset: 24,
      format: 'float32x2'
    }],
    arrayStride: 32, // sizeof(float) * 3
    stepMode: 'vertex'
  };

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: triangleVertWGSL,
      }),
      entryPoint: 'main',
      buffers: [positionBufferDesc]
    },
    fragment: {
      module: device.createShaderModule({
        code: redFragWGSL,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: presentationFormat,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
  });


  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: undefined,
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  };

  //   const uniformBindGroup = device.createBindGroup({
  //     layout: pipeline.getBindGroupLayout(0),
  //     entries: [
  //         {
  //             binding: 0,
  //             resource: {
  //                 buffer: uniformBuffer,
  //             },
  //         },
  //     ],
  // });
  async function getTexture(location: string) {
    const response = await fetch(location);
    const imageBitmap = await createImageBitmap(await response.blob());


    const texture = device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: texture },
      [imageBitmap.width, imageBitmap.height]
    );
    return texture
  }

  let texture0 = await getTexture('/assets/textures/container.jpg')
  let texture1 = await getTexture('/assets/textures/awesomeface.png')

  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
  });

  let rotate = 0
  function loop(){
//  rotate++
//  rotate%=360
  
 let model = glm.mat4(1.)
 model = glm.rotate(model,glm.radians(-55.), glm.vec3(1.,0.,0.));

 let view = glm.mat4(1.);
 view = glm.translate(view, glm.vec3(0.,0.,-3.))

 let projection = glm.perspective(glm.radians(45.), 800./600.,0.1,10.0)


  // let vec = glm.vec4(1., 0, 0, 1)
  // let trans = glm.mat4(1)
  // trans = glm.translate(trans, glm.vec3(.5, -.5, 0))
  // trans = glm.rotate(trans, glm.radians(rotate), glm.vec3(0, 0, 1))
  // // trans = glm.scale(trans, glm.vec3(0.5, 0.5, 0.5))
  // vec = glm.mul(trans, vec)

  let modelBuffer = device.createBuffer({
    label: "Cell State A",
    size: model.elements.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(modelBuffer, 0, model.elements);

  let viewBuffer = device.createBuffer({
    label: "Cell State A",
    size: view.elements.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(viewBuffer, 0, view.elements);

  let projectionBuffer = device.createBuffer({
    label: "Cell State A",
    size: projection.elements.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(projectionBuffer, 0, projection.elements);


  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: sampler,
      },
      {
        binding: 1,
        resource: texture0.createView(),
      },
      {
        binding: 2,
        resource: texture1.createView(),
      },
      {
        binding: 3,
        resource: { buffer: modelBuffer }
      },
      {
        binding: 4,
        resource: { buffer: viewBuffer }
      }
      ,
      {
        binding: 5,
        resource: { buffer: projectionBuffer }
      }
    ],
  });

  renderPassDescriptor.colorAttachments[0].view = context
    .getCurrentTexture()
    .createView();
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, verticesbuffer);
  passEncoder.setIndexBuffer(indiciesbuffer, 'uint32');
  passEncoder.setBindGroup(0, uniformBindGroup)

  passEncoder.drawIndexed(6);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
  requestAnimationFrame(loop)
  
}
  document.body.appendChild(canvas)

  requestAnimationFrame(loop)

  // await device.queue.onSubmittedWorkDone()

}

window.addEventListener('load', async () => {
  main()
})



