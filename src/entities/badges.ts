interface Badge {
  conditionToWin(): boolean;
}

class PupilBadge implements Badge {
  conditionToWin() {
    return true;
  }
}

export {
  PupilBadge
};
