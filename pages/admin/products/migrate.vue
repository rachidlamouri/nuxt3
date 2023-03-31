<script setup lang="ts">
// import IProduct from '~~/ToDeelete/types/IProduct'

definePageMeta({
  title: 'users',
  description: 'ACS users',
  layout: 'admin',
})
const uploadedProducts: any = ref([])
const dbCreated = ref(false)
const oemsMigrated = ref(false)
const oemPartNumbersMigrated = ref(false)
const eligibilitiesMigrated = ref(false)
const nextHigherAssembliesMigrated = ref(false)
const showAlert = ref(false)
const relevantSheet = 'products-tiny.csv'
const config = useRuntimeConfig()

const totalCount = ref()

const migrate = async () => {
  // showAlert.value = true

  // Create databases
  // dbCreated.value = false
  // const { data: dbTables, error: dbTablesErrors } = await useFetch('/api/v1/products/migrate/createDb', {
  //   method: 'POST',
  //   body: {},
  // })

  // if (dbTablesErrors.value) throw createError(dbTablesErrors.value)
  // dbCreated.value = true

  const { data: csvData } = await useAsyncData('/products-new-small', () => queryContent('/').find())
  if (csvData.value && csvData.value.length > 0) {
    console.log(csvData.value)
    const sheet = csvData.value.find((row) => row._file === relevantSheet)
    if (!sheet) throw createError(`can't find sheet ${relevantSheet}`)
    if (!sheet.body || !sheet.body.length) throw createError(`File ${relevantSheet} does not contain any data`)
    console.log(sheet.body)

    //  Migrate OEM's
    // oemsMigrated.value = false
    // const { data: oems, error: oemsErrors } = await useFetch('/api/v1/products/migrate/oems', {
    //   method: 'POST',
    //   body: sheet.body,
    // })
    // if (oemsErrors.value) throw createError(oemsErrors.value)
    // if (oems.value && !oems.value.insertedCount) throw createError('There were no oems to migrate')
    // console.log(oems.value)
    // oemsMigrated.value = true

    //  Migrate OEM Part Numbers
    // oemPartNumbersMigrated.value = false
    // const { data: oemPartNumbers, error: oemPartNumbersErrors } = await useFetch(
    //   '/api/v1/products/migrate/oemPartNumbers',
    //   {
    //     method: 'POST',
    //     body: sheet.body,
    //   }
    // )
    // if (oemPartNumbersErrors.value) throw createError(oemPartNumbersErrors.value)
    // if (oemPartNumbers.value && !oemPartNumbers.value.insertedCount)
    //   throw createError('There were no oemPartNumbers to migrate')
    // console.log(oemPartNumbers.value)
    // oemPartNumbersMigrated.value = true

    //  Migrate Eligibilities
    // eligibilitiesMigrated.value = false
    // const { data: eligibilities, error: eligibilitiesErrors } = await useFetch(
    //   '/api/v1/products/migrate/eligibilities',
    //   {
    //     method: 'POST',
    //     body: sheet.body,
    //   }
    // )
    // if (eligibilitiesErrors.value) throw createError(eligibilitiesErrors.value)
    // if (eligibilities.value && !eligibilities.value.insertedCount)
    //   throw createError('There were no eligibilities to migrate')
    // console.log(eligibilities.value)
    // eligibilitiesMigrated.value = true

    //  Migrate Next Higher Assemblies
    // nextHigherAssembliesMigrated.value = true
    // const { data: nextHigherAssemblies, error: nextHigherAssembliesErrors } = await useFetch(
    //   '/api/v1/products/migrate/nextHigherAssemblies',
    //   {
    //     method: 'POST',
    //     body: sheet.body,
    //   }
    // )
    // if (nextHigherAssembliesErrors.value) throw createError(nextHigherAssembliesErrors.value)
    // if (nextHigherAssemblies.value && !nextHigherAssemblies.value.insertedCount)
    //   throw createError('There were no nextHigherAssemblies to migrate')
    // console.log(nextHigherAssemblies.value)
    // nextHigherAssembliesMigrated.value = true

    const { data, error } = await useCsrfFetch(`products/migrate`, {
      method: 'POST',
      baseURL: config.apiUrl,
      body: { data: sheet.body },
      // headers: { ...headers, sessionAuthorization: 'jwtsession' },
    })
    if (error.value) console.log(error.value.data)
    console.log(data.value)

    // for (const item of sheet.body) {
    //   const { data: product, error: productErrors } = await useFetch('/api/v1/products/migrate/products', {
    //     method: 'POST',
    //     body: item,
    //   })
    //   if (productErrors.value) throw createError(productErrors.value)

    //   console.log(productErrors.value)
    //   console.log(product.value)
    //   uploadedProducts.value.push({ ...item, _id: product.value!.insertedId, media: [{ name: item.image }] })
    //   totalCount.value = sheet.body.length
    // }
  }
}
</script>

<template>
  <div class="flow-s p-l">
    <button class="btn btn-primary" @click="migrate">Migrate products</button>
    <div>
      <p v-if="dbCreated">Databases created</p>
      <p v-if="oemsMigrated">OEM migrated</p>
      <p v-if="oemPartNumbersMigrated">OEM part numbers migrated</p>
      <p v-if="eligibilitiesMigrated">Eligibilities migrated</p>
      <p v-if="nextHigherAssembliesMigrated">Next higher assemblies migrated</p>
    </div>
    <div class="progress-bar-wrapper">
      <div
        class="progress-bar"
        :style="{ width: !totalCount ? 0 : (uploadedProducts.length / totalCount) * 100 + '%' }"
      >
        <div v-if="uploadedProducts.length">
          {{ Math.floor((uploadedProducts.length / totalCount) * 100) + '%' }}
        </div>
      </div>
    </div>
    <div class="products">
      <div v-for="product in uploadedProducts">
        {{ product.name }}
        <div class="image">
          <img
            :src="`https://acs-space.nyc3.cdn.digitaloceanspaces.com/products/${product.media[0].name}.jpg`"
            alt=""
            v-if="product.media && product.media.length"
          />
          <img src="/images/placeholder.png" alt="" v-else />
        </div>
      </div>
    </div>
    <!-- <Alert :showAlert="showAlert" @cancel="showAlert = false" @proceed="migrate" /> -->
  </div>
</template>

<style lang="scss" scoped>
.products {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.image {
  width: 4rem;
}

.progress-barwrapper {
  border: 1px solid red;
}

.progress-bar {
  background-color: green;
}
</style>
