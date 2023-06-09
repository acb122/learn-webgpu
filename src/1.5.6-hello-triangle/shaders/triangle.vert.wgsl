@vertex
fn main(
  @location(0) pos: vec3f
) -> @builtin(position) vec4<f32> {
  return vec4f(pos, 1.0);
}