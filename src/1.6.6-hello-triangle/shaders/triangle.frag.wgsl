struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) vertexColor: vec3f,
};

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
  return vec4f(input.vertexColor,1.0);
}