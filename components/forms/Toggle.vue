<script setup lang="ts">
const toggleRef = ref()

onMounted(() => {
  toggleRef.value.removeAttribute('hidden')
})

const switchMode = (event: any) => {
  console.log(event.target.checked)
  if (event.target.checked) {
    document.body.classList.add('dark')
  } else document.body.classList.remove('dark')
}
</script>

<template>
  <label class="toggle" for="toggle-element" ref="toggleRef" hidden>
    <span class="toggle__label">Dark mode</span>
    <input
      type="checkbox"
      role="switch"
      class="toggle__element"
      id="toggle-element"
      @change="switchMode"
    />
    <div class="toggle__decor" aria-hidden="true">
      <div class="toggle__thumb"></div>
      <svg
        class="toggle__icon"
        data-state="checked"
        focusable="false"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 32 32"
      >
        <path
          d="M24.633 22.184c-8.188 0-14.82-6.637-14.82-14.82 0-2.695 0.773-5.188 2.031-7.363-6.824 1.968-11.844 8.187-11.844 15.644 0 9.031 7.32 16.355 16.352 16.355 7.457 0 13.68-5.023 15.648-11.844-2.18 1.254-4.672 2.028-7.367 2.028z"
        ></path>
      </svg>
      <svg
        class="toggle__icon"
        data-state="un-checked"
        focusable="false"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 32 32"
      >
        <path
          d="M16.001 8c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 7.999-3.582 7.999-8s-3.581-8-7.999-8v0zM14 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM4 6c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM2 14c1.105 0 2 0.895 2 2 0 1.107-0.895 2-2 2s-2-0.893-2-2c0-1.105 0.895-2 2-2zM4 26c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM14 30c0-1.109 0.895-2 2-2 1.108 0 2 0.891 2 2 0 1.102-0.892 2-2 2-1.105 0-2-0.898-2-2zM24 26c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM30 18c-1.104 0-2-0.896-2-2 0-1.107 0.896-2 2-2s2 0.893 2 2c0 1.104-0.896 2-2 2zM24 6c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2z"
        ></path>
      </svg>
    </div>
  </label>
</template>

<style lang="scss" scoped>
.toggle {
  --color-day-bg: #0984e3;
  --color-day-icon: #ffe4a1;
  --color-night-bg: #032b43;
  --color-night-icon: #b9c6d3;
  --color-light: #ffffff;
  --color-dark: #4a4a4a;
  --color-charcoal: #252525;
  --color-shadow-light: rgba(48, 48, 48, 0.15);
  --color-shadow-mid: rgba(0, 0, 0, 0.25);
  --color-shadow-dark: rgba(0, 0, 0, 0.9);
  --font-base-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  --font-label-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  --metric-toggle-thumb-size: 1.4rem;
  --metric-toggle-thumb-space: 0.25rem;
  --metric-toggle-icon-space: 0.4rem;
  --transition-snappy-duration: 500ms;
  --transition-silky-duration: 200ms;
  --transition-icon: opacity var(--transition-snappy-duration) ease,
    transform var(--transition-silky-duration) cubic-bezier(1, 0, 0.55, 0.85);
  --transition-delay-icon: 100ms;
}

.toggle {
  line-height: 1;
  font-weight: 900;
  text-transform: uppercase;
  position: relative;

  &:not([hidden]) {
    display: flex;
    align-items: center;
  }
}

.toggle__element {
  opacity: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  // right: var(--metric-toggle-thumb-size);
  width: 1em;
  height: 1em;
}

.toggle__decor {
  --color-toggle-decor-bg: #032b43;

  display: block;
  position: relative;
  overflow: hidden;
  width: calc(
    (var(--metric-toggle-thumb-size) * 2) +
      (var(--metric-toggle-thumb-space) * 2)
  );
  height: calc(
    var(--metric-toggle-thumb-size) + (var(--metric-toggle-thumb-space) * 2)
  );
  background: var(--color-toggle-decor-bg);
  margin-left: 0.5rem;
  border-radius: var(--metric-toggle-thumb-size);
  transition: background var(--transition-snappy-duration);
  transition-delay: var(--transition-snappy-duration);
  box-sizing: content-box;
  border: 1px solid var(--color-light);
}

.toggle__thumb {
  display: grid;
  place-items: center;
  width: var(--metric-toggle-thumb-size);
  height: var(--metric-toggle-thumb-size);
  border-radius: var(--metric-toggle-thumb-size);
  background: linear-gradient(
      229.84deg,
      rgba(255, 255, 255, 0) 14.29%,
      rgba(48, 48, 48, 0.15) 81.82%
    ),
    #ffffff;
  color: var(--color-day-icon);
  box-shadow: 0 0 var(--metric-toggle-thumb-space) var(--color-shadow-mid);
  position: absolute;
  top: var(--metric-toggle-thumb-space);
  left: var(--metric-toggle-thumb-space);
  transform: none;
  transition: transform var(--transition-silky-duration)
    cubic-bezier(1, 0, 0.55, 0.85);
  will-change: transform;
  z-index: 1;
}

.toggle__thumb::before {
  content: '';
  display: none;
  width: calc(
    var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
  );
  height: calc(
    var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
  );
  border: 2px solid var(--color-dark);
  border-radius: calc(
    var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
  );
}

.toggle__icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9em;
}

.toggle__icon[data-state='checked'] {
  left: var(--metric-toggle-icon-space);
  fill: var(--color-night-icon);
  opacity: 0;
  transform: translateY(-1rem);
}

