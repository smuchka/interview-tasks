<template>
    <div>
        <site-header></site-header>
        <main class="container">
            <nuxt/>
        </main>
        <site-footer/>
    </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  components: {
    SiteHeader: () => import("~/components/header"),
    SiteFooter: () => import("~/components/footer")
  }
};
</script>

<style>
main.container {
  min-height: 600px;
}

main.container h1,
main.container h3 {
  padding-top: 25px;
  padding-bottom: 15px;
}
</style>