class CustomAudio {
    map = {}
    soundState
    soundToggle

    constructor() {
        this.soundToggle = document.getElementById('soundToggle')

        this.soundToggle.addEventListener('click', e => {
            e.stopPropagation()

            this.toggleSoundState()
            this.setToggleStyle()
        })

        try {
            const soundState = localStorage.getItem('soundState')

            if (soundState === 'true') {
                this.setSoundState(true)
            } else if (soundState === 'false' || soundState === null) {
                this.setSoundState(false)
            }
        } catch (e) {
            this.setSoundState(false)
        } finally {
            this.setToggleStyle()
        }
    }

    setToggleStyle() {
        if (this.soundState) {
            this.soundToggle.style.opacity = '1'
        } else {
            this.soundToggle.style.opacity = '0.2'
        }
    }

    toggleSoundState() {
        this.setSoundState(!this.soundState)
    }

    get soundState() {
        return this.soundState
    }

    addAudio(name, path) {
        if (!Object.hasOwn(this.map, name)) {
            this.map[name] = { path }
        }
    }

    initAudioAndPlay(name) {
        if (!this.soundState) {
            return
        }

        this.initAudio(name)
        return this.play(name)
    }

    initAudio(name) {
        if (Object.hasOwn(this.map, name)) {
            const sound = new Audio(this.map[name].path)
            this.map[name] = {
                path: this.map[name].path,
                sound,
            }
        }
    }

    play(name) {
        if (this.soundState && Object.hasOwn(this.map, name)) {
            return this.map[name].sound.play()
        }

        return Promise.resolve()
    }

    setSoundState(state) {
        this.soundState = state
        localStorage.setItem('soundState', state.toString())
    }
}

export default new CustomAudio()
