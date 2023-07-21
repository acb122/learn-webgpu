import triangleVertWGSL from './shaders/triangle.vert.wgsl';
import redFragWGSL from './shaders/triangle.frag.wgsl';
import lightWGSL from './shaders/light.vert.wgsl';
import whiteFragWGSL from './shaders/light.frag.wgsl';
import * as glm from 'glm-js'
import { Camera } from './camera';



const vertices = new Float32Array([
  -0.5, -0.5, -0.5,
  0.5, -0.5, -0.5,
  0.5, 0.5, -0.5,
  0.5, 0.5, -0.5,
  -0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  -0.5, 0.5, 0.5,
  -0.5, -0.5, 0.5,
  -0.5, 0.5, 0.5,
  -0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5,
  -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  0.5, 0.5, -0.5,
  0.5, -0.5, -0.5,
  0.5, -0.5, -0.5,
  0.5, -0.5, 0.5,
  0.5, 0.5, 0.5,
  -0.5, -0.5, -0.5,
  0.5, -0.5, -0.5,
  0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  -0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5,
  0.5, 0.5, -0.5,
  0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  -0.5, 0.5, 0.5,
  -0.5, 0.5, -0.
])


async function main() {


  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const camera = new Camera(this, canvas)

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

  const positionBufferDesc: GPUVertexBufferLayout = {
    attributes: [{
      shaderLocation: 0, // [[location(0)]]
      offset: 0,
      format: 'float32x3'
    }],
    arrayStride: 12, // sizeof(float) * 3
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
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  });

  const lightPipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: lightWGSL,
      }),
      entryPoint: 'main',
      buffers: [positionBufferDesc]
    },
    fragment: {
      module: device.createShaderModule({
        code: whiteFragWGSL,
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
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  });

  console.log(canvas.width, canvas.height)

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
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
    depthStencilAttachment: {
      view: depthTexture.createView(),

      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },

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

  function loop() {

    let currentFrame = Date.now();
    camera.deltaTs = currentFrame - camera.lastTs;
    camera.lastTs = currentFrame;

    let view = camera.getViewMatrix();
    let projection = glm.perspective(glm.radians(camera.zoom), 800. / 600., 0.1, 100.0)
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
    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(lightPipeline);

    let model2 = glm.mat4(1.)
    model2 = glm.translate(model2, glm.vec3(1.2, 1., 2.))
    model2 = glm.scale(model2, glm.vec3(.2));
    // model2 = glm.translate(model2, glm.vec3(1.2, 1., 2.))
    // model2 = glm.rotate(model2, glm.radians(45.), glm.vec3(1, .3, 0.5));
    let model2Buffer = device.createBuffer({
      label: "Cell State A",
      size: model2.elements.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(model2Buffer, 0, model2.elements);


    let objectColor = new Float32Array([1, .5, .31])

    let objectColorBuffer = device.createBuffer({
      label: "Cell State A",
      size: objectColor.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    device.queue.writeBuffer(objectColorBuffer, 0, objectColor);

    let lightColor = new Float32Array([1, 1, 1])

    let lightColorBuffer = device.createBuffer({
      label: "Cell State A",
      size: lightColor.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(lightColorBuffer, 0, lightColor);
    const uniformBindGroup = device.createBindGroup({
      layout: lightPipeline.getBindGroupLayout(0),
      entries: [
        // {
        //   binding: 0,
        //   resource: { buffer: objectColorBuffer },
        // },
        // {
        //   binding: 1,
        //   resource: { buffer: lightColorBuffer },
        // },
        {
          binding: 0,
          resource: { buffer: model2Buffer },
        },
        {
          binding: 1,
          resource: { buffer: viewBuffer },
        },
        {
          binding: 2,
          resource: { buffer: projectionBuffer }
        }
      ],
    });
    passEncoder.setVertexBuffer(0, verticesbuffer);
    passEncoder.setBindGroup(0, uniformBindGroup)

    passEncoder.draw(36, 1, 0, 0);

    passEncoder.setPipeline(pipeline);

    // cubePositions.forEach((pos, i) => {

    let model = glm.mat4(1.)
    // model = glm.translate(model, glm.vec3(1.2, 1., 2.))
    // model = glm.scale(model, glm.vec3(.2));
    // let model2 = glm.mat4(1.)

    let modelBuffer = device.createBuffer({
      label: "Cell State A",
      size: model.elements.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    device.queue.writeBuffer(modelBuffer, 0, model.elements);

    const uniformBindGroup2 = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: objectColorBuffer },
        },
        {
          binding: 1,
          resource: { buffer: lightColorBuffer },
        },
        {
          binding: 2,
          resource: { buffer: modelBuffer },
        },
        {
          binding: 3,
          resource: { buffer: viewBuffer },
        },
        {
          binding: 4,
          resource: { buffer: projectionBuffer }
        }
      ],
    });


    passEncoder.setVertexBuffer(0, verticesbuffer);
    passEncoder.setBindGroup(0, uniformBindGroup2)

    passEncoder.draw(36, 1, 0, 0);
    // })

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



