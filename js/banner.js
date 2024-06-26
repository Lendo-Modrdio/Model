const model = {
    images: [
        "https://3yya.com/examples/assets/诸葛亮.jpg",
        "https://3yya.com/examples/assets/进击.jpg",
        "https://3yya.com/examples/assets/进击-大.jpg",
    ],
    // 循环播放
    timerID: null,
    // 当前显示的图片序号
    _index: 0,
    get imageAmount() {
        // 图片的数量
        return this.images.length
    },
    set index(value) {
        if (value < 0) {
            this._index = this.imageAmount - 1
        } else if (value >= this.imageAmount) {
            this._index = 0
        } else {
            this._index = value
        }

        view.render()
    },
    get index() {
        return this._index
    },
}

function resetWrapper(func) {
    // 装饰器，每次重置自动滚动
    return function (...args) {
        if (model.timerID) {
            clearInterval(model.timerID)
        }
        model.timerID = controller.run()

        return func(...args)
    }
}
const controller = {
    init() {
        // 自动滚动
        model.timerID = this.run()

        document.querySelector(".carousel .left").onclick = this.leftShift
        document.querySelector(".carousel .right").onclick = this.rightShift
    },
    leftShift: resetWrapper(() => {
        model.index -= 1
    }),
    rightShift: resetWrapper(() => {
        model.index += 1
    }),
    setIndex: resetWrapper((idx) => {
        model.index = idx
    }),
    run() {
        return setInterval(() => {
            model.index++
        }, 3000)
    },
}

const view = {
    init() {
        // 添加图片
        const container = document.querySelector(".carousel .container")
        for (let url of model.images) {
            const image = document.createElement("img")
            image.src = url

            container.append(image)
        }

        this.render()
    },
    render: function () {
        carousel = document.querySelector(".carousel")

        carousel.querySelector(".container").style.left = `${
            model.index * carousel.clientWidth * -1
        }px`

        const bottom = carousel.querySelector(".bottom")

        // 重置底部按钮
        bottom.innerHTML = ""
        for (let i = 0; i < model.imageAmount; i++) {
            // 创建底部指示器
            const indicator = document.createElement("div")
            indicator.classList.add("indicator")

            if (i === model.index) {
                // 当前图片指示器
                indicator.classList.add("activate")
            }

            indicator.onclick = () => controller.setIndex(i)

            bottom.append(indicator)
        }
    },
}

controller.init()
view.init()
