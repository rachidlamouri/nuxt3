<script setup>
const route = useRoute()
// console.log(route)
const crumbs = route.path.split('/')
// console.log(crumbs)
</script>

<template>
  <div class="stepper b-red">
    <ol class="" role="list" aria-label="Checkout steps">
      <li data-status="complete">
        <span aria-hidden="true">Step one</span>
        <strong>Shopping bag</strong>
      </li>
      <li data-status="complete">
        <span aria-hidden="true">Step two</span>
        <strong>Your details</strong>
      </li>
      <li data-status="complete">
        <span aria-hidden="true">Step two</span>
        <strong>Shipping</strong>
      </li>
      <li aria-current="step">
        <span aria-hidden="true">Step three</span>
        <strong>Payment</strong>
      </li>
      <li>
        <span aria-hidden="true">Step four</span>
        <strong>Review</strong>
      </li>
      <li>
        <span aria-hidden="true">Step four</span>
        <strong>Conformation</strong>
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.stepper {
  padding: 1rem;
  font-size: var(--font-size--1);
  ol {
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      flex: 1;
      // display: block;
      // border: 1px solid red;
      // display: flex;
      // flex-direction: column;
      padding: 1rem 2rem;

      span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: green;
        &::after {
          content: '';
          width: 1.2rem;
          height: 1.2rem;
          border: 1px solid red;
          // color: black;
          border-radius: 100%;
          background-color: var(--color-primary, green);

          background-repeat: no-repeat;
        }
      }

      &[data-status='complete'] {
        border-block-end: 3px solid green;
        span {
          &::after {
            content: '';
            // width: 1rem;
            // height: 1rem;
            // background-color: var(--color-primary, red);
            background-color: var(--color-primary, pink);
            background-image: url('data:image/svg+xml;utf8,<svg fill="white" width="9" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M7.868.141a.474.474 0 01.03.652L3.244 6.087a.433.433 0 01-.627.028L.292 3.911a.474.474 0 01-.03-.652.433.433 0 01.628-.028l1.996 1.892L7.24.17A.433.433 0 017.868.14z"/></svg>');
            background-size: 9px 7px;
            background-position: center center;
            background-repeat: no-repeat;
            border-color: var(--color-primary, black);
          }
        }
      }

      .material-symbols-outlined {
        width: 2rem;
        height: 2rem;
        background-color: red;
        display: grid;
        place-items: center;
      }

      .inner {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
