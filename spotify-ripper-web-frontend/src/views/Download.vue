<template>
  <div class="container">
    <div class="row mb-3">
      <div
        v-for="([path, props], index) in filesToDownload"
        :key="`file-${index}`"
        class="mb-3 col-12"
      >
        <ProgressBar
          style="text-transform: none"
          :progress="props.progress"
          :title="props.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import JSZip from "jszip";
import saveAs from "file-saver";

import ProgressBar from "@/components/ProgressBar.vue";

const MB_IN_BYTES = 1000 * 1000;

export default {
  name: "download",

  components: {
    ProgressBar
  },

  data() {
    return {
      filesToDownload: this.getMP3s(
        this.$store.state.container.downloadFolderSelected,
        this.$store.state.container.downloadFolderSelected.children
      ),

      downloadedFiles: 0,
      zipFiles: [],
      currentZipPointer: 0
    };
  },

  methods: {
    getMP3s(parent, inputFiles) {
      let files = new Map();

      for (const file of inputFiles) {
        if (file.type === "file" && file.extension === ".mp3") {
          let filePath = file.path;

          filePath = filePath.split("/");
          filePath = filePath.map(part => encodeURIComponent(part));
          filePath = filePath.join("/");

          filePath = filePath.replace(
            "/ripped_music",
            `http://${ window.location.hostname }/music`
          );

          files.set(filePath, {
            parent: parent.name,
            path: filePath,
            name: file.name,
            progress: 0
          });
        } else if (file.type === "directory") {
          let childFiles = this.getMP3s(file, file.children);

          for (const [path, props] of childFiles) {
            files.set(path, props);
          }
        }
      }

      return files;
    },

    handleProgressEvent(fileProps, event) {
      const progressCurrent = event.loaded;
      const progressTotal = event.total;
      const progress = (progressCurrent / progressTotal) * 100;

      fileProps.progress = progress;

      this.$forceUpdate();
    },

    getZip() {
      let zipFile = this.zipFiles[this.currentZipPointer];

      if (!zipFile) {
        this.zipFiles[this.currentZipPointer] = {
          pointer: this.currentZipPointer,
          zip: new JSZip(),
          size: 0
        };

        zipFile = this.zipFiles[this.currentZipPointer];
      }

      return zipFile;
    },

    downloadZip(zipFile) {
      const zipName = `${ this.$store.state.container.downloadFolderSelected.name }_part_${zipFile.pointer}.zip`;
      
      zipFile.zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, zipName);
      });

      this.currentZipPointer++;
    },

    addFileToZip(zipFile, response, fileProps) {
      const album = zipFile.zip.folder(fileProps.parent);

      zipFile.size += response.data.byteLength;
      album.file(fileProps.name, response.data, { binary: true });
    }
  },

  mounted() {
    for (const [path, props] of this.filesToDownload) {
      this.axios
        .get(path, {
          responseType: "arraybuffer",
          onDownloadProgress: event => this.handleProgressEvent(props, event)
        })
        .then(response => {
          this.downloadedFiles++;

          const zipFile = this.getZip();
          this.addFileToZip(zipFile, response, props);

          if (zipFile.size >= 200 * MB_IN_BYTES) {
            this.downloadZip(zipFile);
          }

          if (this.downloadedFiles >= this.filesToDownload.size) {
            this.downloadZip(zipFile);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.uppercase {
  text-transform: uppercase;
}
</style>
