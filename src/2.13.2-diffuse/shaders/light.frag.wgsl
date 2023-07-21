// struct VertexOutput {
//     @builtin(position) position: vec4f
//     // @location(0) vertexColor: vec3f,
//     // @location(1) textCoord: vec2f
// };

// @group(0) @binding(0) var<uniform> objectColor: vec3<f32>;
// @group(0) @binding(1) var<uniform> lightColor: vec3<f32>;

@fragment
fn main() -> @location(0) vec4<f32> {
  return vec4f(1.);
}