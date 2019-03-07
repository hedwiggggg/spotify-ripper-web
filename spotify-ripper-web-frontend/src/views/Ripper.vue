<template>
  <div class="ripper container">
    <div class="row">
      <div class="col-md-5 mb-3">
        <Input
          type="text"
          placeholder="USERNAME"
          :cached="inputs.username"
          :callback="event => handleInputChange('username', event)"
        />
      </div>

      <div class="col-md-5 mb-3">
        <Input
          type="password"
          placeholder="PASSWORD"
          :cached="inputs.password"
          :callback="event => handleInputChange('password', event)"
        />
      </div>

      <div class="col-md-2 mb-3">
        <Button
          :class="containerStateClass"
          :callback="handleStartButtonPressed"
        >
          {{ containerStateButton }}
        </Button>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <TextArea
          :callback="event => handleInputChange('uris', event)"
          :cached="inputs.uris"
          :placeholder="
            `Spotify Uri’s (one per line)..\n\neg.:\n\nspotify:album:0gVadHVEIZBhpxpv0thCgT\nspotify:album:1zBBXBnhJnhHSRNDwpe9SO`
          "
        />
      </div>
    </div>

    <hr class="divider-hr" />

    <div class="row">
      <div class="col-md-6 mb-3">
        <ProgressBar
          :progress="progresses.track.percent"
          :title="
            `PROGRESS (TRACK) (~${formatTime(
              progresses.track.timeLeft
            )} remaining)`
          "
        />
      </div>

      <div class="col-md-6 mb-3">
        <ProgressBar
          :progress="progresses.total.percent"
          :title="
            `PROGRESS (TOTAL) (~${formatTime(
              progresses.total.timeLeft
            )} remaining)`
          "
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <Terminal :lines="[...terminal.lines, ...terminal.suffixLines]" />
      </div>
    </div>
  </div>
</template>

<script>
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import TextArea from "@/components/TextArea.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import Terminal from "@/components/Terminal.vue";

import Packet from "@/core/Packet.js";

export default {
  name: "ripper",

  components: {
    Input,
    Button,
    TextArea,
    ProgressBar,
    Terminal
  },

  beforeMount() {
    this.$options.sockets.onmessage = data => this.handlePacket(data);
  },

  beforeDestroy() {
    delete this.$options.sockets.onmessage;
  },

  computed: {
    container() {
      return this.$store.state.container;
    },

    inputs() {
      return this.$store.state.inputs;
    },

    progresses() {
      return this.$store.state.progresses;
    },

    terminal() {
      return this.$store.state.terminal;
    },

    urisArray() {
      return this.inputs.uris.split(/\r*\n/);
    },

    containerStateClass() {
      let result = "";

      switch (this.container.state) {
        case "STOPPED":
          result = "green";
          break;

        case "STARTED":
          result = "red";
          break;

        case "PENDING":
          result = "grey";
          break;
      }

      return result;
    },

    containerStateButton() {
      let result = this.container.state;

      switch (this.container.state) {
        case "STOPPED":
          result = "START";
          break;

        case "STARTED":
          result = "STOP";
          break;
      }

      return result;
    }
  },

  methods: {
    handleStartButtonPressed() {
      if (this.container.state == "PENDING") {
        return;
      }

      if (this.container.state == "STARTED") {
        const packet = Packet("stop-ripper", undefined);
        this.$socket.send(packet);
      }

      if (this.container.state == "STOPPED") {
        const filteredURIs = this.urisArray.filter(uri => {
          return /^spotify:(track|album):(\w{22})$/gm.test(uri);
        });

        const packet = Packet("start-ripper", {
          user: this.inputs.username,
          pass: this.inputs.password,
          uris: filteredURIs
        });

        this.$socket.send(packet);
      }

      this.$store.commit("changeContainer", { key: "state", value: "PENDING" });
    },

    handleInputChange(ns, event) {
      const element = event.srcElement || event.target;
      this.$store.commit("changeInputs", { key: ns, value: element.value });
    },

    formatTime(timeInSeconds) {
      return new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
    },

    handlePacket(wsEvent) {
      const packet = JSON.parse(wsEvent.data);

      switch (packet.id) {
        case "terminal":
          this.handlePacketTerminal(packet.data);
          break;

        case "progress":
          this.handlePacketProgress(packet.data);
          break;

        case "download-folder":
          this.handlePacketDownloadFolder(packet.data);
          break;

        case "container-state":
          this.handlePacketContainerState(packet.data);
          break;
      }
    },

    handlePacketTerminal(line) {
      this.$store.commit("addTerminalLines", [line]);

      if (this.terminal.lines.length >= 20) {
        const payload = {
          begin: this.terminal.lines.length - 20,
          end: this.terminal.lines.length
        };

        this.$store.commit("sliceTerminalLines", payload);
      }
    },

    handlePacketProgress(progressRaw) {
      const progressData = this.processProgress(progressRaw);
      const progressType = /progress_(total|track)/gm.exec(progressRaw)[1];

      const progressChanged =
        progressData.progressInPercent != this.progresses[progressType].percent;

      if (progressChanged) {
        const payload = {
          type: progressType,
          key: "percent",
          value: progressData.progressInPercent
        };

        this.$store.commit("changeProgress", payload);
      }

      const progressRemainingChanged =
        progressData.remainingTimeInSeconds &&
        progressData.remainingTimeInSeconds !=
          this.progresses[progressType].timeLeft;

      if (progressRemainingChanged) {
        const payload = {
          type: progressType,
          key: "timeLeft",
          value: progressData.remainingTimeInSeconds
        };

        this.$store.commit("changeProgress", payload);
      }
    },

    processProgress(progressRaw) {
      const progressTotal = /progress_(total|track)*\((.+?)\)/gm.exec(
        progressRaw
      )[2];
      const progressTotalParsed = progressTotal.split(",");

      const progressTotalCurrent = parseInt(progressTotalParsed[0]);
      const progressTotalMaximum = parseInt(progressTotalParsed[1]);

      const progressTotalPercent =
        (progressTotalCurrent / progressTotalMaximum) * 100;

      const regExp = /progress_(total|track)_remaining*\((.+?)\)/gm;
      const progressTotalRemainingMatches = regExp.exec(progressRaw);

      if (progressTotalRemainingMatches !== null) {
        const progressTotalRemaining = parseInt(
          progressTotalRemainingMatches[2]
        );

        return {
          progressInPercent: progressTotalPercent,
          remainingTimeInSeconds: progressTotalRemaining
        };
      }

      return {
        progressInPercent: progressTotalPercent,
        remainingTimeInSeconds: undefined
      };
    },

    handlePacketDownloadFolder(downloadFolder) {
      this.$store.commit("changeContainer", {
        key: "downloadFolder",
        value: downloadFolder
      });

      const payload = {
        index: 1,
        value: `\u001b[47m\u001b[30m&nbsp;>>> your session download folder: ${downloadFolder} <<<&nbsp;\u001b[0m`
      };

      this.$store.commit("changeTerminalSuffixLine", payload);
    },

    handlePacketContainerState(containerState) {
      this.$store.commit("changeContainer", {
        key: "state",
        value: containerState
      });
    }
  }
};
</script>
