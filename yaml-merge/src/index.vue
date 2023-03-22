<template>
  <Merge type="yaml" :inputdefaultValue="yamlMergeExample"></Merge>
</template>

<script setup lang="ts">
import Merge from "./merge.vue"
import {yamlMergeExample} from "./sample"
</script>
