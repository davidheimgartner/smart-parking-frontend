<template>
  <v-container class="no-padding-on-mobile">
    <v-form v-model="isFormValid">
      <v-alert v-model="couldNotCreateBooking" type="error" class="form-alert">
        <Subtitle>{{ $t("booking.form.alert.title") }}</Subtitle>
        <Content small v-html="$t('booking.form.alert.text')"></Content>
      </v-alert>

      <v-alert
        v-model="couldNotVerifyMobile"
        dismissible
        type="error"
        class="form-alert"
      >
        <Subtitle>{{ $t("booking.verification.alert.title") }}</Subtitle>
        <Content small v-html="$t('booking.verification.alert.text')"></Content>
        <v-btn color="white" light @click="sendNewVerificationCode()">{{
          $t("booking.verification.alert.button")
        }}</v-btn>
      </v-alert>

      <v-stepper v-model="stepper" vertical>
        <!-- STEP - LicensePlate -->
        <v-stepper-step
          step="1"
          :complete="stepper > 1"
          :rules="licensePlateStepRules"
        >
          {{ $t("booking.form.licensePlate.label") }}
          <small>{{ licensePlate }}</small>
        </v-stepper-step>
        <v-stepper-content step="1">
          <BookingStepLicensePlate
            ref="bookingStepLicensePlate"
            v-model="licensePlate"
            @submit="submitStepLicensePlate"
          />
        </v-stepper-content>

        <!-- STEP - MobileNumber + Verification -->
        <v-stepper-step
          step="2"
          :complete="stepper > 2"
          :rules="mobileStepRules"
        >
          {{ $t("booking.form.mobile.label") }}
          <small>{{ mobile }}</small>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-window
            v-model="window"
            :continuous="false"
            :show-arrows="false"
            :show-arrows-on-hover="false"
            :touchless="true"
          >
            <v-window-item>
              <BookingStepMobile
                ref="bookingStepMobile"
                v-model="mobile"
                :loading="isLoading"
                @submit="submitStepMobile"
              />
            </v-window-item>
            <v-window-item>
              <BookingStepVerification
                v-if="booking"
                ref="bookingStepVerification"
                v-model="verificationCode"
                :loading="isLoading"
                :booking="booking"
                @submit="submitStepVerification"
              />
            </v-window-item>
          </v-window>
        </v-stepper-content>

        <!-- STEP - Confirmation -->
        <v-stepper-step step="3" :complete="stepper > 3">
          {{ $t("booking.form.confirmation.title") }}
          <small></small>
        </v-stepper-step>
        <v-stepper-content step="3">
          <BookingStepConfirmation
            :is-booking="isBooking"
            @submit="submitConfirmation"
          />
        </v-stepper-content>
      </v-stepper>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api"
import { useLicensePlate } from "@/app/reactive/form/license-plate.reactive"
import { useMobile } from "@/app/reactive/form/mobile.reactive"
import { api } from "@/app/api"
import { BookingModel } from "@/app/models/booking.model"
import { useVerification } from "@/app/reactive/form/verification.reactive"
import BookingStepLicensePlate from "@/app/components/booking/form/BookingStepLicensePlate.vue"
import BookingStepMobile from "@/app/components/booking/form/BookingStepMobile.vue"
import BookingStepVerification from "@/app/components/booking/form/BookingStepVerification.vue"
import BookingStepConfirmation from "@/app/components/booking/form/BookingStepConfirmation.vue"
import Content from "@/app/components/common/Content.vue"
import Subtitle from "@/app/components/common/Subtitle.vue"

export default defineComponent({
  components: {
    BookingStepLicensePlate,
    BookingStepMobile,
    BookingStepVerification,
    BookingStepConfirmation,
    Content,
    Subtitle,
  },
  props: {
    isBooking: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root }) {
    const { licensePlate, licensePlateStepRules } = useLicensePlate(root)
    const { mobile, mobileStepRules } = useMobile(root)
    const { verificationCode } = useVerification(root)

    const stepper = ref(1)
    const window = ref(0)
    const isFormValid = ref(false)
    const isLoading = ref(false)
    const couldNotCreateBooking = ref(false)
    const couldNotVerifyMobile = ref(false)
    const booking = ref<BookingModel>()
    const bookingStepLicensePlate = ref<{ focus: () => undefined }>()
    const bookingStepMobile = ref<{ focus: () => undefined }>()
    const bookingStepVerification = ref<{ focus: () => undefined }>()

    booking.value = { id: "1" } as BookingModel

    onMounted(() => {
      if (bookingStepLicensePlate.value) {
        bookingStepLicensePlate.value.focus()
      }
    })

    function submitStepLicensePlate() {
      stepper.value = 2
      if (bookingStepMobile.value) {
        bookingStepMobile.value.focus()
      }
    }

    async function submitStepMobile() {
      isLoading.value = true
      const response = await api.createBooking({
        licensePlate: licensePlate.value,
        mobileNumber: mobile.value,
        facilityId: root.$route.params.id,
      })
      if (response.wasSuccessful && response.data) {
        couldNotCreateBooking.value = false
        booking.value = response.data
        window.value = 1
        setTimeout(() => {
          if (bookingStepVerification.value) {
            bookingStepVerification.value.focus()
          }
        }, 0)
      } else {
        couldNotCreateBooking.value = true
      }
      isLoading.value = false
    }

    async function submitStepVerification() {
      isLoading.value = true

      const bookingId = (booking.value as any).id as string
      const response = await api.verifyCode(bookingId, verificationCode.value)
      if (response.wasSuccessful && response.data) {
        couldNotVerifyMobile.value = false
        booking.value = response.data
        stepper.value = 3
      } else {
        verificationCode.value = ""
        couldNotVerifyMobile.value = true
      }
      isLoading.value = false
    }

    async function submitConfirmation() {
      isLoading.value = true
      const bookingId = (booking.value as any).id as string
      const response = await reserveOrBook(bookingId)
      if (response.wasSuccessful) {
        root.$router.replace({
          name: "booking.detail",
          params: { id: bookingId },
        })
      }
    }

    async function reserveOrBook(bookingId: string) {
      if (props.isBooking) {
        return api.startBooking(bookingId)
      } else {
        return api.reserveBooking(bookingId)
      }
    }

    async function sendNewVerificationCode() {
      isLoading.value = true
      couldNotVerifyMobile.value = false
      const bookingId = (booking.value as any).id as string
      const response = await api.retryVerification(bookingId)
      if (response.wasSuccessful && response.data) {
        booking.value = response.data
      } else {
        couldNotVerifyMobile.value = true
      }
      isLoading.value = false
    }

    return {
      isFormValid,
      isLoading,
      stepper,
      window,
      licensePlate,
      licensePlateStepRules,
      booking,
      mobile,
      mobileStepRules,
      bookingStepLicensePlate,
      bookingStepMobile,
      submitStepLicensePlate,
      submitStepMobile,
      verificationCode,
      bookingStepVerification,
      submitStepVerification,
      submitConfirmation,
      couldNotCreateBooking,
      couldNotVerifyMobile,
      sendNewVerificationCode,
    }
  },
})
</script>
