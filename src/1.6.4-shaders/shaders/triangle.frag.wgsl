@group(0) @binding(0) var<uniform> ourColor: vec4f;

@fragment
fn main() -> @location(0) vec4<f32> {
  return ourColor;
}