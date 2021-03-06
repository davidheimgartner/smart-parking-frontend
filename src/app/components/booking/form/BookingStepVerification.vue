<template>
  <section>
    <v-alert v-model="hasError" dismissible type="error">
      <Subtitle>{{ $t("booking.verification.alert.title") }}</Subtitle>
      <Content small v-html="$t('booking.verification.alert.text')"></Content>
      <v-btn color="white" light @click="retry">{{
        $t("booking.verification.alert.button")
      }}</v-btn>
    </v-alert>

    <Content>{{ $t("booking.verification.explanation") }}</Content>

    <v-text-field
      maxlength="6"
      filled
      inputmode="numeric"
      pattern="[0-9]*"
      autocomplete="one-time-code"
      type="number"
      ref="textField"
      :value="value"
      :rules="verificationFieldRules"
      :label="$t('booking.verification.code.label')"
      :loading="loading"
      :disabled="loading"
      @input="update($event)"
      @keypress.enter="prevent($event)"
    ></v-text-field>

    <Hint :content="$t('booking.verification.mobile.hint')" />

    <v-snackbar
      top
      v-model="hasSuccessSnack"
      :multi-line="'multi-line'"
      :timeout="6000"
    >
      {{ $t("booking.verification.snackbar.text") }}
      <v-btn dark color="blue" text @click="hasSuccessSnack = false">
        {{ $t("common.button.close") }}
      </v-btn>
    </v-snackbar>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api"
import { useVerification } from "@/app/reactive/form/verification.reactive"
import { api } from "../../../api"
import { BookingModel } from "../../../models/booking.model"
import Hint from "@/app/components/common/Hint.vue"
import Subtitle from "@/app/components/common/Subtitle.vue"
import Content from "@/app/components/common/Content.vue"

export default defineComponent({
  components: { Hint, Content, Subtitle },
  props: {
    value: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    booking: {
      type: Object as () => BookingModel,
      required: true,
    },
  },
  setup(props, { root, emit }) {
    const { verificationFieldRules } = useVerification(root)
    const textField = ref<{
      valid: boolean
      focus: () => undefined
      blur: () => undefined
    }>()
    const hasSuccessSnack = ref(false)
    const hasError = ref(false)

    const isValid = computed(() =>
      textField.value ? textField.value.valid : false,
    )

    function update(value: string) {
      emit("input", value)
      if (value.length === 6) {
        submit(value)
      }
    }

    function submit(value: string) {
      if (textField.value) {
        textField.value.blur()
      }
      emit("submit", value)
    }

    function focus() {
      if (textField.value) {
        textField.value.focus()
      }
    }

    function prevent(event: CustomEvent) {
      event.preventDefault()
      event.stopPropagation()
    }

    async function retry() {
      hasError.value = false
      await api.retryVerification(props.booking.id)
      hasSuccessSnack.value = true
      setTimeout(() => (hasSuccessSnack.value = false), 6000)
    }

    return {
      hasError,
      hasSuccessSnack,
      verificationFieldRules,
      submit,
      update,
      focus,
      textField,
      isValid,
      prevent,
      retry,
    }
  },
})
</script>
