export default class VergifyGraph {
    constructor(id) {
        this.bindDom = document.getElementById(id);
        this.store = 'abcdefghigkmnpqrstuvwxyz23456789';
        this.validStr = '';
        this.ctx = this.bindDom.getContext('2d');
        this.initValidStr()
    }

    initValidStr() {
        this.ctx.clearRect(0, 0, 80, 30);
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(${this.random(240, 255)},${this.random(240, 255)},${this.random(240, 255)},0.5)`;
        this.ctx.fillRect(0, 0, 80, 30);
        this.fillValid();
        this.fillPoint();
        this.ctx.closePath();
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }

    fillValid () {
        const x = this.bindDom.width / 6;
        const y = this.bindDom.height / 2;
        const ctx = this.ctx;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(${this.random(0, 224)},${this.random(0, 224)},${this.random(0, 224)},1)`;
        let text = '';
        // 清空之前的validStr内容
        this.validStr = '';
        for (let i = 0; i < 4; i++) {
            text = this.store[this.random(0, this.store.length)];
            this.validStr += text;
            this.ctx.font = '20px SimHei';
            const deg = this.random(-15, 15) * Math.PI / 180;
            ctx.translate(x * (i + 1), y);
            ctx.rotate(deg);
            ctx.fillText(text, 0, 0);
            ctx.rotate(-deg);
            ctx.translate(-x * (i + 1), -y);
        }
    }

    fillPoint () {
        const ctx = this.ctx;
        let i = 0;
        while (++i) {
            ctx.fillStyle = `rgba(${this.random(0, 224)},${this.random(0, 224)},${this.random(0, 224)},0.2)`;
            ctx.beginPath();
            ctx.arc(this.random(0, this.bindDom.width), this.random(0, this.bindDom.height), 1, 0, 2 * Math.PI);
            ctx.fill();
            if (i === 50) {
                break;
            }
        }
    }

}