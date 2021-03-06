<template>
  <div class="box">
    <table>
      <tr>
        <th style="vertical-align: top;">
          {{ $t("booking.payment.location") }}
        </th>
        <td>
          <AddressSmall :facility="facility" />
        </td>
      </tr>
    </table>

    <hr />
    <table>
      <tr>
        <th>{{ $t("booking.payment.start") }}</th>
        <td>{{ startedAt }}</td>
      </tr>
      <tr>
        <th>{{ $t("booking.payment.end") }}</th>
        <td>{{ stoppedAt }}</td>
      </tr>
      <tr>
        <th>{{ $t("booking.payment.duration") }}</th>
        <td>
          <ParkTime
            :startedAt="booking.startedAt"
            :stoppedAt="booking.stoppedAt"
          />
        </td>
      </tr>
    </table>

    <hr />
    <table>
      <tr>
        <th>{{ $t("booking.payment.total") }}</th>
        <td>
          <ParkPrice
            :startedAt="booking.startedAt"
            :stoppedAt="booking.stoppedAt"
          />
        </td>
      </tr>
      <tr>
        <th colspan="2">
          <Hint
            style="margin-bottom: 0"
            :content="$t('booking.payment.tax', { value: taxAmount })"
          />
        </th>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from "@vue/composition-api"
import { BookingModel } from "@/app/models/booking.model"
import { calculatePriceRawByBooking } from "@/app/utils/price-calculator.util"
import { formatDate } from "@/app/utils/date.util"
import ParkTime from "@/app/components/booking/ParkTime.vue"
import ParkPrice from "@/app/components/booking/ParkPrice.vue"
import Hint from "@/app/components/common/Hint.vue"
import AddressSmall from "@/app/components/facility/AddressSmall.vue"
import { FacilityModel } from "../../models/facility.model"

export default defineComponent({
  components: {
    ParkTime,
    ParkPrice,
    Hint,
    AddressSmall,
  },
  props: {
    booking: {
      type: Object as () => BookingModel,
      required: true,
    },
    facility: {
      type: Object as () => FacilityModel,
      required: true,
    },
  },
  setup(props) {
    let isPristine = true

    const taxAmount = computed(() => {
      const num = (calculatePriceRawByBooking(props.booking) / 100) * 7.7
      return Math.round((num + Number.EPSILON) * 100) / 100
    })
    const startedAt = computed(() => formatDate(props.booking.startedAt))
    const stoppedAt = computed(() => formatDate(props.booking.stoppedAt))

    watchEffect(() => {
      if (props.booking && props.booking.facilityId && isPristine) {
        isPristine = false
        // findOneFacility(props.booking.facilityId)
      }
    })

    return { taxAmount, startedAt, stoppedAt }
  },
})
</script>
