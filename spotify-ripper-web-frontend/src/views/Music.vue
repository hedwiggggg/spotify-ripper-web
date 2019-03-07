<template>
  <div class="music container">
    <div class="row">
      <div
        class="mb-2 mt-2 col-xs-12 col-sm-6 col-md-3 col-lg-2"
        v-for="(folder, index) in directoryTree.children"
        :key="`folder-${index}`"
      >
        <Button class="grey uppercase" :callback="_ => folderClicked(folder)">{{
          folder.name
        }}</Button>
      </div>
    </div>

    <div class="divider-hr"></div>

    <div class="uppercase bg-white fg-black">
      &gt;&gt;&gt; YOUR SESSION DOWNLOAD FOLDER:
      {{ downloadFolder | noFolder }} &lt;&lt;&lt;
    </div>
  </div>
</template>

<script>
import Packet from "@/core/Packet.js";
import Button from "@/components/Button.vue";

export default {
  name: "music",

  components: {
    Button
  },

  data() {
    return {
      directoryTree: {
        children: []
      }
    };
  },

  beforeMount() {
    this.$options.sockets.onmessage = data => this.handlePacket(data);

    if (this.$socket.readyState === 1) {
      const packet = Packet("get-music-directory", undefined);
      this.$socket.send(packet);
    }
  },

  beforeDestroy() {
    delete this.$options.sockets.onmessage;
  },

  computed: {
    downloadFolder() {
      return this.$store.state.container.downloadFolder;
    }
  },

  filters: {
    noFolder(folder) {
      if (folder) {
        return folder;
      } else {
        return "nothing downloaded yet..";
      }
    }
  },

  methods: {
    folderClicked(folder) {
      this.$store.commit("changeContainer", {
        key: "downloadFolderSelected",
        value: folder
      });

      this.$router.push({ name: "download" });
    },

    handlePacket(wsEvent) {
      const packet = JSON.parse(wsEvent.data);

      switch (packet.id) {
        case "music-directory":
          this.handlePacketMusicDirectory(packet.data);
          break;
      }
    },

    handlePacketMusicDirectory(dirTree) {
      this.directoryTree = dirTree;
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-white {
  background-color: rgb(255, 255, 255);
}

.fg-black {
  color: black;
}

.uppercase {
  text-transform: uppercase;
}
</style>
