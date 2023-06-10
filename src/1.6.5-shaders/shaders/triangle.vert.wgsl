struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) vertexColor: vec3f,
};

@vertex
fn main(
  @location(0) pos: vec3f,
  @location(1) color: vec3f,
) -> VertexOutput {
  var output: VertexOutput;
  output.position=vec4f(pos, 1.0);
  output.vertexColor=color;
  return output;
}