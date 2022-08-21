class CustomAudio {
    map = {};
    soundState;

    constructor(soundState) {
        this.soundState = soundState;
    }

    addAudio(name, path) {
        if (!Object.hasOwn(this.map, name)) {
            this.map[name] = {path};
        }
    }

    initAudioAndPlay(name) {
        this.initAudio(name);

        // if (this.soundState && Object.hasOwn(this.map, name)) {
        //     const sound = new Audio(this.map[name].path);
        //     return sound.play();
        // }
        //
        // return Promise.resolve();
        return this.play(name);
    }

    initAudio(name) {
        if (Object.hasOwn(this.map, name)) {
            const sound = new Audio(this.map[name].path);
            this.map[name] = {
                path: this.map[name].path,
                sound
            }
        }
    }

    play(name) {
        if (this.soundState && Object.hasOwn(this.map, name)) {
            return this.map[name].sound.play();
        }

        return Promise.resolve();
    }

    setSoundState(state) {
        this.soundState = state;
    }
}

export default new CustomAudio();
