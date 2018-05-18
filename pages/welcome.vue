<template>
  <div class="container">
    <h1 class="text-black-50">Interview task of 05.2018</h1>
    <p>Detailed description of the test task can be seen <a target="blunk" href="/task.pdf">here</a>.</p>
    <p><nuxt-link :to="{ name: 'app-tournament-level'}" class="btn btn-primary my-2">Go to implementation</nuxt-link></p>
    <nuxt-link :to="{ name: 'app-tournament-level'}">
      <img class="img-fluid img-thumbnail float-left screen" src="~/assets/images/screen.png" alt="">
    </nuxt-link>
  </div>
</template>

<style scoped>
img.screen {
  max-width: 300px;
}
</style>
