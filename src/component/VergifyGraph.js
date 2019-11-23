export default VergifyGraph = (function (Main) {
    Main.random = function (min, max) { return Math.floor(Math.random() * (max - min) + min) };
    Main.store = 'abcdefghigklmnopqrstuvwxyz0123456789';
    Main.prototype = {
        validStr: '',
        refresh: function () {
            this.validStr = '';
            this.ctx.clearRect(0, 0, 80, 30);
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(${Main.random(240, 255)},${Main.random(240, 255)},${Main.random(240, 255)},0.5)`;
            this.ctx.fillRect(0, 0, 80, 30);
            this.fillValid();
            this.fillPoint();
            this.ctx.closePath();
        },
        fillValid: function () {
            const x = this.bindDom.width / 6;
            const y = this.bindDom.height / 2;
            const ctx = this.ctx;
            ctx.fillStyle = `rgba(${Main.random(0, 224)},${Main.random(0, 224)},${Main.random(0, 224)},1)`;
            let text = '';
            for (let i = 0; i < 4 && (text = Main.store[Main.random(0, Main.store.length)], this.validStr += text); i++) {
                this.ctx.font = '20px SimHei';
                const deg = Main.random(-15, 15) * Math.PI / 180;
                ctx.translate(x * (i + 1), y);
                ctx.rotate(deg);
                ctx.fillText(text, 0, 0);
                ctx.rotate(-deg);
                ctx.translate(-x * (i + 1), -y);
            }
        },
        initBind: function () {
            const that = this;
            this.bindDom.addEvent('click', function () {
                that.refresh();
            }, true)
        },
        fillPoint: function () {
            const ctx = this.ctx;
            let i = 0;
            while (++i) {
                ctx.fillStyle = `rgba(${Main.random(0, 224)},${Main.random(0, 224)},${Main.random(0, 224)},0.2)`;
                ctx.beginPath();
                ctx.arc(Main.random(0, this.bindDom.width), Main.random(0, this.bindDom.height), 1, 0, 2 * Math.PI);
                ctx.fill();
                if (i == 50) {
                    break;
                }
            }
        }
    };
    return Main;
})(function Main(id = '') {
    this.version = 'version ' + Main.random(1, 10);
    this.bindDom = document.getElementById(id);
    this.bindDom.addEvent = function () {
        const arg = arguments;
        const that = this;
        if (that.addEventListener) {
            that.addEventListener.apply(that, arg);
        } else {
            arg[0] = 'on' + arg[0];
            that.attachEvent.apply(that, arg);
        }
    }
    this.ctx = this.bindDom.getContext('2d');
    this.ctx.textBaseline = 'middle';
    this.initBind();
    this.refresh();
    this.constructor = VergifyGraph;
    VergifyGraph.prototype = Main.prototype;
});

