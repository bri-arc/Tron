export class CameraManager {
  focus(snapshot, riderId) {
    return snapshot.riders.find(rider => rider.id === riderId) ?? snapshot.riders[0];
  }
}
