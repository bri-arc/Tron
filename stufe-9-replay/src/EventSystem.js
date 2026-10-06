export class EventSystem extends EventTarget {
  emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail })); }
}
