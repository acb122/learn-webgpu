struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) vertexColor: vec4f,
};

@vertex
fn main(
  @location(0) pos: vec3f
) -> VertexOutput {
  var output: VertexOutput;
  output.position=vec4f(pos, 1.0);
  output.vertexColor=vec4f(.5,.0,.0, 1.0);
  return output;
}