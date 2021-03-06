var types = require('base/types')
var painter = require('services/painter')

module.exports = class ShadowQuad extends require('shaders/quad'){

	// special
	prototype(){
		this.props = {

			shadowColor: {pack:'float12', value:[0,0,0,0.5]},
			shadowBlur: 0.0,
			shadowSpread: 0.0,
			shadowOffset: {value:[0.0,0.0]},

			mesh:{kind:'geometry', type:types.vec3},
		}

		this.mesh = new painter.Mesh(types.vec3).push(
			0,0,0,
			0,1,0,
			1,0,0,
			1,1,0,
			0,0,1,
			0,1,1,
			1,0,1,
			1,1,1
		)
		this.indices = new painter.Mesh(types.uint16)
		this.indices.push(0,1,2,2,1,3,4,5,6,6,5,7)
	}

	vertex(){$
		this.vertexPre()
		this.vertexStyle()

		if (this.visible < 0.5) return vec4(0.0)

		// compute the normal rect positions
		var delta = vec2(0.)
		if(this.mesh.z < 0.5){
			delta = this.shadowOffset.xy + vec2(this.shadowSpread) * (this.mesh.xy *2. - 1.)//+ vec2(this.shadowBlur*0.25) * meshm
		}

		var pos = this.scrollAndClip(this.mesh.xy, delta)

		var adjust = 1.
		if(this.mesh.z < 0.5){
			// bail if we have no visible shadow
			if(abs(this.shadowOffset.x)<0.001 && abs(this.shadowOffset.y)<0.001 && this.shadowBlur<2.0 && abs(this.shadowSpread) < 0.001){
				return vec4(0)
			}
			adjust = max(1.,this.shadowBlur)
		}

		this.pos = pos

		return vec4(pos,0.,1.) * this.viewPosition * this.camPosition * this.camProjection
	}

	pixel(){$
		if(this.mesh.z <.5){
			return this.shadowColor
		}
		return this.color
	}
}