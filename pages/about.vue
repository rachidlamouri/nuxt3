<script setup lang="ts">
// definePageMeta({
//   title: 'About',
//   description:
//     'A leader in the design, development, manufacture, and delivery of Aerospace Engine/Airframe PMA parts to service the global Aftermarket',
// })

const pageTitle = 'About'
</script>

<template>
  <div class="">
    <Head>
      <Title>ACS | {{ pageTitle }}</Title>
      <Meta name="description" :content="pageTitle" />
    </Head>
    <article class="hero">
      <div class="hero__inner | flow container">
        <div>
          <p class="panorama">Aviation Component Solutions</p>
          <h1>A Leading Supplier of OEM Alternative Parts</h1>
        </div>
        <p>
          <abbr title="Aviation Component Solutions">ACS </abbr> strives to be the leader in the design, development,
          manufacturing, and delivery of Aerospace Engine/Airframe PMA parts to service the global Aftermarket segment
          using continuous improvement to drive stakeholder satisfaction.
        </p>
        <a href="#" class="btn btn-secondary">Explore Our Catalog</a>
      </div>
    </article>
    <article class="">
      <div class="container">
        <h2>All ACS parts are FAA-PMA approved</h2>
        <button class="btn">
          <IconsPerson />
          <span>Test</span>
          <IconsBag />
        </button>
        <p>
          We realize there’s more to our customer’s purchasing decision than just price. This is why ACS seeks not only
          to provide the best pricing in the industry, but to create value using any means available to us. Stocking
          100% of our inventory for next day delivery, offering eCommerce solutions for online customers, utilizing the
          latest data management technology, and offering the latest manufacturing / design solutions are some of the
          many methods we’ve adopted to create value for our customers.
        </p>
        <ul class="grid" role="list" ref="featuresRef">
          <li>
            <IconsPerson class="w-6 h-6" />
            <h3>Design and Engineering</h3>
            <p>
              To assure customers that the parts we provide will perform as promised, both functional and dimensional
              analyses are critical to our design process.
            </p>
          </li>
          <li>
            <IconsPerson class="w-6 h-6" />
            <h3>Quality Control</h3>
            <p>
              The driving force behind our approach to quality control is simple – to assure that our customers receive
              the highest quality, airworthy parts, every single time they order.
            </p>
          </li>
          <li>
            <IconsPerson class="" />
            <h3>Materials Testing</h3>
            <p>
              Our partnership with some of the industry’s most sophisticated Materials Labs provides us with the ability
              to investigate chemical, mechanical, and metallurgical properties of the candidate part to match material,
              hardness, and strength.
            </p>
          </li>
        </ul>
        <a href="#">Learn More</a>
      </div>
    </article>
    <article class="">
      <h2>Our Team</h2>
      <ul class="grid" role="list">
        <li>
          <img src="/images/mike-carabotta.png" alt="Mike Carabotta, Engineering Manager" />
          <h4>Mike Carabotta</h4>
          <p>Engineering Manager</p>
          <p>Mike is directly responsible for the continued expansion of our already-vast catalog.</p>
        </li>
        <li>
          <img src="/images/joe-klinehamer.png" alt="Mike Carabotta, Engineering Manager" />
          <h4>Joe Klinehamer</h4>
          <p>President</p>
          <p>Joe is always looking for the next opportunity to expand and develop our business at ACS.</p>
        </li>
        <li>
          <img src="/images/mitch-kokish.png" alt="Mike Carabotta, Engineering Manager" />
          <h4>Mitch Kokish Carabotta</h4>
          <p>Quality Manager</p>
          <p>Mike is a certified FAA Manufacturing DAR with involvement in over 500 certification projects.</p>
        </li>
      </ul>
      <a href="#">Learn More</a>
      <a href="#">Contact Us</a>
    </article>
    <article class="">
      <h2>Ready to work with us</h2>
      <blockquote>
        <p>
          It was as though the web design community were participating in a shared consensual hallucination. Rather than
          acknowledge the flexible nature of the browser window, they chose to settle on one set width as the ideal
          …even if that meant changing the ideal every few years.
        </p>
        <p>Jeremy Keith - Resilient Web Design</p>
      </blockquote>
      <address>
        <p>26451 Curtiss Wright Pkwy</p>
        <p>Cleveland, OH 44143</p>
        <a href="tel:Phone: +14402956590">+1 (440) 295-6590 x 111</a>
      </address>
    </article>
  </div>
</template>

<style scoped lang="scss">
article {
  // border: 2px solid green;
  // --flow-space: 2rem;
}
</style>
