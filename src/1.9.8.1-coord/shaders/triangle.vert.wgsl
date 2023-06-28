struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) vertexColor: vec3f,
    @location(1) textCoord: vec2f
};

@group(0) @binding(3) var<uniform> model: mat4x4<f32>;
@group(0) @binding(4) var<uniform> view: mat4x4<f32>;
@group(0) @binding(5) var<uniform> projection: mat4x4<f32>;


@vertex
fn main(
  @location(0) pos: vec3f,
  @location(1) textCoord: vec2f,
) -> VertexOutput {
  var output: VertexOutput;
  output.position= projection* view * model * vec4f(pos, 1.0);
  output.vertexColor=vec3f(1.);
  output.textCoord=textCoord;
  return output;
}