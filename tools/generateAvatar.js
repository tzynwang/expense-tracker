const { AvatarGenerator } = require('random-avatar-generator')
const generator = new AvatarGenerator()

function generateAvatar (seed) {
  return generator.generateRandomAvatar(seed)
}

module.exports = { generateAvatar }
