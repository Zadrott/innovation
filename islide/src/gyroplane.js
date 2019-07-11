class Gyroplane {
  static getY(beta) {
    const MAX_Y_ANGLE = 10;
    if (
      (beta > 0 && beta <= MAX_Y_ANGLE) ||
      (beta < 0 && beta >= MAX_Y_ANGLE * -1)
    ) {
      return (100 / MAX_Y_ANGLE) * (beta * -1);
    } else {
      if (beta > 0) {
        return -100;
      } else {
        return 100;
      }
    }
  }

  static getX(alpha) {
    const MAX_X_ANGLE = 10;

    // Left/right rotation.
    if (alpha > 360 - MAX_X_ANGLE) {
      // phone is rotating right:
      return (100 / MAX_X_ANGLE) * (360 - alpha);
    } else if (alpha < MAX_X_ANGLE) {
      // phone is rotating left:
      return (100 / MAX_X_ANGLE) * (0 - alpha);
    } else {
      // Stop rotation at max angle.
      if (alpha > MAX_X_ANGLE && alpha < 180) {
        return -100;
      } else {
        return 100;
      }
    }
  }
}

module.exports = {Gyroplane};
