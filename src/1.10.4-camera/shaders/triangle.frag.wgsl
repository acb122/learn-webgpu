struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) vertexColor: vec3f,
    @location(1) textCoord: vec2f
};

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture0: texture_2d<f32>;
@group(0) @binding(2) var myTexture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
  return mix(
    textureSample(myTexture0, mySampler, input.textCoord),
    textureSample(myTexture1, mySampler, vec2f(input.textCoord.x, (input.textCoord.y *-1)+1))
    ,0.2);
}