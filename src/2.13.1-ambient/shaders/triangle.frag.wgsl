// struct VertexOutput {
//     @builtin(position) position: vec4f
// };

@group(0) @binding(0) var<uniform> objectColor: vec3<f32>;
@group(0) @binding(1) var<uniform> lightColor: vec3<f32>;

@fragment
fn main() -> @location(0) vec4<f32> {
  return vec4f(lightColor * objectColor, 1.);
}