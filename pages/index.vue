<script setup lang="ts">
// la3omW7HsvtHnq0N
definePageMeta({
  title: 'Home',
  description:
    'A leader in the design, development, manufacture, and delivery of Aerospace Engine/Airframe PMA parts to service the global Aftermarket',
  // layout: 'home',
})
// const pageTitle = 'Home'

const headerRef = ref()

const salesDirectors = ref([
  {
    name: 'Elizabeth Arguello',
    title: 'Sales Director',
    phoneNumber: '(786) -597-1609',
    email: 'arguello@acs-parts.com',
    image: 'new-york.jpg',
  },
  {
    name: 'ERick C. Ray',
    title: 'Sales Director',
    phoneNumber: '1.801.446.1040',
    email: 'Ray@acs-parts.com',
    image: 'san-francisco.jpg',
  },
  {
    name: 'Elizabeth Arguello',
    title: 'Sales Director',
    phoneNumber: '(786) -597-1609',
    email: 'arguello@acs-parts.com',
    image: 'rio.jpg',
  },
  {
    name: 'Brandon Detzel',
    title: 'Sales Director',
    phoneNumber: '1.440.569.1825',
    email: 'detzel@acs-parts.com',
    image: 'barcelona.jpg',
  },
  {
    name: 'Bing Li',
    title: 'Sales Director',
    phoneNumber: '86.1381.002.5764',
    email: 'li@acs-parts.com',
    image: 'shanghai.jpg',
  },
  {
    name: 'Robyn Frank',
    title: 'Sales Director',
    phoneNumber: '1.210.380.9988',
    email: 'frank.robyn3@gmail.com',
    image: 'us-army.jpg',
  },
])

// const currentRoute = computed(() => useRoute().name)
</script>

