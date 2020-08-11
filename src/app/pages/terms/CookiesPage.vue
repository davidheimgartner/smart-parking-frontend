<template>
  <section>
    <Title text="Cookie policy" />
    <Subtitle>Overview</Subtitle>
    <Content>
      Described below you will find details about the cookies used on our website. Our cookie policy is updated regularly.
      We use cookies for the following purposes:
    </Content>

    <!-- OneTrust Cookies Settings button start -->
    <button id="ot-sdk-btn" class="ot-sdk-show-settings">Cookie Settings</button>
    <!-- OneTrust Cookies Settings button end -->

    <!-- OneTrust Cookies List start -->
    <div id="ot-sdk-cookie-policy"></div>
    <!-- OneTrust Cookies List end -->
  </section>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api"
import Title from "@/app/components/common/Title.vue"
import Subtitle from "@/app/components/common/Subtitle.vue"
import Content from "@/app/components/common/Content.vue"

export default defineComponent({
  components: {
    Title,
    Subtitle,
    Content,
  },
})
</script>
