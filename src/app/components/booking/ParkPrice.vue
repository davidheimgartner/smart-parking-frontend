<template>
  <span>{{ parkPriceString }}</span>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onUnmounted,
  onMounted,
} from "@vue/composition-api"
import { calculatePrice } from "@/app/utils/price-calculator.util"
import { FacilityModel } from '@/app/models/facility.model'

export default defineComponent({
  props: {
    startedAt: Date,
    stoppedAt: Date,
    facility: FacilityModel,
  },
  setup: (props: { startedAt: Date; stoppedAt: Date | null, facility: FacilityModel }) => {
    const parkPriceString = ref<string>("")

    const timeInterval = setInterval(() => calcNewParkPriceString(), 5000)

    function calcNewParkPriceString() {
      if (props.startedAt) {
        parkPriceString.value = calculatePrice(
          props.startedAt,
          props.stoppedAt ? props.stoppedAt : new Date(),
          props.facility.pricing.hourly,
          props.facility.pricing.daily,
        )
      }
    }

    onMounted(() => calcNewParkPriceString())
    onUnmounted(() => clearInterval(timeInterval))

    return { parkPriceString }
  },
})
</script>
