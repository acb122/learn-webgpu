struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) vertexColor: vec3f,
    @location(1) textCoord: vec2f
};

@group(0) @binding(3) var<uniform> transform: mat4x4<f32>;


@vertex
fn main(
  @location(0) pos: vec3f,
  @location(1) color: vec3f,
  @location(2) textCoord: vec2f,
) -> VertexOutput {
  var output: VertexOutput;
  output.position= transform * vec4f(pos, 1.0);
  output.vertexColor=color;
  output.textCoord=textCoord;
  return output;
}