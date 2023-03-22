<template>
  <Merge type="json" :inputdefaultValue="jsonMergeExample"></Merge>
</template>

<script setup lang="ts">
import Merge from "./merge.vue"
import {jsonMergeExample} from "./sample"
</script>
