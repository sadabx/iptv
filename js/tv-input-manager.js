(() => {
  const KEY_BY_CODE = {
    4: { key: "Escape", code: "Escape" },
    13: { key: "Enter", code: "Enter" },
    19: { key: "ArrowUp", code: "ArrowUp" },
    20: { key: "ArrowDown", code: "ArrowDown" },
    21: { key: "ArrowLeft", code: "ArrowLeft" },
    22: { key: "ArrowRight", code: "ArrowRight" },
    23: { key: "Enter", code: "Enter" },
    66: { key: "Enter", code: "Enter" },
    82: { key: "ContextMenu", code: "ContextMenu" },
    85: { key: " ", code: "Space" },
    126: { key: "MediaPlay", code: "MediaPlay" },
    127: { key: "MediaPause", code: "MediaPause" },
    164: { key: "AudioVolumeMute", code: "AudioVolumeMute" },
  };

  const GAMEPAD_BUTTONS = {
    0: { key: "Enter", code: "Enter" },
    1: { key: "Escape", code: "Escape" },
    8: { key: "Escape", code: "Escape" },
    9: { key: "ContextMenu", code: "ContextMenu" },
    12: { key: "ArrowUp", code: "ArrowUp" },
    13: { key: "ArrowDown", code: "ArrowDown" },
    14: { key: "ArrowLeft", code: "ArrowLeft" },
    15: { key: "ArrowRight", code: "ArrowRight" },
  };

  const GAMEPAD_REPEAT_START = 420;
  const GAMEPAD_REPEAT_EVERY = 110;
  const AXIS_DEADZONE = 0.55;

  const heldButtons = new Map();
  const heldAxes = new Map();

  function keyCodeFor(key) {
    switch (key) {
      case "ArrowUp": return 38;
      case "ArrowDown": return 40;
      case "ArrowLeft": return 37;
      case "ArrowRight": return 39;
      case "Enter": return 13;
      case "Escape": return 27;
      case " ": return 32;
      default: return 0;
    }
  }

  function dispatchNormalizedKey(input, type = "keydown") {
    const keyCode = keyCodeFor(input.key);
    const event = new KeyboardEvent(type, {
      key: input.key,
      code: input.code,
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperties(event, {
      keyCode: { get: () => keyCode },
      which: { get: () => keyCode },
      __t9tvNormalizedInput: { value: true },
      __t9tvInputSource: { value: input.source || "tv" },
    });

    document.dispatchEvent(event);
  }

  function normalizeRemoteKey(event) {
    if (event.__t9tvNormalizedInput) return;

    const mapped = KEY_BY_CODE[event.keyCode || event.which];
    if (!mapped) return;

    const alreadyUsable =
      event.key === mapped.key ||
      (mapped.key === "Enter" && (event.key === "OK" || event.key === "Select")) ||
      (mapped.key === "Escape" && (event.key === "Back" || event.key === "BrowserBack"));

    if (alreadyUsable) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    dispatchNormalizedKey({ ...mapped, source: "remote" }, event.type);
  }

  function axisDirection(gamepad) {
    const x = gamepad.axes[0] || 0;
    const y = gamepad.axes[1] || 0;

    if (Math.abs(x) < AXIS_DEADZONE && Math.abs(y) < AXIS_DEADZONE) return null;
    if (Math.abs(x) > Math.abs(y)) return x > 0 ? GAMEPAD_BUTTONS[15] : GAMEPAD_BUTTONS[14];
    return y > 0 ? GAMEPAD_BUTTONS[13] : GAMEPAD_BUTTONS[12];
  }

  function updateHeldInput(store, id, input, pressed, now) {
    const held = store.get(id);

    if (!pressed) {
      if (held) {
        dispatchNormalizedKey({ ...held.input, source: "gamepad" }, "keyup");
        store.delete(id);
      }
      return;
    }

    if (!held || held.input.key !== input.key) {
      if (held) dispatchNormalizedKey({ ...held.input, source: "gamepad" }, "keyup");
      dispatchNormalizedKey({ ...input, source: "gamepad" });
      store.set(id, { input, nextRepeatAt: now + GAMEPAD_REPEAT_START });
      return;
    }

    if (now >= held.nextRepeatAt) {
      dispatchNormalizedKey({ ...input, source: "gamepad" });
      held.nextRepeatAt = now + GAMEPAD_REPEAT_EVERY;
    }
  }

  function pollGamepads(now = performance.now()) {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];

    for (const gamepad of pads) {
      if (!gamepad) continue;

      for (const [buttonIndex, input] of Object.entries(GAMEPAD_BUTTONS)) {
        const button = gamepad.buttons[buttonIndex];
        updateHeldInput(
          heldButtons,
          `${gamepad.index}:button:${buttonIndex}`,
          input,
          Boolean(button && button.pressed),
          now
        );
      }

      const input = axisDirection(gamepad);
      updateHeldInput(heldAxes, `${gamepad.index}:axis:left`, input, Boolean(input), now);
    }

    requestAnimationFrame(pollGamepads);
  }

  document.addEventListener("keydown", normalizeRemoteKey, true);
  document.addEventListener("keyup", normalizeRemoteKey, true);
  requestAnimationFrame(pollGamepads);

  window.T9TVInputManager = {
    dispatch: dispatchNormalizedKey,
  };
})();