<template>
  <div class="content-wrapper">
    <!-- IIIIII{{ useHello }} -->
    <Hero class="hero" bgImage="/images/home-page-hero.jpg">
      <template #panorama>
        <p class="panorama">Aviation Component Solutions</p>
      </template>
      <template #heading>
        <h1>A Leading Supplier of OEM Alternative Parts</h1>
      </template>
      <template #default>
        <p>
          <abbr title="Aviation Component Solutions">ACS </abbr> strives to be the leader in the design, development,
          manufacturing, and delivery of Aerospace Engine/Airframe PMA parts to service the global Aftermarket segment
          using continuous improvement to drive stakeholder satisfaction.
        </p>
      </template>
      <template #footer>
        <a href="#" class="btn btn-accent">Explore Our Catalog</a>
      </template>
    </Hero>

    <article class="capabilities">
      <div class="flow container | py-xl z-1 bg-white">
        <h2 class="center">All ACS parts are FAA-PMA approved</h2>
        <div class="center">
          <p class="">
            We realize there’s more to our customer’s purchasing decision than just price. This is why ACS seeks not
            only to provide the best pricing in the industry, but to create value using any means available to us.
            Stocking 100% of our inventory for next day delivery, offering eCommerce solutions for online customers,
            utilizing the latest data management technology, and offering the latest manufacturing / design solutions
            are some of the many methods we’ve adopted to create value for our customers.
          </p>
        </div>
        <div>
          <ul class="gap-l" role="list">
            <li class="">
              <div class="flex items-center gap-xs">
                <div class="bg-primary-30 center p-2xs br-full">
                  <span class="material-symbols-outlined text-primary-99" aria-hidden="true">design_services</span>
                </div>
                <h3 class="text-0 font-bold">Design and Engineering</h3>
              </div>
              <p>
                To assure customers that the parts we provide will perform as promised, both functional and dimensional
                analyses are critical to our design process.
              </p>
            </li>
            <li>
              <div class="flex items-center gap-xs">
                <div class="bg-primary-30 center p-2xs br-full">
                  <span class="material-symbols-outlined text-primary-99" aria-hidden="true">verified</span>
                </div>
                <h3 class="text-0 font-bold">Quality Control</h3>
              </div>
              <p>
                The driving force behind our approach to quality control is simple – to assure that our customers
                receive the highest quality, airworthy parts, every single time they order.
              </p>
            </li>
            <li>
              <div class="flex items-center gap-xs">
                <div class="bg-primary-30 center p-2xs br-full">
                  <span class="material-symbols-outlined text-primary-99" aria-hidden="true">science</span>
                </div>
                <h3 class="text-0 font-bold">Materials Testing</h3>
              </div>
              <p>
                Our partnership with some of the industry’s most sophisticated Materials Labs provides us with the
                ability to investigate chemical, mechanical, and metallurgical properties of the candidate part to match
                material, hardness, and strength.
              </p>
            </li>
          </ul>
        </div>
        <div class="center">
          <a class="btn btn-primary" href="#">Learn More</a>
        </div>
      </div>
    </article>
    <article class="team">
      <div class="container flow | py-xl">
        <h2 class="text-center">Meet Our Team</h2>
        <div>
          <ul class="gap-l" role="list">
            <li class="flex flex-col items-center gap-2xs">
              <img src="/images/mike-carabotta.png" alt="Mike Carabotta, Engineering Manager" />
              <div class="flex flex-col justify-center">
                <h4 class="font-bold">Mike Carabotta</h4>
                <p class="text--1 italic">Engineering Manager</p>
              </div>
              <p class="text--1 text-center text-primary-90">
                Mike is directly responsible for the continued expansion of our already-vast catalog.
              </p>
            </li>
            <li class="flex flex-col items-center gap-xs">
              <img src="/images/joe-klinehamer.png" alt="Mike Carabotta, Engineering Manager" />
              <div class="flex flex-col justify-center">
                <h4 class="font-bold">Joe Klinehamer</h4>
                <p class="text--1 italic">President</p>
              </div>

              <p class="text--1 text-center text-primary-90">
                Joe is always looking for the next opportunity to expand and develop our business at ACS.
              </p>
            </li>
            <li class="flex flex-col items-center gap-xs">
              <img src="/images/mitch-kokish.png" alt="Mike Carabotta, Engineering Manager" />
              <div class="flex flex-col justify-center">
                <h4 class="font-bold">Mitch Kokish Carabotta</h4>
                <p class="text--1 italic">Quality Manager</p>
              </div>
              <p class="text--1 text-center text-primary-90">
                Mike is a certified FAA Manufacturing DAR with involvement in over 500 certification projects.
              </p>
            </li>
          </ul>
        </div>
        <div class="text-center">
          <a class="btn btn-accent" href="#">Learn More</a>
        </div>
      </div>
    </article>
    <article class="filler">
      <div class="flow container py-xl">
        <h2 class="">All ACS parts are FAA-PMA approved</h2>
        <p class="">
          We realize there’s more to our customer’s purchasing decision than just price. This is why ACS seeks not only
          to provide the best pricing in the industry, but to create value using any means available to us. Stocking
          100% of our inventory for next day delivery, offering eCommerce solutions for online customers, utilizing the
          latest data management technology, and offering the latest manufacturing / design solutions are some of the
          many methods we’ve adopted to create value for our customers.
        </p>
        <div>
          <a class="btn btn-primary" href="#">Learn More</a>
        </div>
      </div>
    </article>
    <article class="sales-force text-primary-99 bg-primary-10">
      <div class="container | py-xl">
        <div>
          <img class="w-full object-cover" src="/images/globe-map.png" alt="" />
        </div>
        <div>
          <ul role="list">
            <li
              class="flex flex-col justify-center gap-xs"
              v-for="(director, i) in salesDirectors"
              :index="`sales-director-${i}`"
            >
              <div class="w-6 br-full overflow-hidden">
                <img class="w-full" :src="`/images/${director.image}`" alt="" />
              </div>
              <div>
                <p class="text--1 font-bold">{{ director.name }}</p>
                <p class="text--1 italic">{{ director.title }}</p>
              </div>
              <p class="text--1">{{ director.phoneNumber }}</p>
              <p class="text--1">{{ director.email }}</p>
            </li>
          </ul>
        </div>
      </div>
    </article>
    <article class="contact-us">
      <div class="container">
        <div>
          <h2>Can’t find what you are after contact us</h2>
          <address>
            <p>Jeneen Anderson</p>
            <p>Customer Service Representative</p>
            <p>26451 Curtiss Wright Pkwy</p>
            <p>Cleveland, OH 44143</p>
            <a href="tel:Phone: +14402956590">+1 (440) 295-6590 x 111</a>
          </address>
        </div>
        <div>
          <form action="">
            <label for="">
              <span> Your name</span>
              <input type="text" />
            </label>
          </form>
        </div>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped></style>
