import * as glm from 'glm-js'

export class Camera {
  lastX = undefined
  lastY = undefined;
  yaw = -90.;
  pitch = 0.;
  zoom = 45.
  cameraPos = glm.vec3(0., 0., 3.)
  cameraFront = glm.vec3(0., 0., -1.)
  cameraUp = glm.vec3(0., 1., 0.)

  lastTs = 0
  deltaTs = 0

  constructor(private parent: any, canvas: HTMLCanvasElement) {
    console.log('test')
    document.addEventListener('wheel', (e: any) => {
      this.zoom += e.wheelDeltaY / 100 * -1
    })

    canvas.addEventListener('mousemove', (e: any) => {
      if (!this.lastX) {
        this.lastX = e.x;
        this.lastY = e.y;
        return
      }
      let xoffset = e.x - this.lastX;
      let yoffset = this.lastY - e.y; // reversed: y ranges bottom to top
      this.lastX = e.x;
      this.lastY = e.y;
      let sensitivity = 0.25;
      xoffset *= sensitivity;
      yoffset *= sensitivity;
      this.yaw += xoffset;
      this.pitch += yoffset;
      if (this.pitch > 89.0) {
        this.pitch = 89.0;
      }
      if (this.pitch < -89.0) {
        this.pitch = -89.0;
      }
      let direction = glm.vec3();
      direction.x = Math.cos(glm.radians(this.yaw)) * Math.cos(glm.radians(this.pitch));
      direction.y = Math.sin(glm.radians(this.pitch));
      direction.z = Math.sin(glm.radians(this.yaw)) * Math.cos(glm.radians(this.pitch));
      this.cameraFront = glm.normalize(direction);
    })



    document.addEventListener('keydown', (e) => {
      const cameraSpeed = this.deltaTs / 1e3; // adjust accordingly
      if (e.key == 'w') {
        this.cameraPos = this.cameraPos.add(this.cameraFront.mul(cameraSpeed));
      }
      if (e.key == 's') {
        this.cameraPos = this.cameraPos.sub(this.cameraFront.mul(cameraSpeed));
      }
      if (e.key == 'a') {
        this.cameraPos = this.cameraPos.sub(glm.normalize(glm.cross(this.cameraFront, this.cameraUp)).mul(cameraSpeed));
      } if (e.key == 'd') {
        this.cameraPos = this.cameraPos.add(glm.normalize(glm.cross(this.cameraFront, this.cameraUp)).mul(cameraSpeed))
      }
    })
  }

  getViewMatrix() {
    return glm.lookAt(this.cameraPos, this.cameraPos.add(this.cameraFront), this.cameraUp)
  }
} 