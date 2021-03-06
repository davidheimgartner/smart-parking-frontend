<template>
  <section>
    <v-row no-gutters>
      <v-col cols="12" sm="5" class="col-prefix-input">
        <v-select
          filled
          return-object
          persistent-hint
          v-model="mobilePrefix"
          :disabled="loading"
          :loading="loading"
          :items="prefixes"
          :label="$t('booking.form.prefixes.label')"
          :hint="$t('booking.form.prefixes.hint.' + mobilePrefix.value)"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="7" class="col-mobile-input">
        <v-text-field
          filled
          type="tel"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="15"
          ref="mobileNumberTextField"
          v-model="mobileNumber"
          :disabled="loading"
          :loading="loading"
          :label="$t('booking.form.mobile.label')"
          :rules="mobileFieldRules"
          @blur="removeLeadingZero()"
        ></v-text-field>
      </v-col>
    </v-row>
    <Hint :content="$t('booking.form.mobile.hint')" />
    <v-btn
      block
      large
      color="primary"
      :disabled="!isValid || loading"
      :loading="loading"
      @click="submit()"
    >
      {{ $t("booking.form.mobile.submit") }}
    </v-btn>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watchEffect,
  computed,
  onMounted,
} from "@vue/composition-api"
import { useMobile, MobilePrefixes } from "@/app/reactive/form/mobile.reactive"
import Hint from "@/app/components/common/Hint.vue"

export default defineComponent({
  components: { Hint },
  props: {
    value: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root, emit }) {
    const {
      mobilePrefix,
      mobileNumber,
      mobileFieldRules,
      loadMobileFromCache,
      saveMobileToCache,
      parseMobileNumber,
      buildMobile,
    } = useMobile(root)
    const prefixes = [...MobilePrefixes]

    const mobileNumberTextField = ref<{
      valid: boolean
      focus: () => undefined
      blur: () => undefined
    }>()

    const isValid = computed(() =>
      mobileNumberTextField.value ? mobileNumberTextField.value.valid : false,
    )

    onMounted(() => {
      loadMobileFromCache()
    })

    watchEffect(() => emit("input", buildMobile()))

    function submit() {
      removeLeadingZero()
      saveMobileToCache()
      if (mobileNumberTextField.value) {
        mobileNumberTextField.value.blur()
      }
      emit("submit", buildMobile())
    }

    function removeLeadingZero() {
      mobileNumber.value = parseMobileNumber(mobileNumber.value)
    }

    function focus() {
      if (mobileNumberTextField.value) {
        mobileNumberTextField.value.focus()
      }
    }

    return {
      mobilePrefix,
      mobileNumber,
      prefixes,
      mobileFieldRules,
      mobileNumberTextField,
      isValid,
      submit,
      focus,
      removeLeadingZero,
    }
  },
})
</script>

<style lang="scss">
@media (min-width: 600px) {
  .col-prefix-input {
    padding-right: 6px !important;
  }
  .col-mobile-input {
    padding-left: 6px !important;
  }
}
</style>
