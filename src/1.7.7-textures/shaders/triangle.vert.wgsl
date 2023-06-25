struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) vertexColor: vec3f,
    @location(1) textCoord: vec2f
};

@vertex
fn main(
  @location(0) pos: vec3f,
  @location(1) color: vec3f,
  @location(2) textCoord: vec2f,
) -> VertexOutput {
  var output: VertexOutput;
  output.position=vec4f(pos, 1.0);
  output.vertexColor=color;
  output.textCoord=textCoord;
  return output;
}