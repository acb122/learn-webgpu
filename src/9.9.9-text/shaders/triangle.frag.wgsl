struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) vertexColor: vec3f,
    @location(1) textCoord: vec2f
};

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
  return textureSample(myTexture, mySampler, input.textCoord);
}