.toggle__icon[data-state='un-checked'] {
  right: var(--metric-toggle-icon-space);
  fill: var(--color-day-icon);
  transition: var(--transition-icon);
  transition-delay: var(--transition-delay-icon);
}

.toggle__decor:hover .toggle__thumb {
  margin-left: 1px;
}

:checked + .toggle__decor:hover .toggle__thumb {
  margin-left: -1px;
}

:checked + .toggle__decor {
  --color-toggle-decor-bg: var(--color-night-bg);
}

:checked + .toggle__decor .toggle__thumb {
  transform: translateX(var(--metric-toggle-thumb-size)) rotate(270deg);
  box-shadow: 0 0 var(--metric-toggle-thumb-space) var(--color-shadow-dark);
}

:checked + .toggle__decor .toggle__icon[data-state='checked'] {
  opacity: 1;
  transform: translateY(-50%);
  transition: var(--transition-icon);
  transition-delay: var(--transition-delay-icon);
}

:checked + .toggle__decor .toggle__icon[data-state='un-checked'] {
  opacity: 0;
  transform: translateY(1rem);
  transition: none;
}

:focus + .toggle__decor:not(:hover) .toggle__thumb::before {
  display: block;
}

:disabled + .toggle__decor {
  filter: grayscale(1) brightness(1.5);
  cursor: not-allowed;
}

// :root {
//   --metric-toggle-thumb-size: 1rem;
//   --metric-toggle-thumb-space: 0.25rem;
//   --color-primary: #3740ff;
//   --color-primary-dark: #272eb5;
//   --color-primary-light: #3740ff;
//   --color-primary-x-light: #e8f0fe;
//   --color-light: #ffffff;
//   --color-dark: #202124;
//   --color-off-white: #f3f4f4;
//   --color-mid: #5f6368;
//   --color-mid-dark: #3c4043;
//   --color-stroke: #dadce0;
//   --metric-gutter: 1.5rem;
//   --metric-box-spacing: 1rem;
//   --metric-radius: 3px;
//   --generic-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3),
//     0px 2px 6px 2px rgba(60, 64, 67, 0.15);
//   --font-mono: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
// }
// :checked ~ .toggle__decor {
//   background: rebeccapurple;
// }

// :checked ~ .toggle__decor .toggle__thumb {
//   transform: translateX(var(--metric-toggle-thumb-size)) rotate(270deg);
// }

// /* TOGGLE */
// .toggle {
//   --metric-toggle-thumb-size: 1rem;
//   --metric-toggle-thumb-space: 0.25rem;

//   position: relative;
//   display: inline-flex;
//   align-items: center;
// }

// .toggle__element {
//   opacity: 0;
//   position: absolute;
//   top: 50%;
//   transform: translateY(-50%);
//   right: var(--metric-toggle-thumb-size);
//   width: 1em;
//   height: 1em;
// }

// .toggle__decor {
//   display: block;
//   position: relative;
//   overflow: hidden;
//   width: calc(
//     (var(--metric-toggle-thumb-size) * 2) +
//       (var(--metric-toggle-thumb-space) * 2)
//   );
//   height: calc(
//     var(--metric-toggle-thumb-size) + (var(--metric-toggle-thumb-space) * 2)
//   );
//   background: var(--color-mid);
//   margin-left: 0.5rem;
//   border-radius: var(--metric-toggle-thumb-size);
//   box-sizing: content-box;
//   border: 1px solid var(--color-light);
// }

// .toggle__thumb {
//   display: grid;
//   place-items: center;
//   width: var(--metric-toggle-thumb-size);
//   height: var(--metric-toggle-thumb-size);
//   border-radius: var(--metric-toggle-thumb-size);
//   background: linear-gradient(
//       229.84deg,
//       rgba(255, 255, 255, 0) 14.29%,
//       rgba(48, 48, 48, 0.15) 81.82%
//     ),
//     #ffffff;
//   box-shadow: var(--generic-shadow);
//   position: absolute;
//   top: var(--metric-toggle-thumb-space);
//   left: var(--metric-toggle-thumb-space);
//   transform: none;
//   transition: transform 200ms cubic-bezier(1, 0, 0.55, 0.85);
//   will-change: transform;
//   z-index: 1;
// }

// .toggle__thumb::before {
//   content: '';
//   display: none;
//   width: calc(
//     var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
//   );
//   height: calc(
//     var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
//   );
//   border: 1px solid var(--color-primary-light);
//   border-radius: calc(
//     var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
//   );
// }

// .toggle__thumb::before {
//   content: '';
//   display: none;
//   width: calc(
//     var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
//   );
//   height: calc(
//     var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
//   );
//   border: 1px solid var(--color-primary);
//   border-radius: calc(
//     var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
//   );
// }

// .toggle__decor:hover .toggle__thumb {
//   margin-left: 1px;
// }

// :checked + .toggle__decor:hover .toggle__thumb {
//   margin-left: -1px;
// }

// :checked + .toggle__decor {
//   background: var(--color-primary-light);
// }

// :checked + .toggle__decor .toggle__thumb {
//   transform: translateX(var(--metric-toggle-thumb-size)) rotate(270deg);
// }

// :focus + .toggle__decor:not(:hover) .toggle__thumb::before {
//   display: block;
// }

// :disabled + .toggle__decor {
//   filter: grayscale(1) brightness(1.5);
//   cursor: not-allowed;
// }

/* Note the rest of the CSS for this toggle is pulled in externally */
</style>
