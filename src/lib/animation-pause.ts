const ANIMATIONS_PAUSED_CLASS = 'animations-paused';

const activeReasons = new Set<string>();

function syncAnimationsPausedClass() {
  document.documentElement.classList.toggle(ANIMATIONS_PAUSED_CLASS, activeReasons.size > 0);
}

export function pauseAnimations(reason: string) {
  activeReasons.add(reason);
  syncAnimationsPausedClass();
}

export function resumeAnimations(reason: string) {
  activeReasons.delete(reason);
  syncAnimationsPausedClass();
}
