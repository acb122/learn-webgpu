import triangleVertWGSL from './shaders/triangle.vert.wgsl';
import redFragWGSL from './shaders/triangle.frag.wgsl';


let d = { "id": 48, "x": 324, "y": 77, "width": 22, "height": 32, "xoffset": 1, "yoffset": 8, "xadvance": 26, "page": 0, "chnl": 0 }
let width = 512
let height = 512

const vertices = new Float32Array([
  1., 1.0, 0.0, (d.x + d.width) / width, (d.y + d.height) / height, // top right
  1., 0.85, 0.0, (d.x + d.width) / width, (d.y / height), // bottom right
  0.9, 0.85, 0.0, (d.x / width), (d.y / height), // bottom left
  0.9, 1., 0.0, (d.x / width), (d.y + d.height) / height
])

console.log(vertices)

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
    // alphaMode: 'opaque'
    alphaMode: 'premultiplied',
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
      format: 'float32x2'
    }],
    arrayStride: 20, // sizeof(float) * 3
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
        clearValue: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
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
  const response2 = await fetch('/b612.json');
  console.log(await response2.json())
  const response = await fetch('/b612.png');
    const imageBitmap = await createImageBitmap(await response.blob());
    console.log(response, imageBitmap)

    const texture = device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    console.log(texture)
    
    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: texture },
      [imageBitmap.width, imageBitmap.height]
    );

  const sampler = device.createSampler({
    addressModeU: "repeat",
    addressModeV: "repeat",
    magFilter: "linear",
    minFilter: "linear",
    mipmapFilter: "linear",
  });

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: sampler,

      },
      {
        binding: 1,
        resource: texture.createView(),
      },
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
  document.body.appendChild(canvas)
  
// await device.queue.onSubmittedWorkDone()
  
}

window.addEventListener('load', async () => {
  main()
})

