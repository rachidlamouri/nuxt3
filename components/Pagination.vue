<script lang="ts" setup>
// import {
// 	ChevronDoubleLeftIcon,
// 	ChevronDoubleRightIcon,
// 	ChevronLeftIcon,
// 	ChevronRightIcon,
// } from '@heroicons/vue/outline'

const props = defineProps({
	pages: {
		type: Number,
		required: true,
	},
	page: {
		type: Number,
		required: true,
	},
})

const emit = defineEmits(['setPage'])
const active = computed(() => props.page)

const setCurrentPage = async (p: number) => {
	if (p < 1) {
		p = 1
		return
	}
	if (p > props.pages) {
		p = props.pages
		return
	}
	emit('setPage', p)
}
</script>

<template>
	<nav class="flex justify-center items-center gap-4">
		<div class="pagination flex bg-currentflex-row justify-center gap-1">
			<span class="page" @click="setCurrentPage(1)" :class="{ disabled: page == 1 }">
				<IconsFirstPage class="" />
			</span>
			<span class="page" @click="setCurrentPage(page - 1)" :class="{ disabled: page == 1 }">
				<IconsChevronLeft class="" />
			</span>
			<div class="pagination flex flex-row justify-center gap-1" v-if="pages <= 5">
				<span v-for="p in pages" class="page" @click="setCurrentPage(p)" :class="{ active: active == p }">
					{{ p }}
				</span>
			</div>
			<div class="pagination flex flex-row justify-center gap-1" v-else>
				<div class="pagination flex flex-row justify-center gap-1" v-if="page <= 3">
					<span v-for="p in 5" class="page" @click="setCurrentPage(p)" :class="{ active: active == p }">
						{{ p }}
					</span>
				</div>
				<div class="pagination flex flex-row justify-center gap-1" v-else-if="page > 3 && page < pages - 3">
					<span
						v-for="p in 5"
						class="page"
						@click="setCurrentPage(page - 3 + p)"
						:class="{ active: active == page - 3 + p }"
					>
						{{ page - 3 + p }}
					</span>
				</div>
				<div class="flex flex-row justify-center gap-1" v-else>
					<span
						v-for="p in 5"
						class="page"
						@click="setCurrentPage(pages - 5 + p)"
						:class="{ active: active == pages - 5 + p }"
					>
						{{ pages - 5 + p }}
					</span>
				</div>
			</div>
			<span class="page" @click="setCurrentPage(page + 1)" :class="{ disabled: page >= pages }">
				<IconsChevronRight class="" />
			</span>
			<span class="page" @click="setCurrentPage(pages)" :class="{ disabled: page >= pages }">
				<IconsLastPage class="" />
			</span>
		</div>
		<div class="flex flex-row items-center gap-2 text-sm">
			<span class="whitespace-nowrap">Go to page</span>
			<div class="w-16">
				<!-- <FormsBaseSelect
					:value="page"
					:options="
						Array.from({ length: pages }, (_, index) => index + 1).map((p) => {
							return { key: p, name: p }
						})
					"
					@update:model-value="setCurrentPage($event * 1)"
				/> -->
			</div>
			<span class="whitespace-nowrap" v-if="pages > 1">of {{ pages }} pages</span>
		</div>
	</nav>
</template>

<style lang="scss" scoped></style>
